import { useState, useEffect, useCallback } from 'react';
import type { Program } from '../types/program.ts';
import type { Session, SessionDraft, SessionData } from '../types/session.ts';
import type { Step } from '../types/step.ts';
import { generateSteps } from '../lib/steps.ts';
import { DataStore } from '../data/store.ts';
import { SyncedStore } from '../data/synced-store.ts';

export type Screen = 'home' | 'session' | 'history' | 'coaching';

export function useSession(program: Program, showToast: (msg: string) => void, userId: string | null) {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData>({});
  const [sessionStart, setSessionStart] = useState<string | null>(null);
  const [history, setHistory] = useState<Session[]>(() => DataStore.getSessions());
  const [progressions, setProgressions] = useState<Record<string, number>>(() => DataStore.getProgressions());

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showProg, setShowProg] = useState(false);
  const [viewMode, setViewMode] = useState<'step' | 'map'>('step');
  const [lastCompletedSession, setLastCompletedSession] = useState<Session | null>(null);

  const [pendingDraft, setPendingDraft] = useState<SessionDraft | null>(() => {
    const draft = DataStore.getDraft();
    if (!draft) return null;
    const age = Date.now() - new Date(draft.savedAt).getTime();
    if (age > 24 * 60 * 60 * 1000) { DataStore.clearDraft(); return null; }
    return draft;
  });

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (!userId) return;

    // Migrate local data first, then load from cloud
    SyncedStore.migrateLocalData(userId).then(() => {
      return Promise.all([
        SyncedStore.getSessions(userId),
        SyncedStore.getProgressions(userId),
      ]);
    }).then(([sessions, progs]) => {
      setHistory(sessions);
      setProgressions(progs);
    });

    // Process any queued sync items
    SyncedStore.processQueue(userId);

    // Re-process queue when coming back online
    const handleOnline = () => SyncedStore.processQueue(userId);
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [userId]);

  // Auto-save draft (always local — drafts are ephemeral)
  useEffect(() => {
    if (screen !== 'session' || !activeDay) return;
    const timer = setTimeout(() => {
      DataStore.saveDraft({
        day: activeDay,
        data: sessionData,
        start: sessionStart!,
        currentStep,
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [screen, activeDay, sessionData, sessionStart, currentStep]);

  const startSession = useCallback((dayKey: string) => {
    const day = program.days[dayKey];
    const newSteps = generateSteps(day);
    setSteps(newSteps);
    setCurrentStep(0);
    setShowProg(false);
    setViewMode('step');
    setActiveDay(dayKey);
    setSessionData({});
    setSessionStart(new Date().toISOString());
    DataStore.clearDraft();
    setScreen('session');
  }, [program]);

  const resumeSession = useCallback(() => {
    if (!pendingDraft) return;
    const day = program.days[pendingDraft.day];
    const newSteps = generateSteps(day);
    setSteps(newSteps);
    setCurrentStep(pendingDraft.currentStep || 0);
    setShowProg(false);
    setViewMode('step');
    setActiveDay(pendingDraft.day);
    setSessionData(pendingDraft.data || {});
    setSessionStart(pendingDraft.start);
    setPendingDraft(null);
    setScreen('session');
  }, [pendingDraft, program]);

  const discardDraft = useCallback(() => {
    DataStore.clearDraft();
    setPendingDraft(null);
  }, []);

  const getStepReps = useCallback((step: Step | null, side?: 'L' | 'R'): number => {
    if (!step) return 0;
    const key = step.exercise.id + (side ? `_${side}` : '');
    const reps = sessionData[key] || new Array(step.totalSets).fill(0);
    return reps[step.setIndex] || 0;
  }, [sessionData]);

  const setStepReps = useCallback((step: Step | null, val: number, side?: 'L' | 'R') => {
    if (!step) return;
    const key = step.exercise.id + (side ? `_${side}` : '');
    const reps = sessionData[key] || new Array(step.totalSets).fill(0);
    const newReps = [...reps];
    newReps[step.setIndex] = val;
    setSessionData(d => ({ ...d, [key]: newReps }));
  }, [sessionData]);

  const getProgLevel = useCallback((exId: string) => progressions[exId] || 0, [progressions]);

  const setProgLevel = useCallback((exId: string, level: number) => {
    const next = { ...progressions, [exId]: level };
    setProgressions(next);
    if (userId) {
      SyncedStore.saveProgressions(userId, next);
    } else {
      DataStore.saveProgressions(next);
    }
  }, [progressions, userId]);

  const finishSession = useCallback(() => {
    const entry: Session = {
      id: Date.now(),
      day: activeDay!,
      date: sessionStart!,
      endDate: new Date().toISOString(),
      exercises: sessionData,
      progressions: { ...progressions },
    };
    const h = [entry, ...history];
    setHistory(h);

    if (userId) {
      SyncedStore.saveSession(userId, entry);
    } else {
      DataStore.saveSessions(h);
    }

    DataStore.clearDraft();

    // Show coaching screen if authenticated + online
    if (userId && navigator.onLine) {
      setLastCompletedSession(entry);
      setScreen('coaching');
    } else {
      setScreen('home');
      setActiveDay(null);
    }
    showToast('Session saved!');
  }, [activeDay, sessionStart, sessionData, progressions, history, showToast, userId]);

  const dismissCoaching = useCallback(() => {
    setScreen('home');
    setActiveDay(null);
    setLastCompletedSession(null);
  }, []);

  const updateSessionFeedback = useCallback((sessionId: number, feedback: string) => {
    setHistory(h => {
      const updated = h.map(s => s.id === sessionId ? { ...s, coachingFeedback: feedback } : s);
      if (userId) {
        SyncedStore.saveSession(userId, updated.find(s => s.id === sessionId)!);
      } else {
        DataStore.saveSessions(updated);
      }
      return updated;
    });
  }, [userId]);

  const handleStepDone = useCallback(() => {
    setShowProg(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishSession();
    }
  }, [steps, currentStep, finishSession]);

  const handleSessionBack = useCallback(() => {
    setShowProg(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      if (confirm('End session without saving?')) {
        DataStore.clearDraft();
        setScreen('home');
        setActiveDay(null);
      }
    }
  }, [currentStep]);

  const day = activeDay ? program.days[activeDay] : null;
  const step = (screen === 'session' && steps.length > 0 && currentStep < steps.length)
    ? steps[currentStep] : null;
  const prevStep = (step && currentStep > 0) ? steps[currentStep - 1] : null;
  const isNewSection = !!(step && prevStep && step.sectionLabel !== prevStep.sectionLabel);
  const currentReps = getStepReps(step);

  return {
    screen, setScreen,
    activeDay, day,
    sessionData, history, setHistory, progressions, setProgressions,
    steps, currentStep, showProg, setShowProg,
    viewMode, setViewMode,
    pendingDraft, step, isNewSection, currentReps,
    lastCompletedSession,
    startSession, resumeSession, discardDraft,
    getStepReps, setStepReps, getProgLevel, setProgLevel,
    finishSession, dismissCoaching, updateSessionFeedback, handleStepDone, handleSessionBack,
  } as const;
}
