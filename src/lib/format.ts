import type { Program } from '../types/program.ts';

export const fmt = (s: number): string =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
] as const;

/** Maps old v1 exercise IDs to display names for history rendering */
const LEGACY_EXERCISE_NAMES: Record<string, string> = {
  ring_dips_a: 'Ring Dips',
  pullups_a: 'Pull-ups',
  archer_pushups: 'Archer Push-ups',
  ring_rows: 'Ring Rows',
  pike_pushups: 'Pike Push-ups',
  face_pulls: 'Ring Face Pulls',
  pistols_a: 'Pistol Squats',
  chinups: 'Chin-ups',
  ring_dips_b: 'Ring Dips',
  archer_pullups: 'Archer Pull-ups',
  deep_pushups: 'Deep Push-ups',
  ring_curls: 'Ring Curls',
  leg_raises: 'Hanging Leg Raises',
  bulgarians: 'Bulgarian Split Squats',
  pistols_c: 'Pistol Squats',
  nordics: 'Nordic Curl Negatives',
  jump_squats: 'Jump Squats',
  vsit: 'V-sit Hold',
  planche_lean: 'Pseudo-planche Lean',
  ring_support: 'Ring Support Hold',
};

/** Legacy day key → display label */
const LEGACY_DAY_NAMES: Record<string, string> = {
  A: 'Day A (old program)',
  B: 'Day B (old program)',
  C: 'Day C (old program)',
};

export function findExerciseName(program: Program, dayKey: string, exId: string): string {
  // Strip _L / _R suffix for lookup
  const baseId = exId.replace(/_[LR]$/, '');
  const suffix = exId.endsWith('_L') ? ' (L)' : exId.endsWith('_R') ? ' (R)' : '';

  // Try current program first
  const day = program.days[dayKey];
  if (day) {
    for (const sec of day.sections) {
      for (const ex of sec.exercises) {
        if (ex.id === baseId) return ex.name + suffix;
      }
    }
  }

  // Fallback to legacy names
  if (LEGACY_EXERCISE_NAMES[baseId]) return LEGACY_EXERCISE_NAMES[baseId] + suffix;

  return baseId + suffix;
}

export function findDayName(program: Program, dayKey: string, schedule: { dayKey: string; weekday: number }[]): string {
  const sched = schedule.find(s => s.dayKey === dayKey);
  if (sched) return WEEKDAY_NAMES[sched.weekday];

  const day = program.days[dayKey];
  if (day) return day.name;

  return LEGACY_DAY_NAMES[dayKey] || dayKey;
}
