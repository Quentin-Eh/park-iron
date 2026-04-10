export type BeyondFailureTechnique = 'negatives' | 'mechanical_drop' | 'rest_pause' | 'static_hold';

export interface Exercise {
  id: string;
  name: string;
  detail: string;
  notes?: string;
  target: string;
  isHold?: boolean;
  isUnilateral?: boolean;
  progression: string[];
  // Heavy Duty fields (optional — rest-pause program ignores these)
  tempo?: string;                   // e.g. "4-1-2"
  repMin?: number;
  repMax?: number;
  warmupSets?: number;              // number of 50% warm-up sets before the working set
  beyondFailure?: BeyondFailureTechnique;
  beyondFailureHint?: string;       // short, exercise-specific instruction for the reminder
}

export interface Section {
  label: string;
  rounds: number;
  isRestPause?: boolean;
  isSuperset?: boolean;             // two exercises performed back-to-back, zero rest
  exercises: Exercise[];
}

export interface Day {
  name: string;
  subtitle: string;
  color: string;
  sections: Section[];
}

export interface ScheduleEntry {
  dayKey: string;
  weekday: number;                  // only used when scheduleMode === 'weekly'
}

export type ScheduleMode = 'weekly' | 'alternation';

export interface Program {
  id: string;
  schemaVersion: number;
  version: string;
  name: string;
  description: string;
  scheduleMode: ScheduleMode;
  schedule: ScheduleEntry[];
  rotation?: string[];              // ordered dayKeys for alternation mode
  minRestDays?: number;             // minimum rest days between sessions (alternation mode)
  days: Record<string, Day>;
}
