import { useCallback, useRef } from 'react';
import type { Step } from '../types/step.ts';
import type { Day } from '../types/program.ts';
import type { SessionData } from '../types/session.ts';
import { ExercisePhase } from './ExercisePhase.tsx';
import { ProgressionDrawer } from './ProgressionDrawer.tsx';
import { SessionMap } from './SessionMap.tsx';
import { useSwipe } from '../hooks/useSwipe.ts';

interface Props {
  activeDay: string;
  day: Day;
  step: Step;
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  isNewSection: boolean;
  currentReps: number;
  progLevel: number;
  showProg: boolean;
  viewMode: 'step' | 'map';
  sessionData: SessionData;
  getProgLevel: (exId: string) => number;
  getStepReps: (step: Step | null, side?: 'L' | 'R') => number;
  onSetReps: (step: Step | null, val: number, side?: 'L' | 'R') => void;
  onShowProg: (show: boolean) => void;
  onSetProgLevel: (exId: string, level: number) => void;
  onStepDone: () => void;
  onBack: () => void;
  onSetViewMode: (mode: 'step' | 'map') => void;
}

export function SessionScreen({
  activeDay, day, step, steps, currentStep, totalSteps,
  isNewSection, currentReps, progLevel, showProg, viewMode, sessionData,
  getProgLevel, getStepReps, onSetReps, onShowProg, onSetProgLevel, onStepDone, onBack,
  onSetViewMode,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleSwipe = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    if (dir === 'up' && viewMode === 'step') {
      onSetViewMode('map');
    } else if (dir === 'down' && viewMode === 'map') {
      const el = mapRef.current;
      if (!el || el.scrollTop <= 5) {
        onSetViewMode('step');
      }
    }
  }, [viewMode, onSetViewMode]);

  const swipe = useSwipe(handleSwipe);

  const isMap = viewMode === 'map';

  return (
    <div data-day={activeDay} {...swipe}>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{
          background: 'var(--day-color)',
          width: `${((currentStep) / totalSteps) * 100}%`,
        }} />
      </div>
      <div className="step-counter">
        {currentStep + 1} / {totalSteps}
      </div>

      <div
        className={`zoom-layer step-layer ${isMap ? 'zoom-out' : 'zoom-active'}`}
        aria-hidden={isMap}
      >
        <ExercisePhase
          step={step}
          currentStep={currentStep}
          isNewSection={isNewSection}
          currentReps={currentReps}
          progLevel={progLevel}
          sessionData={sessionData}
          getStepReps={getStepReps}
          onSetReps={onSetReps}
          onShowProg={() => onShowProg(true)}
          onDone={onStepDone}
          onBack={onBack}
        />

        {showProg && step && (
          <ProgressionDrawer
            exercise={step.exercise}
            currentLevel={progLevel}
            onSelectLevel={(lvl) => onSetProgLevel(step.exercise.id, lvl)}
            onClose={() => onShowProg(false)}
          />
        )}

        {!isMap && (
          <div className="swipe-up-hint" onClick={() => onSetViewMode('map')}>
            <div className="swipe-up-chevron" />
            <span>Session map</span>
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className={`zoom-layer map-layer ${isMap ? 'zoom-active' : 'zoom-in'}`}
        aria-hidden={!isMap}
      >
        <SessionMap
          day={day}
          steps={steps}
          currentStep={currentStep}
          sessionData={sessionData}
          getProgLevel={getProgLevel}
          onClose={() => onSetViewMode('step')}
        />
      </div>
    </div>
  );
}
