import type { Day } from '../types/program.ts';
import type { Step } from '../types/step.ts';

export function generateSteps(day: Day): Step[] {
  const steps: Step[] = [];

  day.sections.forEach((section, sectionIdx) => {
    const isLastSection = sectionIdx === day.sections.length - 1;

    if (section.type === 'superset') {
      for (let round = 0; round < section.rounds; round++) {
        for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
          const isLastOfSection = round === section.rounds - 1 && exIdx === section.exercises.length - 1;
          const isLastOfWorkout = isLastSection && isLastOfSection;
          steps.push({
            exercise: section.exercises[exIdx],
            exerciseIndex: exIdx,
            setIndex: round,
            setNumber: round + 1,
            totalSets: section.rounds,
            sectionLabel: section.label,
            sectionType: 'superset',
            roundNumber: round + 1,
            totalRounds: section.rounds,
            restAfter: isLastOfWorkout ? 0 : section.rest,
            isLastSet: round === section.rounds - 1,
          });
        }
      }
    } else {
      for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
        for (let round = 0; round < section.rounds; round++) {
          const isLastOfSection = exIdx === section.exercises.length - 1 && round === section.rounds - 1;
          const isLastOfWorkout = isLastSection && isLastOfSection;
          steps.push({
            exercise: section.exercises[exIdx],
            exerciseIndex: exIdx,
            setIndex: round,
            setNumber: round + 1,
            totalSets: section.rounds,
            sectionLabel: section.label,
            sectionType: 'straight',
            roundNumber: round + 1,
            totalRounds: section.rounds,
            restAfter: isLastOfWorkout ? 0 : section.rest,
            isLastSet: round === section.rounds - 1,
          });
        }
      }
    }
  });

  return steps;
}
