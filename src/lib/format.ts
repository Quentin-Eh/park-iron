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

export function findExerciseName(program: Program, dayKey: string, exId: string): string {
  const day = program.days[dayKey];
  if (!day) return exId;
  for (const sec of day.sections) {
    for (const ex of sec.exercises) {
      if (ex.id === exId) return ex.name;
    }
  }
  return exId;
}
