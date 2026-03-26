import { useState, useEffect } from 'react';
import type { Step } from '../types/step.ts';
import type { SessionData } from '../types/session.ts';
import { HoldTimer } from './HoldTimer.tsx';
import { RepWheel } from './RepWheel.tsx';
import { tapFeedback } from '../lib/haptics.ts';

interface Props {
  step: Step;
  currentStep: number;
  isNewSection: boolean;
  currentReps: number;
  sessionData: SessionData;
  getStepReps: (step: Step | null, side?: 'L' | 'R') => number;
  onSetReps: (step: Step | null, val: number, side?: 'L' | 'R') => void;
  onDone: () => void;
  onBack: () => void;
}

/** Parse exercise target string into an array of selectable rep values */
function parseTargetRange(target: string): number[] {
  // Range: "6-12", "8-15", "4-8"
  const rangeMatch = target.match(/^(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1]);
    const hi = parseInt(rangeMatch[2]);
    const vals: number[] = [];
    for (let i = lo; i <= hi; i++) vals.push(i);
    return vals;
  }

  // Single number: "8" → ±2 around it
  const singleMatch = target.match(/^(\d+)/);
  if (singleMatch) {
    const n = parseInt(singleMatch[1]);
    const lo = Math.max(1, n - 2);
    const vals: number[] = [];
    for (let i = lo; i <= n + 2; i++) vals.push(i);
    return vals;
  }

  // Fallback for "max/leg" or other text
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}

/** Get the suggested rep value — previous set's reps, or target midpoint */
function getSuggestedReps(step: Step, sessionData: SessionData, side?: 'L' | 'R'): number | null {
  const key = step.exercise.id + (side ? `_${side}` : '');
  const reps = sessionData[key];
  if (reps) {
    for (let i = step.setIndex - 1; i >= 0; i--) {
      if (reps[i] > 0) return reps[i];
    }
  }
  const rangeMatch = step.exercise.target.match(/^(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
  }
  const singleMatch = step.exercise.target.match(/^(\d+)/);
  if (singleMatch) return parseInt(singleMatch[1]);
  return null;
}

export function ExercisePhase({
  step, currentStep, isNewSection, currentReps, sessionData,
  getStepReps, onSetReps, onDone, onBack,
}: Props) {
  const isHold = !!step.exercise.isHold;
  const isUnilateral = step.isUnilateral;
  const pills = isHold ? [] : parseTargetRange(step.exercise.target);

  const leftReps = isUnilateral ? getStepReps(step, 'L') : 0;
  const rightReps = isUnilateral ? getStepReps(step, 'R') : 0;
  const bilateralDone = isUnilateral && leftReps > 0 && rightReps > 0;

  const suggestedL = isUnilateral ? getSuggestedReps(step, sessionData, 'L') : null;
  const suggestedR = isUnilateral ? getSuggestedReps(step, sessionData, 'R') : null;
  const suggested = !isUnilateral && !isHold ? getSuggestedReps(step, sessionData) : null;

  const [activeSide, setActiveSide] = useState<'L' | 'R'>('L');
  useEffect(() => { setActiveSide('L'); }, [currentStep]);

  const activeReps = activeSide === 'L' ? leftReps : rightReps;
  const activeSuggested = activeSide === 'L' ? suggestedL : suggestedR;

  return (
    <div key={currentStep} className="fade-in" style={{
      padding: '50px var(--space-5) var(--space-5)', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
    }}>
      <button className="btn-icon" onClick={onBack}
        style={{ position: 'fixed', top: 'var(--space-2)', left: 'var(--space-4)', zIndex: 'var(--z-controls)' }}>
        &#x2190;
      </button>

      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span className="text-meta" style={{ color: 'var(--day-color)' }}>
            {step.sectionLabel}
          </span>
          {isNewSection && (
            <span style={{
              fontSize: 'var(--text-xs)', background: 'var(--day-bg)', color: 'var(--day-color)',
              padding: '2px var(--space-2)', borderRadius: 'var(--radius-sm)', fontWeight: 700,
            }}>NEW</span>
          )}
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Set {step.setNumber} of {step.totalSets}
        </span>
      </div>

      <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, textAlign: 'center', marginBottom: 'var(--space-8)', lineHeight: 1.2 }}>
        {step.exercise.name}
      </h2>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        {isHold ? (
          <HoldTimer
            key={`hold-${step.exercise.id}-${step.setIndex}`}
            value={currentReps}
            onChange={(val) => onSetReps(step, val)}
          />
        ) : isUnilateral ? (
          <>
            <div className="side-toggle">
              <button
                className={`side-toggle-btn${activeSide === 'L' ? ' active' : ''}`}
                onClick={() => setActiveSide('L')}
              >
                LEFT
                {leftReps > 0 && <span className="side-toggle-badge">{leftReps}</span>}
              </button>
              <button
                className={`side-toggle-btn${activeSide === 'R' ? ' active' : ''}`}
                onClick={() => setActiveSide('R')}
              >
                RIGHT
                {rightReps > 0 && <span className="side-toggle-badge">{rightReps}</span>}
              </button>
            </div>
            <RepWheel
              values={pills}
              value={activeReps}
              suggested={activeSuggested}
              onChange={(v) => {
                onSetReps(step, v, activeSide);
                if (activeSide === 'L' && rightReps === 0) {
                  setTimeout(() => setActiveSide('R'), 300);
                }
              }}
              onConfirm={() => {
                if (activeSide === 'L') setActiveSide('R');
              }}
            />
            <div className="rep-wheel-adjust">
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, activeReps - 1), activeSide); }}>&#x2212;</button>
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, activeReps + 1, activeSide); }}>+</button>
            </div>
          </>
        ) : (
          <>
            <RepWheel
              values={pills}
              value={currentReps}
              suggested={suggested}
              onChange={(v) => onSetReps(step, v)}
              onConfirm={onDone}
              autoAdvanceOnTap
            />
            <div className="rep-wheel-adjust">
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, currentReps - 1)); }}>&#x2212;</button>
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, currentReps + 1); }}>+</button>
            </div>
          </>
        )}
      </div>

      {(isHold || isUnilateral) && (
        <button
          onClick={onDone}
          className="btn-primary"
          disabled={isUnilateral && !bilateralDone}
          style={{
            background: (isUnilateral && !bilateralDone)
              ? 'var(--bg-subtle)'
              : 'linear-gradient(135deg,var(--day-color),rgba(var(--day-color-rgb),0.67))',
            marginBottom: 'var(--space-5)',
            opacity: (isUnilateral && !bilateralDone) ? 0.5 : 1,
          }}
        >
          DONE &#x2192;
        </button>
      )}
    </div>
  );
}
