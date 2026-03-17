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
  onSetReps: (step: Step, val: number) => void;
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
function getSuggestedReps(step: Step, sessionData: SessionData): number | null {
  const key = step.exercise.id + (step.side ? `_${step.side}` : '');
  const reps = sessionData[key];
  if (reps) {
    // Look at previous set
    for (let i = step.setIndex - 1; i >= 0; i--) {
      if (reps[i] > 0) return reps[i];
    }
  }
  // Target midpoint
  const rangeMatch = step.exercise.target.match(/^(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
  }
  const singleMatch = step.exercise.target.match(/^(\d+)/);
  if (singleMatch) return parseInt(singleMatch[1]);
  return null;
}

export function ExercisePhase({
  step, currentStep, isNewSection, currentReps, progLevel, sessionData,
  onSetReps, onShowProg, onDone, onBack,
}: Props) {
  const isHold = !!step.exercise.isHold;
  const pills = isHold ? [] : parseTargetRange(step.exercise.target);
  const suggested = isHold ? null : getSuggestedReps(step, sessionData);

  const handlePillTap = (val: number) => {
    tapFeedback();
    onSetReps(step, val);
    onDone();
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
          {step.sectionType === 'superset'
            ? `Round ${step.roundNumber} of ${step.totalRounds}`
            : `Set ${step.setNumber} of ${step.totalSets}`}
        </span>
      </div>

      <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, textAlign: 'center', marginBottom: '6px', lineHeight: 1.2 }}>
        {step.exercise.name}
      </h2>

      {step.side && (
        <p style={{
          textAlign: 'center', fontSize: 'var(--text-lg)', fontWeight: 800,
          color: 'var(--day-color)', letterSpacing: '0.1em',
          marginBottom: '2px',
        }}>
          {step.side === 'L' ? 'LEFT' : 'RIGHT'}
        </p>
      )}

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

            {/* Tiny +/- fallback for edge cases */}
            <div className="quick-select-fallback">
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, currentReps - 1)); }}>−</button>
              <span className="count">{currentReps}</span>
              <button className="btn-counter-sm" onClick={() => { tapFeedback(); onSetReps(step, currentReps + 1); }}>+</button>
            </div>
          </>
        )}
      </div>

      {step.isLastSet && (
        <div style={{
          background: 'rgba(255,107,53,.08)', borderRadius: 'var(--radius-xl)', padding: '14px var(--space-4)',
          border: '1px solid rgba(255,107,53,.15)', marginBottom: 'var(--space-4)', textAlign: 'center',
        }}>
          <p style={{ fontSize: 'var(--text-md)', color: '#FF6B35', fontWeight: 700 }}>
            Last set — go all out!
          </p>
        </div>
      )}

      {!step.isLastSet && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
            Stop with 1-2 reps in reserve
          </p>
        </div>
      )}

      {/* DONE button only for hold exercises */}
      {isHold && (
        <button onClick={onDone} className="btn-primary"
          style={{ background: 'linear-gradient(135deg,var(--day-color),rgba(var(--day-color-rgb),0.67))', marginBottom: 'var(--space-5)' }}>
          DONE →
        </button>
      )}
    </div>
  );
}
