import { useState } from 'react';
import type { Program } from '../types/program.ts';
import { DataStore } from '../data/store.ts';
import { useToast } from '../hooks/useToast.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useSession } from '../hooks/useSession.ts';
import { Toast } from './Toast.tsx';
import { AuthScreen } from './AuthScreen.tsx';
import { ResumePrompt } from './ResumePrompt.tsx';
import { HomeScreen } from './HomeScreen.tsx';
import { SessionScreen } from './SessionScreen.tsx';
import { HistoryScreen } from './HistoryScreen.tsx';

export function App() {
  const [program] = useState<Program>(() => DataStore.getProgram());
  const { toast, showToast } = useToast();
  const auth = useAuth();
  const session = useSession(program, showToast, auth.user?.id ?? null);

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
          history={session.history}
          onStartSession={session.startSession}
          onShowHistory={() => session.setScreen('history')}
          user={auth.user}
          onSignOut={auth.signOut}
          isConfigured={auth.isConfigured}
        />
      )}

      {session.screen === 'session' && session.day && session.step && (
        <SessionScreen
          activeDay={session.activeDay!}
          day={session.day!}
          step={session.step}
          nextStep={session.nextStep}
          steps={session.steps}
          currentStep={session.currentStep}
          totalSteps={session.steps.length}
          sessionPhase={session.sessionPhase}
          isNewSection={session.isNewSection}
          currentReps={session.currentReps}
          progLevel={session.getProgLevel(session.step.exercise.id)}
          showProg={session.showProg}
          viewMode={session.viewMode}
          sessionData={session.sessionData}
          getProgLevel={session.getProgLevel}
          onSetReps={session.setStepReps}
          onShowProg={session.setShowProg}
          onSetProgLevel={session.setProgLevel}
          onStepDone={session.handleStepDone}
          onRestComplete={session.handleRestComplete}
          onBack={session.handleSessionBack}
          onSetViewMode={session.setViewMode}
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
