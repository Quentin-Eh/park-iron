import type { User } from '@supabase/supabase-js';
import type { Program } from '../types/program.ts';
import type { Session } from '../types/session.ts';
import { DayCard } from './DayCard.tsx';

interface Props {
  program: Program;
  history: Session[];
  onStartSession: (dayKey: string) => void;
  onShowHistory: () => void;
  user: User | null;
  onSignOut: () => void;
  isConfigured: boolean;
  onCustomize: () => void;
}

export function HomeScreen({ program, history, onStartSession, onShowHistory, user, onSignOut, isConfigured, onCustomize }: Props) {
  const schedule = program.schedule || [];
  const today = new Date().getDay();
  const todaySchedule = schedule.find(s => s.weekday === today);

  return (
    <div style={{ padding: 'var(--space-5) var(--space-4)' }} className="fade-in">
      <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="logo-gradient" style={{ fontSize: 'var(--text-4xl)', letterSpacing: -1.5 }}>
            PARK IRON
          </h1>
          <p className="text-body" style={{ fontWeight: 500, marginTop: 'var(--space-1)' }}>
            Minimal dose. Maximum growth.
          </p>
        </div>
        {isConfigured && user && (
          <button onClick={onSignOut} style={{
            background: 'var(--bg-subtle)', border: 'none', borderRadius: 'var(--radius-md)',
            padding: '6px 12px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)',
            fontWeight: 600, cursor: 'pointer', marginTop: 'var(--space-1)',
          }}>
            Sign out
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-7)' }}>
        {schedule.map(({ dayKey, weekday }) => {
          const d = program.days[dayKey];
          if (!d) return null;
          const isToday = weekday === today;
          const last = history.find(h => h.day === dayKey);
          return (
            <DayCard
              key={dayKey}
              dayKey={dayKey}
              weekday={weekday}
              day={d}
              isToday={isToday}
              lastSession={last}
              onStart={onStartSession}
            />
          );
        })}
      </div>

      {!todaySchedule && (
        <div style={{
          textAlign: 'center', padding: 'var(--space-3) var(--space-4)',
          marginBottom: 'var(--space-4)', background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)' }}>
            Rest day — recover and grow
          </p>
        </div>
      )}

      <button onClick={onShowHistory} className="day-card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) 18px' }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Session History</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginLeft: 'var(--space-2)' }}>
            {history.length} session{history.length !== 1 ? 's' : ''}
          </span>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xl)' }}>→</span>
      </button>

      <button onClick={onCustomize}
        style={{
          background: 'none', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)', padding: 'var(--space-3) var(--space-4)',
          color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600,
          cursor: 'pointer', width: '100%', marginTop: 'var(--space-3)',
        }}>
        Customize your program
      </button>
    </div>
  );
}
