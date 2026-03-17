import type { Step } from '../types/step.ts';
import type { SessionData } from '../types/session.ts';
import { ExercisePhase } from './ExercisePhase.tsx';
import { RestPhase } from './RestPhase.tsx';
import { ProgressionDrawer } from './ProgressionDrawer.tsx';
import { SessionOverview } from './SessionOverview.tsx';
import type { SessionPhase } from '../hooks/useSession.ts';

interface Props {
  activeDay: string;
  step: Step;
  nextStep: Step | null;
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  sessionPhase: SessionPhase;
  isNewSection: boolean;
  currentReps: number;
  progLevel: number;
  showProg: boolean;
  viewMode: 'step' | 'overview';
  sessionData: SessionData;
  onSetReps: (step: Step, val: number) => void;
  onShowProg: (show: boolean) => void;
  onSetProgLevel: (exId: string, level: number) => void;
  onStepDone: () => void;
  onRestComplete: () => void;
  onBack: () => void;
  onSetViewMode: (mode: 'step' | 'overview') => void;
}

export function SessionScreen({
  activeDay, step, nextStep, steps, currentStep, totalSteps, sessionPhase,
  isNewSection, currentReps, progLevel, showProg, viewMode, sessionData,
  onSetReps, onShowProg, onSetProgLevel, onStepDone, onRestComplete, onBack,
  onSetViewMode,
}: Props) {
  return (
    <div data-day={activeDay}>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{
          background: 'var(--day-color)',
          width: `${((currentStep + (sessionPhase === 'resting' ? 0.5 : 0)) / totalSteps) * 100}%`,
        }} />
      </div>
      <div className="step-counter">
        <button
          className="overview-toggle"
          onClick={() => onSetViewMode(viewMode === 'step' ? 'overview' : 'step')}
          aria-label={viewMode === 'step' ? 'Show overview' : 'Show current step'}
        >
          {viewMode === 'step' ? '☰' : '←'}
        </button>
        {currentStep + 1} / {totalSteps}
      </div>

      {viewMode === 'overview' && (
        <SessionOverview
          steps={steps}
          currentStep={currentStep}
          sessionData={sessionData}
          onBackToStep={() => onSetViewMode('step')}
        />
      )}

      <div style={{ display: viewMode === 'overview' ? 'none' : undefined }}>
        {sessionPhase === 'exercise' && (
          <ExercisePhase
            step={step}
            currentStep={currentStep}
            isNewSection={isNewSection}
            currentReps={currentReps}
            progLevel={progLevel}
            onSetReps={onSetReps}
            onShowProg={() => onShowProg(true)}
            onDone={onStepDone}
            onBack={onBack}
          />
        )}

        {sessionPhase === 'resting' && (
          <RestPhase
            key={`rest-${currentStep}`}
            duration={step.restAfter}
            nextStep={nextStep}
            onComplete={onRestComplete}
          />
        )}

        {showProg && step && (
          <ProgressionDrawer
            exercise={step.exercise}
            currentLevel={progLevel}
            onSelectLevel={(lvl) => onSetProgLevel(step.exercise.id, lvl)}
            onClose={() => onShowProg(false)}
          />
        )}
      </div>
    </div>
  );
}
