import type { Session } from '../types/session.ts';
import type { Program } from '../types/program.ts';
import { useCoaching } from '../hooks/useCoaching.ts';
import { WEEKDAY_NAMES } from '../lib/format.ts';

interface Props {
  session: Session;
  program: Program;
  userId: string;
  onDone: () => void;
  onFeedbackReceived: (sessionId: number, feedback: string) => void;
}

export function CoachingScreen({ session, program, userId, onDone, onFeedbackReceived }: Props) {
  const { feedback, loading, error, retry } = useCoaching(session, userId, onFeedbackReceived);

  const day = program.days[session.day];
  const schedule = program.schedule || [];
  const sched = schedule.find(s => s.dayKey === session.day);
  const dayName = sched ? WEEKDAY_NAMES[sched.weekday] : day?.name || session.day;

  const totalReps = Object.values(session.exercises).reduce(
    (a, r) => a + r.reduce((b, v) => b + v, 0), 0
  );
  const durationMin = session.endDate
    ? Math.round((new Date(session.endDate).getTime() - new Date(session.date).getTime()) / 60000)
    : null;

  return (
    <div data-day={session.day} className="coaching-screen fade-in" style={{ padding: 'var(--space-4)' }}>
      {/* Session summary */}
      <div className="coaching-summary">
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--day-color)', marginBottom: 'var(--space-3)' }}>
          Session Complete
        </div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          {dayName}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {durationMin != null && (
            <div className="stat-card">
              <div className="stat-value">{durationMin}</div>
              <div className="stat-label">min</div>
            </div>
          )}
          <div className="stat-card">
            <div className="stat-value">{totalReps}</div>
            <div className="stat-label">reps</div>
          </div>
        </div>
      </div>

      {/* Coaching feedback area */}
      <div className="coaching-feedback-area">
        {loading && (
          <div className="coaching-skeleton">
            <div className="coaching-skeleton-line" style={{ width: '90%' }} />
            <div className="coaching-skeleton-line" style={{ width: '100%' }} />
            <div className="coaching-skeleton-line" style={{ width: '75%' }} />
            <div className="coaching-skeleton-line" style={{ width: '0%', height: 'var(--space-3)' }} />
            <div className="coaching-skeleton-line" style={{ width: '85%' }} />
            <div className="coaching-skeleton-line" style={{ width: '95%' }} />
            <div className="coaching-skeleton-line" style={{ width: '60%' }} />
          </div>
        )}

        {feedback && (
          <div className="coaching-feedback">
            {feedback.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {error && !feedback && (
          <div className="coaching-error">
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
              Couldn't reach your coach
            </p>
            <button onClick={retry} className="btn-sm" style={{
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--day-color)',
              background: 'transparent',
              color: 'var(--day-color)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
            }}>
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="btn-primary"
        style={{ background: 'var(--day-color)', marginTop: 'var(--space-5)' }}
      >
        Done
      </button>
    </div>
  );
}
