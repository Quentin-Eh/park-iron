export interface Exercise {
  id: string;
  name: string;
  detail: string;
  notes?: string;
  target: string;
  isHold?: boolean;
  progression: string[];
}

export interface Section {
  type: 'superset' | 'straight';
  label: string;
  rounds: number;
  rest: number;
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
  weekday: number;
}

export interface Program {
  schemaVersion: number;
  version: string;
  name: string;
  description: string;
  schedule: ScheduleEntry[];
  days: Record<string, Day>;
}
