import type { Day } from '../types/program.ts';
import type { Session } from '../types/session.ts';
import { WEEKDAY_NAMES, fmtDate } from '../lib/format.ts';

interface Props {
  dayKey: string;
  weekday: number;
  day: Day;
  isToday: boolean;
  lastSession: Session | undefined;
  onStart: (dayKey: string) => void;
}

export function DayCard({ dayKey, weekday, day, isToday, lastSession, onStart }: Props) {
  return (
    <button
      className="day-card"
      data-day={dayKey}
      onClick={() => onStart(dayKey)}
      style={isToday ? { border: '1px solid rgba(var(--day-color-rgb),0.25)', boxShadow: '0 0 20px var(--day-bg)' } : {}}
    >
      <div className="bar" style={{ background: 'var(--day-color)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ paddingLeft: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>{WEEKDAY_NAMES[weekday]}</h3>
            {isToday && (
              <span className="today-badge" style={{ background: 'var(--day-bg-subtle)', color: 'var(--day-color)' }}>
                TODAY
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
          fontSize: 24, fontWeight: 900, color: 'var(--day-color)', flexShrink: 0,
        }}>
          {dayKey}
        </div>
      </div>
    </button>
  );
}
