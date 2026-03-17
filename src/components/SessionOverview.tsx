import { useEffect, useRef } from 'react';
import type { Step } from '../types/step.ts';
import type { SessionData } from '../types/session.ts';
import { fmt } from '../lib/format.ts';

interface Props {
  steps: Step[];
  currentStep: number;
  sessionData: SessionData;
  onBackToStep: () => void;
}

export function SessionOverview({ steps, currentStep, sessionData, onBackToStep }: Props) {
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  let lastSection = '';

  return (
    <div className="overview">
      <div className="overview-list">
        {steps.map((step, i) => {
          const reps = sessionData[step.exercise.id];
          const logged = reps?.[step.setIndex] ?? 0;
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          const showSection = step.sectionLabel !== lastSection;
          lastSection = step.sectionLabel;

          return (
            <div key={i}>
              {showSection && (
                <div className="overview-section">{step.sectionLabel}</div>
              )}
              <div
                ref={isCurrent ? currentRef : undefined}
                className={`overview-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="overview-step-marker">
                  {isDone ? (
                    <span className="overview-check">✓</span>
                  ) : isCurrent ? (
                    <span className="overview-dot" />
                  ) : (
                    <span className="overview-dot upcoming" />
                  )}
                </div>
                <div className="overview-step-content">
                  <span className="overview-name">{step.exercise.name}</span>
                  <span className="overview-meta">
                    Set {step.setNumber}/{step.totalSets}
                    {isDone && logged > 0 && (
                      <span className="overview-reps"> — {logged} reps</span>
                    )}
                  </span>
                </div>
              </div>
              {step.restAfter > 0 && i < steps.length - 1 && (
                <div className={`overview-rest ${isDone ? 'done' : ''}`}>
                  {fmt(step.restAfter)} rest
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button className="btn-primary overview-back" onClick={onBackToStep}>
        Back to current step
      </button>
    </div>
  );
}
