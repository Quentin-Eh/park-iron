import { useState, useEffect, useRef } from 'react';
import { fmt } from '../lib/format.ts';

interface Props {
  value: number;
  onChange: (val: number) => void;
}

export function HoldTimer({ value, onChange }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [on, setOn] = useState(false);
  const iv = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (on) {
      iv.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(iv.current);
  }, [on]);

  const toggle = () => {
    if (on) {
      clearInterval(iv.current);
      setOn(false);
      onChange(elapsed);
    } else {
      setElapsed(0);
      setOn(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-hero)', fontWeight: 700,
        color: on ? 'var(--day-color)' : 'var(--text-muted)',
      }} className={on ? 'pulse' : ''}>
        {fmt(elapsed)}
      </span>
      <button onClick={toggle} style={{
        padding: 'var(--space-3) 40px', borderRadius: 'var(--radius-lg)', border: 'none',
        background: on ? 'var(--day-bg-subtle)' : 'var(--day-bg)',
        color: 'var(--day-color)', fontSize: 'var(--text-lg)', fontWeight: 700,
        cursor: 'pointer', marginBottom: 'var(--space-4)',
      }}>
        {on ? 'STOP' : 'START HOLD'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button className="btn-counter-sm" onClick={() => onChange(Math.max(0, (value || 0) - 1))}>−</button>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700,
          minWidth: 50, textAlign: 'center', color: 'rgba(var(--color-white),var(--alpha-text-soft))',
        }}>{value || 0}s</span>
        <button className="btn-counter-sm" onClick={() => onChange((value || 0) + 1)}>+</button>
      </div>
    </div>
  );
}
