import { useState, useCallback } from 'react';
import type { Program } from '../types/program.ts';
import { DataStore } from '../data/store.ts';
import { DEFAULT_PROGRAM } from '../data/default-program.ts';
import { PROGRAMS } from '../data/programs.ts';
import { useToast } from '../hooks/useToast.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useSession } from '../hooks/useSession.ts';
import { Toast } from './Toast.tsx';
import { AuthScreen } from './AuthScreen.tsx';
import { ResumePrompt } from './ResumePrompt.tsx';
import { HomeScreen } from './HomeScreen.tsx';
import { SessionScreen } from './SessionScreen.tsx';
import { HistoryScreen } from './HistoryScreen.tsx';
import { CoachingScreen } from './CoachingScreen.tsx';
import { OnboardingScreen } from './OnboardingScreen.tsx';

export function App() {
  const [program, setProgram] = useState<Program>(() => DataStore.getProgram());
  const [showOnboarding, setShowOnboarding] = useState(() => !DataStore.hasProgram());
  const { toast, showToast } = useToast();
  const auth = useAuth();
  const session = useSession(program, showToast, auth.user?.id ?? null);

  const handleSwitchProgram = useCallback((id: string) => {
    // Clear any in-flight draft before switching — the draft references a
    // dayKey + step index from the previous program and won't map cleanly.
    // Also dismiss any pending resume prompt held in session state.
    session.discardDraft();
    DataStore.setActiveProgramId(id);
    const next = DataStore.getProgram();
    setProgram(next);
    showToast(`Switched to ${next.name}`);
  }, [showToast, session]);

  // Show auth screen if Supabase is configured but user hasn't logged in or skipped
  if (auth.isConfigured && auth.mode === 'loading' && !auth.loading) {
    return (
      <>
        {toast && <Toast message={toast} />}
        <AuthScreen
          loading={auth.loading}
          error={auth.error}
          onMagicLink={auth.signInWithMagicLink}
          onGoogle={auth.signInWithGoogle}
          onSkip={auth.skipAuth}
        />
      </>
    );
  }

  if (showOnboarding) {
    return (
      <>
        {toast && <Toast message={toast} />}
        <OnboardingScreen
          onComplete={(p) => { setProgram(p); setShowOnboarding(false); }}
          onSkip={() => { DataStore.saveProgram(DEFAULT_PROGRAM); setProgram(DEFAULT_PROGRAM); setShowOnboarding(false); }}
          userId={auth.user?.id ?? null}
        />
      </>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast} />}

      {session.pendingDraft && session.screen === 'home' && (
        <ResumePrompt
          draft={session.pendingDraft}
          program={program}
          onResume={session.resumeSession}
          onDiscard={session.discardDraft}
        />
      )}

      {session.screen === 'home' && (
        <HomeScreen
          program={program}
          programs={PROGRAMS}
          history={session.history}
          onStartSession={session.startSession}
          onShowHistory={() => session.setScreen('history')}
          onSwitchProgram={handleSwitchProgram}
          user={auth.user}
          onSignOut={auth.signOut}
          isConfigured={auth.isConfigured}
          onCustomize={() => setShowOnboarding(true)}
        />
      )}

      {session.screen === 'session' && session.day && session.step && (
        <SessionScreen
          activeDay={session.activeDay!}
          day={session.day!}
          step={session.step}
          steps={session.steps}
          currentStep={session.currentStep}
          totalSteps={session.steps.length}
          isNewSection={session.isNewSection}
          currentReps={session.currentReps}
          viewMode={session.viewMode}
          sessionData={session.sessionData}
          getProgLevel={session.getProgLevel}
          getStepReps={session.getStepReps}
          onSetReps={session.setStepReps}
          onSetProgLevel={session.setProgLevel}
          onStepDone={session.handleStepDone}
          onBack={session.handleSessionBack}
          onSetViewMode={session.setViewMode}
        />
      )}

      {session.screen === 'coaching' && session.lastCompletedSession && (
        <CoachingScreen
          session={session.lastCompletedSession}
          program={program}
          userId={auth.user!.id}
          onDone={session.dismissCoaching}
          onFeedbackReceived={session.updateSessionFeedback}
        />
      )}

      {session.screen === 'history' && (
        <HistoryScreen
          program={program}
          history={session.history}
          setHistory={session.setHistory}
          setProgressions={session.setProgressions}
          showToast={showToast}
          onBack={() => session.setScreen('home')}
        />
      )}
    </div>
  );
}
