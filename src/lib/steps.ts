import type { Day } from '../types/program.ts';
import type { Step } from '../types/step.ts';
import type { Exercise } from '../types/program.ts';

function makeStep(
  exercise: Exercise,
  exIdx: number,
  round: number,
  totalRounds: number,
  sectionLabel: string,
  sectionType: 'superset' | 'straight',
  restAfter: number,
  isLastSet: boolean,
  side?: 'L' | 'R',
): Step {
  return {
    exercise,
    exerciseIndex: exIdx,
    setIndex: round,
    setNumber: round + 1,
    totalSets: totalRounds,
    sectionLabel,
    sectionType,
    roundNumber: round + 1,
    totalRounds,
    restAfter,
    isLastSet,
    side,
  };
}

function pushExerciseStep(
  steps: Step[],
  exercise: Exercise,
  exIdx: number,
  round: number,
  totalRounds: number,
  sectionLabel: string,
  sectionType: 'superset' | 'straight',
  restAfter: number,
  isLastSet: boolean,
) {
  if (exercise.isUnilateral) {
    // L step: no rest between legs
    steps.push(makeStep(exercise, exIdx, round, totalRounds, sectionLabel, sectionType, 0, false, 'L'));
    // R step: gets the real rest and isLastSet
    steps.push(makeStep(exercise, exIdx, round, totalRounds, sectionLabel, sectionType, restAfter, isLastSet, 'R'));
  } else {
    steps.push(makeStep(exercise, exIdx, round, totalRounds, sectionLabel, sectionType, restAfter, isLastSet));
  }
}

export function generateSteps(day: Day): Step[] {
  const steps: Step[] = [];

  day.sections.forEach((section, sectionIdx) => {
    const isLastSection = sectionIdx === day.sections.length - 1;

    if (section.type === 'superset') {
      for (let round = 0; round < section.rounds; round++) {
        for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
          const isLastOfSection = round === section.rounds - 1 && exIdx === section.exercises.length - 1;
          const isLastOfWorkout = isLastSection && isLastOfSection;
          pushExerciseStep(
            steps,
            section.exercises[exIdx],
            exIdx,
            round,
            section.rounds,
            section.label,
            'superset',
            isLastOfWorkout ? 0 : section.rest,
            round === section.rounds - 1,
          );
        }
      }
    } else {
      for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
        for (let round = 0; round < section.rounds; round++) {
          const isLastOfSection = exIdx === section.exercises.length - 1 && round === section.rounds - 1;
          const isLastOfWorkout = isLastSection && isLastOfSection;
          pushExerciseStep(
            steps,
            section.exercises[exIdx],
            exIdx,
            round,
            section.rounds,
            section.label,
            'straight',
            isLastOfWorkout ? 0 : section.rest,
            round === section.rounds - 1,
          );
        }
      }
    }
  });

  return steps;
}
