import type { Program } from '../types/program.ts';
import type { Session } from '../types/session.ts';

/**
 * Computed state for a single workout day, used by the Home screen to
 * render both weekly-schedule programs and alternation-based programs.
 */
export interface DayScheduleState {
  dayKey: string;
  /**
   * 'today'    — user should do this workout today
   * 'upcoming' — scheduled for a specific weekday (weekly mode)
   * 'ready'    — alternation mode, the next workout in rotation and rest is satisfied
   * 'resting'  — alternation mode, waiting on the rest-day minimum
   * 'queued'   — alternation mode, not the next workout yet
   */
  state: 'today' | 'upcoming' | 'ready' | 'resting' | 'queued';
  weekday?: number;           // weekly mode
  restDaysRemaining?: number; // alternation mode, when resting
  readyDate?: string;         // alternation mode, ISO date when this workout becomes ready
}

export interface ScheduleSummary {
  days: DayScheduleState[];
  /**
   * The single "do it now" day, if any. For weekly mode this is today's
   * workout; for alternation mode this is the next workout in rotation if
   * rest days are satisfied.
   */
  activeDayKey: string | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  // Whole days between two dates, floor (ignores time-of-day clock drift)
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((bMid - aMid) / MS_PER_DAY);
}

export function computeSchedule(program: Program, history: Session[], now: Date = new Date()): ScheduleSummary {
  if (program.scheduleMode === 'alternation') {
    return computeAlternationSchedule(program, history, now);
  }
  return computeWeeklySchedule(program, now);
}

function computeWeeklySchedule(program: Program, now: Date): ScheduleSummary {
  const today = now.getDay();
  const days: DayScheduleState[] = program.schedule.map(entry => ({
    dayKey: entry.dayKey,
    weekday: entry.weekday,
    state: entry.weekday === today ? 'today' : 'upcoming',
  }));
  const todayEntry = program.schedule.find(e => e.weekday === today);
  return { days, activeDayKey: todayEntry?.dayKey ?? null };
}

function computeAlternationSchedule(program: Program, history: Session[], now: Date): ScheduleSummary {
  const rotation = program.rotation && program.rotation.length > 0
    ? program.rotation
    : Object.keys(program.days);
  const minRestDays = program.minRestDays ?? 2;

  // Find the most recent session that belongs to this program
  const lastSession = history.find(s => rotation.includes(s.day));

  // Determine the next workout in the rotation
  let nextDayKey: string;
  if (!lastSession) {
    nextDayKey = rotation[0];
  } else {
    const idx = rotation.indexOf(lastSession.day);
    nextDayKey = rotation[(idx + 1) % rotation.length];
  }

  // Days since last session (only matters if we actually have one)
  const daysSince = lastSession ? daysBetween(new Date(lastSession.date), now) : Infinity;
  const restSatisfied = daysSince >= minRestDays;

  const days: DayScheduleState[] = rotation.map(dayKey => {
    if (dayKey === nextDayKey) {
      if (restSatisfied) {
        return { dayKey, state: 'ready' };
      }
      const remaining = minRestDays - daysSince;
      const readyDate = new Date(now.getTime() + remaining * MS_PER_DAY).toISOString();
      return { dayKey, state: 'resting', restDaysRemaining: remaining, readyDate };
    }
    return { dayKey, state: 'queued' };
  });

  return { days, activeDayKey: restSatisfied ? nextDayKey : null };
}
