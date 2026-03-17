import type { Exercise } from './program.ts';

export interface Step {
  exercise: Exercise;
  exerciseIndex: number;
  setIndex: number;
  setNumber: number;
  totalSets: number;
  sectionLabel: string;
  sectionType: 'superset' | 'straight';
  roundNumber: number;
  totalRounds: number;
  restAfter: number;
  isLastSet: boolean;
  side?: 'L' | 'R';
}
