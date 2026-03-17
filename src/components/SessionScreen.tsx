import { useCallback } from 'react';
import type { Step } from '../types/step.ts';
import type { Day } from '../types/program.ts';
import type { SessionData } from '../types/session.ts';
import { ExercisePhase } from './ExercisePhase.tsx';
import { RestPhase } from './RestPhase.tsx';
import { ProgressionDrawer } from './ProgressionDrawer.tsx';
import { SessionOverview } from './SessionOverview.tsx';
import { ExerciseGuide } from './ExerciseGuide.tsx';
import { useSwipe } from '../hooks/useSwipe.ts';
import type { SessionPhase } from '../hooks/useSession.ts';

interface Props {
  activeDay: string;
  day: Day;
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
  viewMode: 'step' | 'overview' | 'exercises';
  sessionData: SessionData;
  getProgLevel: (exId: string) => number;
  onSetReps: (step: Step, val: number) => void;
  onShowProg: (show: boolean) => void;
  onSetProgLevel: (exId: string, level: number) => void;
  onStepDone: () => void;
  onRestComplete: () => void;
  onBack: () => void;
  onSetViewMode: (mode: 'step' | 'overview' | 'exercises') => void;
}

export function SessionScreen({
  activeDay, day, step, nextStep, steps, currentStep, totalSteps, sessionPhase,
  isNewSection, currentReps, progLevel, showProg, viewMode, sessionData,
  getProgLevel, onSetReps, onShowProg, onSetProgLevel, onStepDone, onRestComplete, onBack,
  onSetViewMode,
}: Props) {
  const VIEW_ORDER = ['step', 'overview', 'exercises'] as const;

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    const idx = VIEW_ORDER.indexOf(viewMode);
    if (dir === 'left' && idx < VIEW_ORDER.length - 1) {
      onSetViewMode(VIEW_ORDER[idx + 1]);
    } else if (dir === 'right' && idx > 0) {
      onSetViewMode(VIEW_ORDER[idx - 1]);
    }
  }, [viewMode, onSetViewMode]);

  const swipe = useSwipe(handleSwipe);

  return (
    <div data-day={activeDay} {...swipe}>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{
          background: 'var(--day-color)',
          width: `${((currentStep + (sessionPhase === 'resting' ? 0.5 : 0)) / totalSteps) * 100}%`,
        }} />
      </div>
      <div className="step-counter">
        {viewMode !== 'step' ? (
          <button
            className="overview-toggle"
            onClick={() => onSetViewMode('step')}
            aria-label="Show current step"
          >
            ←
          </button>
        ) : (
          <>
            <button
              className="overview-toggle"
              onClick={() => onSetViewMode('overview')}
              aria-label="Show overview"
            >
              ☰
            </button>
            <button
              className="overview-toggle"
              onClick={() => onSetViewMode('exercises')}
              aria-label="Show exercise guide"
            >
              📋
            </button>
          </>
        )}
        {currentStep + 1} / {totalSteps}
        <div className="view-dots">
          {VIEW_ORDER.map((v) => (
            <span
              key={v}
              className={`view-dot ${v === viewMode ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {viewMode === 'overview' && (
        <SessionOverview
          steps={steps}
          currentStep={currentStep}
          sessionData={sessionData}
          onBackToStep={() => onSetViewMode('step')}
        />
      )}

      {viewMode === 'exercises' && (
        <ExerciseGuide
          day={day}
          getProgLevel={getProgLevel}
          onBackToStep={() => onSetViewMode('step')}
        />
      )}

      <div style={{ display: viewMode !== 'step' ? 'none' : undefined }}>
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
