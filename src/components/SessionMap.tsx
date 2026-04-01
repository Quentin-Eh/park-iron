import { useState, useEffect, useRef } from 'react';
import type { Day } from '../types/program.ts';
import type { Step } from '../types/step.ts';
import type { SessionData } from '../types/session.ts';

interface Props {
  day: Day;
  steps: Step[];
  currentStep: number;
  sessionData: SessionData;
  getProgLevel: (exId: string) => number;
  onSetProgLevel: (exId: string, level: number) => void;
  onClose: () => void;
}

export function SessionMap({ day, steps, currentStep, sessionData, getProgLevel, onSetProgLevel, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const currentStepObj = steps[currentStep] ?? null;

  useEffect(() => {
    const t = setTimeout(() => {
      currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    return () => clearTimeout(t);
  }, []);

  // Build set status for each exercise (or each side of a unilateral exercise)
  function getSetStatus(exId: string, side?: 'L' | 'R') {
    const dataKey = exId + (side ? `_${side}` : '');
    const reps = sessionData[dataKey] || [];
    const exerciseSteps = steps.filter(s => s.exercise.id === exId);
    return exerciseSteps.map((s) => {
      const stepIdx = steps.indexOf(s);
      const logged = reps[s.setIndex] ?? 0;
      if (stepIdx < currentStep) return { status: 'done' as const, reps: logged };
      if (stepIdx === currentStep) return { status: 'current' as const, reps: logged };
      return { status: 'upcoming' as const, reps: 0 };
    });
  }

  function isSectionCurrent(sectionLabel: string) {
    return currentStepObj?.sectionLabel === sectionLabel;
  }

  return (
    <div className="session-map">
      {day.sections.map((section) => {
        const isCurrent = isSectionCurrent(section.label);

        return (
          <div
            key={section.label}
            ref={isCurrent ? currentRef : undefined}
            className={`session-map-section ${isCurrent ? 'current' : ''}`}
          >
            <div className="session-map-section-header">
              <span className="session-map-section-label">{section.label}</span>
              <span className="session-map-section-meta">
                {section.isRestPause ? 'rest-pause' : `${section.rounds} sets`}
              </span>
            </div>

            <div className="session-map-cards">
              {section.exercises.map((ex) => {
                const progLevel = getProgLevel(ex.id);
                const progName = ex.progression[progLevel];
                const isUnilateral = ex.isUnilateral;
                const sets = isUnilateral ? null : getSetStatus(ex.id);
                const setsL = isUnilateral ? getSetStatus(ex.id, 'L') : null;
                const setsR = isUnilateral ? getSetStatus(ex.id, 'R') : null;
                const isOpen = expanded === ex.id;

                return (
                  <div key={ex.id} className="session-map-card">
                    <button
                      className="session-map-card-header"
                      onClick={() => setExpanded(isOpen ? null : ex.id)}
                    >
                      <div className="session-map-card-info">
                        <span className="session-map-card-name">{ex.name}</span>
                        <span className="session-map-card-meta">{progName}</span>
                        <span className="session-map-card-target">
                          {ex.target} {ex.isHold ? '' : 'reps'}
                        </span>
                      </div>
                      {isUnilateral ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, width: 12 }}>L</span>
                            <div className="session-map-sets">
                              {setsL!.map((s, i) => (
                                <div key={i} className={`session-map-set-dot ${s.status}`}>
                                  {s.status === 'done' && s.reps > 0 ? s.reps : ''}
                                </div>
                              ))}
                            </div>
                            {section.isRestPause && setsL!.some(s => s.status === 'done' && s.reps > 0) && (
                              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
                                ={setsL!.reduce((sum, s) => sum + (s.status === 'done' ? s.reps : 0), 0)}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, width: 12 }}>R</span>
                            <div className="session-map-sets">
                              {setsR!.map((s, i) => (
                                <div key={i} className={`session-map-set-dot ${s.status}`}>
                                  {s.status === 'done' && s.reps > 0 ? s.reps : ''}
                                </div>
                              ))}
                            </div>
                            {section.isRestPause && setsR!.some(s => s.status === 'done' && s.reps > 0) && (
                              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
                                ={setsR!.reduce((sum, s) => sum + (s.status === 'done' ? s.reps : 0), 0)}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div className="session-map-sets">
                            {sets!.map((s, i) => (
                              <div key={i} className={`session-map-set-dot ${s.status}`}>
                                {s.status === 'done' && s.reps > 0 ? s.reps : ''}
                              </div>
                            ))}
                          </div>
                          {section.isRestPause && sets!.some(s => s.status === 'done' && s.reps > 0) && (
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
                              ={sets!.reduce((sum, s) => sum + (s.status === 'done' ? s.reps : 0), 0)}
                            </span>
                          )}
                        </div>
                      )}
                      <span className={`session-map-chevron ${isOpen ? 'open' : ''}`}>
                        &#x203A;
                      </span>
                    </button>

                    {isOpen && (
                      <div className="session-map-detail">
                        {ex.notes && (
                          <p className="session-map-notes">{ex.notes}</p>
                        )}
                        <div className="session-map-ladder">
                          <span className="session-map-ladder-title">Progression</span>
                          {ex.progression.map((step, i) => {
                            const isCurr = i === progLevel;
                            return (
                              <button
                                key={i}
                                className="session-map-prog-item"
                                onClick={() => onSetProgLevel(ex.id, i)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className="session-map-prog-num"
                                  style={{
                                    background: isCurr ? 'var(--day-bg-subtle)' : 'var(--bg-subtle)',
                                    color: isCurr ? 'var(--day-color)' : 'var(--text-secondary)',
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <span
                                  style={{
                                    color: isCurr ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontWeight: isCurr ? 600 : 400,
                                    flex: 1,
                                    textAlign: 'left',
                                  }}
                                >
                                  {step}
                                </span>
                                {isCurr && (
                                  <span className="session-map-current-badge">CURRENT</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button className="btn-primary session-map-back" onClick={onClose}>
        Back to current step
      </button>
    </div>
  );
}
