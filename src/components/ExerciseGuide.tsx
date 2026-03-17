import { useState } from 'react';
import type { Day } from '../types/program.ts';

interface Props {
  day: Day;
  getProgLevel: (exId: string) => number;
  onBackToStep: () => void;
}

export function ExerciseGuide({ day, getProgLevel, onBackToStep }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="exercise-guide">
      {day.sections.map((section) => (
        <div key={section.label}>
          <div className="exercise-guide-section">{section.label}</div>
          {section.exercises.map((ex) => {
            const isOpen = expanded === ex.id;
            const progLevel = getProgLevel(ex.id);
            const currentProgName = ex.progression[progLevel];

            return (
              <div key={ex.id} className="exercise-guide-card">
                <button
                  className="exercise-guide-header"
                  onClick={() => setExpanded(isOpen ? null : ex.id)}
                >
                  <div className="exercise-guide-info">
                    <span className="exercise-guide-name">{ex.name}</span>
                    <span className="exercise-guide-meta">
                      {ex.target} {ex.isHold ? '' : 'reps'} &middot; {currentProgName}
                    </span>
                  </div>
                  <span className={`exercise-guide-chevron ${isOpen ? 'open' : ''}`}>
                    &#x203A;
                  </span>
                </button>

                {isOpen && (
                  <div className="exercise-guide-detail">
                    {ex.notes && (
                      <p className="exercise-guide-notes">{ex.notes}</p>
                    )}
                    <div className="exercise-guide-ladder">
                      <span className="exercise-guide-ladder-title">Progression</span>
                      {ex.progression.map((step, i) => {
                        const isCurrent = i === progLevel;
                        return (
                          <div key={i} className="exercise-guide-prog-item">
                            <div
                              className="exercise-guide-prog-num"
                              style={{
                                background: isCurrent ? 'var(--day-bg-subtle)' : 'var(--bg-subtle)',
                                color: isCurrent ? 'var(--day-color)' : 'var(--text-secondary)',
                              }}
                            >
                              {i + 1}
                            </div>
                            <span
                              style={{
                                color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                                fontWeight: isCurrent ? 600 : 400,
                                flex: 1,
                              }}
                            >
                              {step}
                            </span>
                            {isCurrent && (
                              <span className="exercise-guide-current-badge">CURRENT</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <button className="btn-primary exercise-guide-back" onClick={onBackToStep}>
        Back to current step
      </button>
    </div>
  );
}
