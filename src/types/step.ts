import type { Exercise } from './program.ts';

export interface Step {
  exercise: Exercise;
  exerciseIndex: number;
  setIndex: number;
  setNumber: number;
  totalSets: number;
  sectionLabel: string;
  isUnilateral: boolean;
}
