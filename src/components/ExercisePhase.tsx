import type { Step } from '../types/step.ts';
import { HoldTimer } from './HoldTimer.tsx';
import { tapFeedback } from '../lib/haptics.ts';

interface Props {
  step: Step;
  currentStep: number;
  isNewSection: boolean;
  currentReps: number;
  progLevel: number;
  onSetReps: (step: Step, val: number) => void;
  onShowProg: () => void;
  onDone: () => void;
  onBack: () => void;
}

export function ExercisePhase({
  step, currentStep, isNewSection, currentReps, progLevel,
  onSetReps, onShowProg, onDone, onBack,
}: Props) {
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
          Target: {step.exercise.target}{step.exercise.isHold ? '' : ' reps'}
        </span>
        <button onClick={onShowProg} style={{
          background: 'var(--bg-subtle)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700,
          padding: '6px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
        }}>
          ↑ Prog
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        {step.exercise.isHold ? (
          <HoldTimer
            key={`hold-${step.exercise.id}-${step.setIndex}`}
            value={currentReps}
            onChange={(val) => onSetReps(step, val)}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <button className="btn-counter" onClick={() => { tapFeedback(); onSetReps(step, Math.max(0, currentReps - 1)); }}>−</button>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-hero)', fontWeight: 700,
              minWidth: 80, textAlign: 'center',
            }}>{currentReps}</span>
            <button className="btn-counter" onClick={() => { tapFeedback(); onSetReps(step, currentReps + 1); }}>+</button>
          </div>
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

      <button onClick={onDone} className="btn-primary"
        style={{ background: 'linear-gradient(135deg,var(--day-color),rgba(var(--day-color-rgb),0.67))', marginBottom: 'var(--space-5)' }}>
        DONE →
      </button>
    </div>
  );
}
