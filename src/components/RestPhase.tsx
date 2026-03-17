import { useState, useEffect, useRef, useCallback } from 'react';
import type { Step } from '../types/step.ts';
import { gentleChime } from '../lib/audio.ts';
import { notifyFeedback } from '../lib/haptics.ts';

interface Props {
  duration: number;
  nextStep: Step | null;
  onComplete: () => void;
}

export function RestPhase({ duration, nextStep, onComplete }: Props) {
  const [rem, setRem] = useState(duration);
  const [showFlash, setShowFlash] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Hide duration flash after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setShowFlash(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleFinish = useCallback(() => {
    gentleChime();
    notifyFeedback();
    setFinishing(true);
    setTimeout(() => onCompleteRef.current(), 600);
  }, []);

  // Countdown timer
  useEffect(() => {
    const iv = setInterval(() => {
      setRem((r) => {
        if (r <= 1) {
          clearInterval(iv);
          handleFinish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [handleFinish]);

  const pct = ((duration - rem) / duration) * 100;
  const nearEnd = rem <= 5 && rem > 0;

  return (
    <div className={`energy-rest${finishing ? ' finishing' : ''}`}>
      {/* Duration flash */}
      <div className={`energy-flash ${showFlash ? 'visible' : ''}`}>
        {duration}s rest
      </div>

      {/* Energy bar */}
      <div className="energy-bar-container">
        <div className="energy-bar-track">
          <div
            className={`energy-bar-fill${nearEnd ? ' brightening' : ''}`}
            style={{ height: `${pct}%` }}
          />
          <div
            className="energy-bar-glow"
            style={{ bottom: `${pct}%` }}
          />
        </div>
      </div>

      {nextStep && (
        <div className="energy-next">
          <p className="text-meta" style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Up next
          </p>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
            {nextStep.exercise.name}
          </p>
          {nextStep.side && (
            <p style={{ color: 'var(--day-color)', fontWeight: 700, fontSize: 'var(--text-base)', marginTop: 2 }}>
              {nextStep.side === 'L' ? 'Left leg' : 'Right leg'}
            </p>
          )}
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
