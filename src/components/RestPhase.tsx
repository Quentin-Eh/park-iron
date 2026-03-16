import { useState, useEffect, useRef, useCallback } from 'react';
import type { Step } from '../types/step.ts';
import { fmt } from '../lib/format.ts';
import { beep } from '../lib/audio.ts';
import { heavyFeedback } from '../lib/haptics.ts';

interface Props {
  duration: number;
  nextStep: Step | null;
  onComplete: () => void;
}

export function RestPhase({ duration, nextStep, onComplete }: Props) {
  const [rem, setRem] = useState(duration);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const playBeep = useCallback((freq: number) => beep(freq), []);

  useEffect(() => {
    const iv = setInterval(() => {
      setRem(r => {
        if (r <= 1) { clearInterval(iv); playBeep(1200); heavyFeedback(); onCompleteRef.current(); return 0; }
        if (r === 4) playBeep(660);
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [playBeep]);

  const pct = ((duration - rem) / duration) * 100;
  const low = rem <= 5 && rem > 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '80dvh', padding: '60px var(--space-5) var(--space-5)',
    }}>
      <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 'var(--space-8)' }}>
        <svg viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="90" cy="90" r="80" fill="none" stroke="var(--border-default)" strokeWidth="6" />
          <circle cx="90" cy="90" r="80" fill="none" stroke="var(--day-color)" strokeWidth="6"
            strokeDasharray={`${pct * 5.027} 502.65`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray .3s' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-display)', fontWeight: 700,
            color: low ? 'var(--day-color)' : 'var(--text-primary)',
          }} className={low ? 'pulse' : ''}>
            {fmt(rem)}
          </span>
          <span className="text-body" style={{ marginTop: 'var(--space-1)' }}>REST</span>
        </div>
      </div>

      {nextStep && (
        <div style={{
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4) var(--space-5)', width: '100%', maxWidth: 320,
          marginBottom: 'var(--space-6)', textAlign: 'center',
        }}>
          <p className="text-meta" style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>Up next</p>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{nextStep.exercise.name}</p>
          <p className="text-body" style={{ marginTop: 2 }}>
            Set {nextStep.setNumber} of {nextStep.totalSets}
          </p>
        </div>
      )}

      <button className="btn-ghost" onClick={() => onCompleteRef.current()}>
        SKIP →
      </button>
    </div>
  );
}
