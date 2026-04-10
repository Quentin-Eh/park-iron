import type { Day, Exercise, Section } from '../types/program.ts';
import type { Step } from '../types/step.ts';

/**
 * Generate the ordered list of Steps (one per "screen" in the session flow)
 * from a Day definition.
 *
 * Handles three modes:
 *   1. Standard section (rounds × exercises × sets) — rest-pause program
 *   2. Superset section — pairs of exercises alternate A1,B1,A2,B2,...
 *   3. Warm-up sets — emitted before each exercise's first working set when
 *      exercise.warmupSets > 0 (Heavy Duty program)
 */
export function generateSteps(day: Day): Step[] {
  const steps: Step[] = [];

  day.sections.forEach((section) => {
    if (section.isSuperset && section.exercises.length >= 2) {
      appendSupersetSteps(steps, section);
    } else {
      appendStandardSteps(steps, section);
    }
  });

  return steps;
}

function appendWarmupSteps(
  out: Step[],
  exercise: Exercise,
  exerciseIndex: number,
  sectionLabel: string,
  superset?: { isSuperset: true; position: 'first' | 'second' }
) {
  const warmups = exercise.warmupSets ?? 0;
  for (let w = 0; w < warmups; w++) {
    out.push({
      exercise,
      exerciseIndex,
      setIndex: w,
      setNumber: w + 1,
      totalSets: warmups,
      sectionLabel,
      isUnilateral: !!exercise.isUnilateral,
      isRestPause: false,
      isWarmup: true,
      isSuperset: superset?.isSuperset,
      supersetPosition: superset?.position,
    });
  }
}

function appendStandardSteps(out: Step[], section: Section) {
  for (let exIdx = 0; exIdx < section.exercises.length; exIdx++) {
    const exercise = section.exercises[exIdx];

    // Warm-ups come before the exercise's working sets
    appendWarmupSteps(out, exercise, exIdx, section.label);

    for (let round = 0; round < section.rounds; round++) {
      out.push({
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
}

/**
 * Supersets emit: warmups(A), warmups(B), then for each round A-working,
 * B-working (zero rest between). Heavy Duty uses rounds=1 so this yields
 * a single alternating pair per superset.
 */
function appendSupersetSteps(out: Step[], section: Section) {
  const [a, b] = section.exercises;

  // Warm-ups for both exercises up front, in order
  appendWarmupSteps(out, a, 0, section.label, { isSuperset: true, position: 'first' });
  appendWarmupSteps(out, b, 1, section.label, { isSuperset: true, position: 'second' });

  for (let round = 0; round < section.rounds; round++) {
    out.push({
      exercise: a,
      exerciseIndex: 0,
      setIndex: round,
      setNumber: round + 1,
      totalSets: section.rounds,
      sectionLabel: section.label,
      isUnilateral: !!a.isUnilateral,
      isRestPause: !!section.isRestPause,
      isSuperset: true,
      supersetPosition: 'first',
    });
    out.push({
      exercise: b,
      exerciseIndex: 1,
      setIndex: round,
      setNumber: round + 1,
      totalSets: section.rounds,
      sectionLabel: section.label,
      isUnilateral: !!b.isUnilateral,
      isRestPause: !!section.isRestPause,
      isSuperset: true,
      supersetPosition: 'second',
    });
  }
}
