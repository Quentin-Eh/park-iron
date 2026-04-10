import { useState, useCallback } from 'react';
import type { Program } from '../types/program.ts';
import type {
  OnboardingAnswers,
  Experience,
  Equipment,
  Goal,
  DaysPerWeek,
  SessionLength,
} from '../types/onboarding.ts';
import { SyncedStore } from '../data/synced-store.ts';
import { DataStore } from '../data/store.ts';
import { DEFAULT_PROGRAM } from '../data/default-program.ts';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4;

type Phase = 'questions' | 'generating' | 'review' | 'error';

interface OnboardingState {
  step: OnboardingStep;
  phase: Phase;
  answers: Partial<OnboardingAnswers>;
  generatedProgram: Program | null;
  error: string | null;
}

export function useOnboarding(
  onComplete: (program: Program) => void,
  onSkip: () => void,
  userId: string | null,
) {
  const [state, setState] = useState<OnboardingState>({
    step: 0,
    phase: 'questions',
    answers: { equipment: [] },
    generatedProgram: null,
    error: null,
  });

  const setExperience = useCallback((v: Experience) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, experience: v },
      step: 1 as OnboardingStep,
    }));
  }, []);

  const setEquipment = useCallback((items: Equipment[]) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, equipment: items },
    }));
  }, []);

  const setGoal = useCallback((v: Goal) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, goal: v },
      step: 3 as OnboardingStep,
    }));
  }, []);

  const setDays = useCallback((v: DaysPerWeek) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, days: v },
      step: 4 as OnboardingStep,
    }));
  }, []);

  const setSessionLength = useCallback((v: SessionLength) => {
    setState(s => ({
      ...s,
      answers: { ...s.answers, sessionLength: v },
    }));
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    setState(s => ({ ...s, step, phase: 'questions' }));
  }, []);

  const advanceFromEquipment = useCallback(() => {
    setState(s => {
      if (!s.answers.equipment || s.answers.equipment.length === 0) return s;
      return { ...s, step: 2 as OnboardingStep };
    });
  }, []);

  const generate = useCallback(async () => {
    const { answers } = state;
    if (
      !answers.experience ||
      !answers.equipment?.length ||
      !answers.goal ||
      !answers.days ||
      !answers.sessionLength
    ) {
      return;
    }

    setState(s => ({ ...s, phase: 'generating', error: null }));

    try {
      const program = await SyncedStore.generateProgram(
        answers as OnboardingAnswers,
      );

      setState(s => ({
        ...s,
        phase: 'review',
        generatedProgram: program,
      }));
    } catch {
      setState(s => ({
        ...s,
        phase: 'error',
        error: 'Failed to generate your program. You can try again or use the default.',
      }));
    }
  }, [state]);

  const accept = useCallback(async () => {
    if (!state.generatedProgram) return;

    // Generated programs come from the edge function and may be missing the
    // multi-program fields added in schema v5. Normalise so they behave as a
    // customized weekly rest-pause program.
    const normalised: Program = {
      ...state.generatedProgram,
      id: state.generatedProgram.id ?? DEFAULT_PROGRAM.id,
      scheduleMode: state.generatedProgram.scheduleMode ?? 'weekly',
    };

    if (userId) {
      await SyncedStore.saveProgram(userId, normalised);
    } else {
      DataStore.saveProgram(normalised);
    }

    onComplete(normalised);
  }, [state.generatedProgram, userId, onComplete]);

  const regenerate = useCallback(() => {
    setState(s => ({ ...s, phase: 'questions', step: 0 as OnboardingStep, generatedProgram: null, error: null }));
  }, []);

  const useDefault = useCallback(() => {
    DataStore.saveProgram(DEFAULT_PROGRAM);
    onSkip();
  }, [onSkip]);

  const canGenerate =
    !!state.answers.experience &&
    !!state.answers.equipment?.length &&
    !!state.answers.goal &&
    !!state.answers.days &&
    !!state.answers.sessionLength;

  return {
    ...state,
    canGenerate,
    setExperience,
    setEquipment,
    advanceFromEquipment,
    setGoal,
    setDays,
    setSessionLength,
    goToStep,
    generate,
    accept,
    regenerate,
    useDefault,
  };
}
