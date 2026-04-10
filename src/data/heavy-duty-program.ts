import type { Program } from '../types/program.ts';
import { SCHEMA_VERSION } from './default-program.ts';

/**
 * Heavy Duty Calisthenics — Mike Mentzer's HIT methodology adapted for bodyweight.
 *
 * Core rules encoded here:
 *  - ONE working set per exercise, taken to absolute muscular failure
 *  - 1–2 easy warm-up sets before the working set (not logged as reps)
 *  - 4-1-2 tempo (4s eccentric, 1s pause, 2s concentric) on every rep
 *  - Beyond-failure technique after concentric failure
 *  - Rep range 6–10 (exceptions: 3–5 for Nordics, 8–12 for calves)
 *  - A/B alternation with ≥2 rest days between sessions
 *  - Progression advances when user exceeds rep cap at prescribed tempo
 */
export const HEAVY_DUTY_PROGRAM: Program = {
  id: "heavy-duty-v1",
  schemaVersion: SCHEMA_VERSION,
  version: "1.0.0",
  name: "Heavy Duty",
  description: "Mentzer HIT: one all-out set per exercise, 4-1-2 tempo, A/B alternation",
  scheduleMode: "alternation",
  schedule: [],
  rotation: ["A", "B"],
  minRestDays: 2,
  days: {
    A: {
      name: "Workout A",
      subtitle: "Chest · Back · Arms",
      color: "#EF4444",
      sections: [
        {
          label: "Pre-Exhaust Superset — Chest",
          rounds: 1,
          isSuperset: true,
          exercises: [
            {
              id: "hd_a_deficit_pushups",
              name: "Deep Deficit Push-ups",
              detail: "Hands elevated 6+\" — chest drops below hand level",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              notes: "Hands on parallettes, books, or push-up handles so your chest can drop well below hand level. Maximum pec stretch. 4s down, 1s pause at the bottom, 2s press. Go to concentric failure — the rep you can't complete no matter how hard you push. Then immediately jump straight into dips with zero rest.",
              progression: [
                "Level 1 — Knee push-ups (no deficit)",
                "Level 2 — Standard push-ups (no deficit)",
                "Level 3 — Deficit push-ups (hands elevated 3–4\")",
                "Level 4 — Deep deficit push-ups (hands elevated 6+\")",
              ],
            },
            {
              id: "hd_a_dips",
              name: "Dips",
              detail: "Parallel bars, lean forward for chest",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "negatives",
              beyondFailureHint: "After failure: 2–3 negative-only reps. Jump to the top, lower for 5–6 seconds.",
              notes: "Zero rest from deficit push-ups — get straight on the bars. Lean torso forward ~30° to keep chest emphasis. 4s down, 1s pause, 2s press. Go to concentric failure, then jump to the top and do 2–3 slow 5–6 second negatives. That's the combined working set.",
              progression: [
                "Level 1 — Bench dips (feet on floor)",
                "Level 2 — Bench dips (feet elevated)",
                "Level 3 — Parallel bar dips (bodyweight)",
                "Level 4 — Parallel bar dips with slow 5s eccentric",
              ],
            },
          ],
        },
        {
          label: "Chin-ups",
          rounds: 1,
          exercises: [
            {
              id: "hd_a_chinups",
              name: "Chin-ups",
              detail: "Supinated, shoulder-width",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "negatives",
              beyondFailureHint: "After failure: 2–3 negative-only reps. Jump to chin over bar, lower for 5–6 seconds.",
              notes: "Palms facing you, shoulder-width. Dead hang at the bottom of every rep — chin clearly over the bar at the top, hard lat and bicep squeeze. 4s down, 1s pause, 2s up. Go to failure, then add 2–3 slow negatives.",
              progression: [
                "Level 1 — Band-assisted chin-ups",
                "Level 2 — Standard chin-ups",
                "Level 3 — L-sit chin-ups (legs extended throughout)",
                "Level 4 — Weighted chin-ups (backpack or vest)",
              ],
            },
          ],
        },
        {
          label: "Elevated Inverted Rows",
          rounds: 1,
          exercises: [
            {
              id: "hd_a_inverted_rows",
              name: "Elevated Inverted Rows",
              detail: "Feet elevated, body horizontal",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "mechanical_drop",
              beyondFailureHint: "After failure: drop feet to the floor and continue to failure at the easier angle.",
              notes: "Bar at waist height, feet elevated on a bench so your body is horizontal. Overhand grip, shoulder-width. Pull chest to the bar, squeeze shoulder blades hard at the top. 4s down, 1s pause, 2s up. After failure, drop your feet to the floor and keep going until you can't complete a rep.",
              progression: [
                "Level 1 — Bent-knee inverted rows (feet on floor, knees bent)",
                "Level 2 — Standard inverted rows (feet on floor, legs straight)",
                "Level 3 — Feet-elevated inverted rows",
                "Level 4 — Archer inverted rows (one arm extends wide)",
              ],
            },
          ],
        },
        {
          label: "Close-Grip Chin-ups",
          rounds: 1,
          exercises: [
            {
              id: "hd_a_close_chinups",
              name: "Close-Grip Chin-ups",
              detail: "Hands 6–8\" apart, biceps focus",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "rest_pause",
              beyondFailureHint: "After failure: rest 15–20s, mini-set to failure. Rest 15–20s, final mini-set to failure.",
              notes: "Palms facing you, hands 6–8 inches apart. Think about pulling with your hands, not your elbows — pure bicep contraction. 4s down, 1s pause, 2s up. After failure, rack the bar for 15–20s, then another mini-set to failure, rest again, one final mini-set. Three total.",
              progression: [
                "Level 1 — Band-assisted close-grip chin-ups",
                "Level 2 — Standard close-grip chin-ups",
                "Level 3 — Weighted close-grip chin-ups",
              ],
            },
          ],
        },
        {
          label: "Diamond Push-ups",
          rounds: 1,
          exercises: [
            {
              id: "hd_a_diamond_pushups",
              name: "Diamond Push-ups",
              detail: "Index fingers + thumbs touching",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "mechanical_drop",
              beyondFailureHint: "After failure: widen hands to standard, continue to failure. Widen further if still able.",
              notes: "Hands under chest forming a diamond, elbows stay close to the body. Triceps do all the work. 4s down, 1s pause, 2s up. After failure, immediately widen hands to standard push-up width and keep going. If still able, widen again.",
              progression: [
                "Level 1 — Knee diamond push-ups",
                "Level 2 — Standard diamond push-ups",
                "Level 3 — Decline diamond push-ups (feet elevated)",
                "Level 4 — Ring diamond push-ups",
              ],
            },
          ],
        },
      ],
    },
    B: {
      name: "Workout B",
      subtitle: "Legs · Shoulders · Core",
      color: "#10B981",
      sections: [
        {
          label: "Pre-Exhaust Superset — Quads",
          rounds: 1,
          isSuperset: true,
          exercises: [
            {
              id: "hd_b_wall_sit",
              name: "Wall Sit Hold",
              detail: "Thighs parallel, knees at 90°",
              target: "60-90s",
              isHold: true,
              tempo: "hold",
              warmupSets: 0,
              notes: "Back flat against a wall, thighs parallel to the floor, knees at 90°. Hold until 60–90 seconds or until the quads give out — whichever comes first. This pre-exhausts the quads before pistols. Zero rest into pistol squats.",
              progression: [
                "Level 1 — Wall sit 30s",
                "Level 2 — Wall sit 60s",
                "Level 3 — Wall sit 90s",
                "Level 4 — Single-leg wall sit",
              ],
            },
            {
              id: "hd_b_pistols",
              name: "Pistol Squats",
              detail: "Single-leg squat, balance-assist OK",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 0,
              isUnilateral: true,
              beyondFailure: "static_hold",
              beyondFailureHint: "After failure: hold the bottom position of the pistol until the quad gives out.",
              notes: "Zero rest from the wall sit — your quads are already cooked. Single-leg squat to full depth, other leg extended forward. You can hold a doorframe lightly for balance, but don't pull yourself up. 4s down, 1s pause, 2s up. After failure, drop into a deep squat hold at the bottom until the quad gives out.",
              progression: [
                "Level 1 — Assisted pistol squats (holding a doorframe or strap)",
                "Level 2 — Bulgarian split squats (rear foot elevated)",
                "Level 3 — Full pistol squats (no assistance)",
                "Level 4 — Weighted pistol squats (backpack or jug)",
              ],
            },
          ],
        },
        {
          label: "Nordic Curls",
          rounds: 1,
          exercises: [
            {
              id: "hd_b_nordics",
              name: "Nordic Curls",
              detail: "Knees anchored, 5s eccentric",
              target: "3-5",
              repMin: 3,
              repMax: 5,
              tempo: "5-0-x",
              warmupSets: 1,
              notes: "Kneel on a pad, feet anchored under something heavy. Body straight from knees to shoulders, lower slowly by extending at the knees. 5-second eccentric on every rep. Use your hands to push off the floor on the way up — the eccentric is the priority. 3–5 reps to failure.",
              progression: [
                "Level 1 — Band-assisted Nordic curls",
                "Level 2 — Eccentric-only (push up with hands)",
                "Level 3 — Full Nordic curls (controlled both ways)",
                "Level 4 — Weighted Nordic curls",
              ],
            },
          ],
        },
        {
          label: "Elevated Pike Push-ups",
          rounds: 1,
          exercises: [
            {
              id: "hd_b_pike_pushups",
              name: "Elevated Pike Push-ups",
              detail: "Feet on bench, torso near vertical",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "mechanical_drop",
              beyondFailureHint: "After failure: drop feet to the floor, continue standard pike push-ups to failure.",
              notes: "Hands on floor, feet elevated on a bench. Hips piked high so your torso is as vertical as possible — this mimics an overhead press. Lower the top of your head toward the floor between your hands. 4s down, 1s pause, 2s press. After failure, drop feet to the floor and continue.",
              progression: [
                "Level 1 — Standard pike push-ups (feet on floor)",
                "Level 2 — Feet-elevated pike push-ups",
                "Level 3 — Wall HSPU negatives (kick up, lower 5–6s)",
                "Level 4 — Wall HSPU (full concentric and eccentric)",
              ],
            },
          ],
        },
        {
          label: "Single-Leg Calf Raises",
          rounds: 1,
          exercises: [
            {
              id: "hd_b_calf_raises",
              name: "Single-Leg Calf Raises",
              detail: "Heel off step, full ROM",
              target: "8-12",
              repMin: 8,
              repMax: 12,
              tempo: "3-2-2",
              warmupSets: 1,
              isUnilateral: true,
              beyondFailure: "mechanical_drop",
              beyondFailureHint: "After single-leg failure each side: switch to both feet together and continue to failure.",
              notes: "Stand on the edge of a step on one foot, heel hanging off. Lower the heel as far below the step as possible (full stretch), press up to the highest point on your toes (full contraction). 3s down, 2s pause at the peak contraction, 2s up. 8–12 reps per leg. After failure on both legs, switch to bilateral and continue.",
              progression: [
                "Level 1 — Bilateral calf raises on a step",
                "Level 2 — Single-leg calf raises on a step",
                "Level 3 — Weighted single-leg calf raises",
                "Level 4 — Deficit single-leg calf raises (taller step)",
              ],
            },
          ],
        },
        {
          label: "Hanging Leg Raises",
          rounds: 1,
          exercises: [
            {
              id: "hd_b_leg_raises",
              name: "Hanging Leg Raises",
              detail: "Straight legs to bar (or dragon flag)",
              target: "6-10",
              repMin: 6,
              repMax: 10,
              tempo: "4-1-2",
              warmupSets: 1,
              beyondFailure: "mechanical_drop",
              beyondFailureHint: "After failure: drop to tuck raises or knee raises and continue to failure.",
              notes: "Hang from a pull-up bar, straight arms, no swinging. Raise straight legs until feet reach bar height. 4s down, 1s pause at the bottom, 2s up. After failure, drop to a tuck position or knee raises and keep going. Alternative: dragon flags on a bench if you have one.",
              progression: [
                "Level 1 — Hanging knee raises (or lying knee raises)",
                "Level 2 — Hanging straight-leg raises to parallel (or tuck dragon flag)",
                "Level 3 — Toes to bar (or full dragon flag)",
                "Level 4 — Weighted hanging leg raises (or weighted dragon flag)",
              ],
            },
          ],
        },
      ],
    },
  },
};
