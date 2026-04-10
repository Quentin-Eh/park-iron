import type { Exercise } from './program.ts';

export interface Step {
  exercise: Exercise;
  exerciseIndex: number;
  setIndex: number;
  setNumber: number;
  totalSets: number;
  sectionLabel: string;
  isUnilateral: boolean;
  isRestPause: boolean;
  isWarmup?: boolean;
  isSuperset?: boolean;
  supersetPosition?: 'first' | 'second'; // position within a superset pair
}
