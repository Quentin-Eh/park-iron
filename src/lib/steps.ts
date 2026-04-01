import type { Day } from '../types/program.ts';
import type { Step } from '../types/step.ts';

export function generateSteps(day: Day): Step[] {
  const steps: Step[] = [];

  day.sections.forEach((section) => {
    for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
      const exercise = section.exercises[exIdx];
      for (let round = 0; round < section.rounds; round++) {
        steps.push({
          exercise,
          exerciseIndex: exIdx,
          setIndex: round,
          setNumber: round + 1,
          totalSets: section.rounds,
          sectionLabel: section.label,
          isUnilateral: !!exercise.isUnilateral,
          isRestPause: !!section.isRestPause,
        });
      }
    }
  });

  return steps;
}
