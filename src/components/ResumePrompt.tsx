import type { Program } from '../types/program.ts';
import type { SessionDraft } from '../types/session.ts';
import { WEEKDAY_NAMES } from '../lib/format.ts';

interface Props {
  draft: SessionDraft;
  program: Program;
  onResume: () => void;
  onDiscard: () => void;
}

export function ResumePrompt({ draft, program, onResume, onDiscard }: Props) {
  const day = program.days[draft.day];
  if (!day) { onDiscard(); return null; }

  const elapsed = Math.round((new Date(draft.savedAt).getTime() - new Date(draft.start).getTime()) / 60000);
  const repsLogged = Object.values(draft.data || {}).reduce(
    (a, r) => a + r.reduce((b, v) => b + v, 0), 0
  );
  const schedule = program.schedule || [
    { dayKey: 'A', weekday: 1 },
    { dayKey: 'B', weekday: 3 },
    { dayKey: 'C', weekday: 5 },
  ];
  const sched = schedule.find(s => s.dayKey === draft.day);
  const dayName = sched ? WEEKDAY_NAMES[sched.weekday] : day.name;

  return (
    <div className="overlay overlay-center" onClick={onDiscard}>
      <div className="resume-modal slide-up" data-day={draft.day} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Resume session?
        </h3>
        <p className="text-body" style={{ marginBottom: 'var(--space-5)', lineHeight: 1.5 }}>
          You have an unfinished <strong style={{ color: 'var(--day-color)' }}>{dayName}</strong> session.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <div className="stat-card">
            <div className="stat-value">{repsLogged}</div>
            <div className="stat-label">reps logged</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{elapsed}m</div>
            <div className="stat-label">elapsed</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onDiscard} className="btn-ghost" style={{ flex: 1, padding: '14px' }}>
            Discard
          </button>
          <button onClick={onResume} style={{
            flex: 1, padding: '14px', borderRadius: 'var(--radius-lg)', border: 'none',
            background: 'linear-gradient(135deg,var(--day-color),rgba(var(--day-color-rgb),0.67))',
            color: 'var(--text-primary)', fontSize: 'var(--text-md)', fontWeight: 700, cursor: 'pointer',
          }}>
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
