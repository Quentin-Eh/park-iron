import type { Step } from '../types/step.ts';
import type { SessionData } from '../types/session.ts';
import { HoldTimer } from './HoldTimer.tsx';
import { tapFeedback } from '../lib/haptics.ts';

interface Props {
  step: Step;
  currentStep: number;
  isNewSection: boolean;
  currentReps: number;
  progLevel: number;
  sessionData: SessionData;
  getStepReps: (step: Step | null, side?: 'L' | 'R') => number;
  onSetReps: (step: Step | null, val: number, side?: 'L' | 'R') => void;
  onShowProg: () => void;
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

function SidePills({ side, reps, suggested, pills, step, onTap, onSetReps }: {
  side: 'L' | 'R';
  reps: number;
  suggested: number | null;
  pills: number[];
  step: Step;
  onTap: (val: number, side: 'L' | 'R') => void;
  onSetReps: (step: Step | null, val: number, side?: 'L' | 'R') => void;
}) {
  return (
    <div style={{ marginBottom: side === 'L' ? 'var(--space-5)' : undefined, width: '100%' }}>
      <p style={{
        textAlign: 'center', fontSize: 'var(--text-lg)', fontWeight: 800,
        color: 'var(--day-color)', letterSpacing: '0.1em', marginBottom: 'var(--space-2)',
      }}>
        {side === 'L' ? 'LEFT' : 'RIGHT'}
      </p>
      <div className="quick-select-row">
        {pills.map((val) => (
          <button
            key={val}
            className={`quick-select-pill${val === suggested ? ' suggested' : ''}${val === reps ? ' selected' : ''}`}
            onClick={() => onTap(val, side)}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="quick-select-fallback">
        <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, reps - 1), side); }}>−</button>
        <span className="count">{reps}</span>
        <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, reps + 1, side); }}>+</button>
      </div>
    </div>
  );
}

export function ExercisePhase({
  step, currentStep, isNewSection, currentReps, progLevel, sessionData,
  getStepReps, onSetReps, onShowProg, onDone, onBack,
}: Props) {
  const isHold = !!step.exercise.isHold;
  const isUnilateral = step.isUnilateral;
  const pills = isHold ? [] : parseTargetRange(step.exercise.target);

  // For bilateral: check if both sides have been logged this set
  const leftReps = isUnilateral ? getStepReps(step, 'L') : 0;
  const rightReps = isUnilateral ? getStepReps(step, 'R') : 0;
  const bilateralDone = isUnilateral && leftReps > 0 && rightReps > 0;

  const suggestedL = isUnilateral ? getSuggestedReps(step, sessionData, 'L') : null;
  const suggestedR = isUnilateral ? getSuggestedReps(step, sessionData, 'R') : null;
  const suggested = !isUnilateral && !isHold ? getSuggestedReps(step, sessionData) : null;

  const handlePillTap = (val: number) => {
    tapFeedback();
    onSetReps(step, val);
    onDone();
  };

  const handleBilateralPillTap = (val: number, side: 'L' | 'R') => {
    tapFeedback();
    onSetReps(step, val, side);
  };

  return (
    <div key={currentStep} className="fade-in" style={{
      padding: '50px var(--space-5) var(--space-5)', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
    }}>
      <button className="btn-icon" onClick={onBack}
        style={{ position: 'fixed', top: 'var(--space-2)', left: 'var(--space-4)', zIndex: 'var(--z-controls)' }}>
        ←
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

      <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, textAlign: 'center', marginBottom: '6px', lineHeight: 1.2 }}>
        {step.exercise.name}
      </h2>

      <p style={{ textAlign: 'center', color: 'var(--day-color)', fontSize: 'var(--text-base)', fontWeight: 500, marginBottom: 'var(--space-1)' }}>
        {step.exercise.progression[progLevel] || step.exercise.progression[0]}
      </p>

      <p className="text-body" style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
        {step.exercise.detail}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
        <span style={{
          background: 'var(--day-bg)', color: 'var(--day-color)', fontSize: 'var(--text-base)', fontWeight: 600,
          padding: '6px var(--space-4)', borderRadius: 'var(--radius-md)',
        }}>
          Target: {step.exercise.target}{isHold ? '' : ' reps'}
        </span>
        <button onClick={onShowProg} style={{
          background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700,
          padding: '6px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        }}>
          ↑ Prog
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        {isHold ? (
          <HoldTimer
            key={`hold-${step.exercise.id}-${step.setIndex}`}
            value={currentReps}
            onChange={(val) => onSetReps(step, val)}
          />
        ) : isUnilateral ? (
          <>
            <SidePills side="L" reps={leftReps} suggested={suggestedL} pills={pills} step={step} onTap={handleBilateralPillTap} onSetReps={onSetReps} />
            <SidePills side="R" reps={rightReps} suggested={suggestedR} pills={pills} step={step} onTap={handleBilateralPillTap} onSetReps={onSetReps} />
          </>
        ) : (
          <>
            {/* Quick-select pills */}
            <div className="quick-select-row">
              {pills.map((val) => (
                <button
                  key={val}
                  className={`quick-select-pill${val === suggested ? ' suggested' : ''}`}
                  onClick={() => handlePillTap(val)}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* +/- fallback for edge cases */}
            <div className="quick-select-fallback">
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, currentReps - 1)); }}>−</button>
              <span className="count">{currentReps}</span>
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, currentReps + 1); }}>+</button>
            </div>
          </>
        )}
      </div>

      {/* DONE button for hold exercises and bilateral exercises */}
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
          DONE →
        </button>
      )}
    </div>
  );
}
