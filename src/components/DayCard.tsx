import type { Day } from '../types/program.ts';
import type { Session } from '../types/session.ts';
import type { DayScheduleState } from '../lib/schedule.ts';
import { WEEKDAY_NAMES, fmtDate } from '../lib/format.ts';

interface Props {
  dayKey: string;
  day: Day;
  state: DayScheduleState;
  lastSession: Session | undefined;
  onStart: (dayKey: string) => void;
}

function getHeading(day: Day, state: DayScheduleState): string {
  // Weekly mode: lead with the weekday name (existing behavior)
  if (state.weekday !== undefined) return WEEKDAY_NAMES[state.weekday];
  // Alternation mode: lead with the workout name (e.g. "Workout A")
  return day.name.toUpperCase();
}

function getBadge(state: DayScheduleState): { label: string; emphasized: boolean } | null {
  switch (state.state) {
    case 'today':
      return { label: 'TODAY', emphasized: true };
    case 'ready':
      return { label: 'READY', emphasized: true };
    case 'resting':
      return {
        label: state.restDaysRemaining === 1 ? 'REST 1 DAY' : `REST ${state.restDaysRemaining} DAYS`,
        emphasized: false,
      };
    case 'queued':
    case 'upcoming':
    default:
      return null;
  }
}

export function DayCard({ dayKey, day, state, lastSession, onStart }: Props) {
  const isLongKey = dayKey.length > 1;
  const heading = getHeading(day, state);
  const badge = getBadge(state);
  const highlight = state.state === 'today' || state.state === 'ready';
  const isResting = state.state === 'resting';

  return (
    <button
      className="day-card"
      data-day={dayKey}
      onClick={() => onStart(dayKey)}
      style={{
        ...(highlight ? { border: '1px solid rgba(var(--day-color-rgb),0.25)', boxShadow: '0 0 20px var(--day-bg)' } : {}),
        ...(isResting ? { opacity: 0.6 } : {}),
      }}
    >
      <div className="bar" style={{ background: 'var(--day-color)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ paddingLeft: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{heading}</h3>
            {badge && (
              <span className="today-badge" style={{
                background: badge.emphasized ? 'var(--day-bg-subtle)' : 'var(--bg-subtle)',
                color: badge.emphasized ? 'var(--day-color)' : 'var(--text-secondary)',
              }}>
                {badge.label}
              </span>
            )}
          </div>
          <p style={{
            color: 'rgba(var(--color-white),0.45)', fontSize: 'var(--text-base)',
            fontWeight: 500, marginTop: 'var(--space-1)',
          }}>
            {day.subtitle}
          </p>
          {lastSession && (
            <p style={{ color: 'var(--text-faint)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Last: {fmtDate(lastSession.date)}
            </p>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'var(--day-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isLongKey ? 18 : 24, fontWeight: 900, color: 'var(--day-color)', flexShrink: 0,
        }}>
          {dayKey}
        </div>
      </div>
    </button>
  );
}
