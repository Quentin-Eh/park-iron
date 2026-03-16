import type { Step } from '../types/step.ts';
import { ExercisePhase } from './ExercisePhase.tsx';
import { RestPhase } from './RestPhase.tsx';
import { ProgressionDrawer } from './ProgressionDrawer.tsx';
import type { SessionPhase } from '../hooks/useSession.ts';

interface Props {
  activeDay: string;
  step: Step;
  nextStep: Step | null;
  currentStep: number;
  totalSteps: number;
  sessionPhase: SessionPhase;
  isNewSection: boolean;
  currentReps: number;
  progLevel: number;
  showProg: boolean;
  onSetReps: (step: Step, val: number) => void;
  onShowProg: (show: boolean) => void;
  onSetProgLevel: (exId: string, level: number) => void;
  onStepDone: () => void;
  onRestComplete: () => void;
  onBack: () => void;
}

export function SessionScreen({
  activeDay, step, nextStep, currentStep, totalSteps, sessionPhase,
  isNewSection, currentReps, progLevel, showProg,
  onSetReps, onShowProg, onSetProgLevel, onStepDone, onRestComplete, onBack,
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
        {currentStep + 1} / {totalSteps}
      </div>

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
  );
}
