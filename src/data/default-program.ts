import type { Program } from '../types/program.ts';

export const SCHEMA_VERSION = 2;

export const DEFAULT_PROGRAM: Program = {
  schemaVersion: SCHEMA_VERSION,
  version: "2.0.0",
  name: "Park Iron — Upper/Lower Split",
  description: "4-day upper/lower, straight sets, flow-state training",
  schedule: [
    { dayKey: "UA", weekday: 1 },
    { dayKey: "LA", weekday: 2 },
    { dayKey: "UB", weekday: 4 },
    { dayKey: "LB", weekday: 5 },
  ],
  days: {
    UA: {
      name: "Upper A", subtitle: "Push Focus", color: "#FF6B35",
      sections: [
        { label: "Dips", rounds: 2, exercises: [
          { id: "v2_dips_ua", name: "Ring Dips", detail: "3s down, 1s up", target: "3-6",
            notes: "Grip rings at hip width, lean torso forward ~30°. Lower for a full 3-count — chest to ring height, elbows behind you. Press up fast. Feel it deep in your chest and front delts. Don't flare elbows out — keep them tracking at ~45°.",
            progression: ["3s eccentric — slow lower, fast press", "5s eccentric — even slower, builds tendon strength", "2s pause at bottom — hold the stretch under load", "Weighted (backpack) — add load once bodyweight is easy"] },
        ]},
        { label: "Deep Push-ups", rounds: 3, exercises: [
          { id: "v2_deep_pushups_ua", name: "Deep Push-ups", detail: "Parallettes, full ROM", target: "3-6",
            notes: "Hands on parallettes, go deeper than regular push-ups — chest drops below hand level for a huge stretch. Full ROM is the whole point, don't cut it short. Slow and controlled. Feel the stretch in your chest at the bottom, triceps locking out at the top.",
            progression: ["Parallettes full ROM — chest below hands", "Slow 3s eccentric — control the stretch", "Deficit (elevated hands) — even more range", "Pseudo-planche push-ups — lean forward and press"] },
        ]},
        { label: "Pull-ups", rounds: 2, exercises: [
          { id: "v2_pullups_ua", name: "Pull-ups", detail: "Wide grip, bar", target: "3-6",
            notes: "Hands wider than shoulders on the bar, thumbs over. Dead hang start — pull until chin clears, driving elbows down and back. Control the descent, don't just drop. Targets your lats wide. Avoid kipping or shrugging your shoulders up.",
            progression: ["Wide grip — standard full ROM", "Slow tempo 4s down — control the negative", "Archer partial — shift weight to one arm", "Archer full — one arm does most work", "One-arm negatives — jump up, lower on one arm"] },
        ]},
        { label: "Ring Curls", rounds: 2, exercises: [
          { id: "v2_ring_curls_ua", name: "Ring Curls", detail: "Supinated grip, elbows fixed", target: "3-6",
            notes: "Grab rings palms-up, lean back with body straight. Curl yourself toward the rings by bending only at the elbows — your body from ankles to shoulders stays rigid like a plank. Squeeze your biceps hard at the top. If it's too easy standing upright, walk your feet forward to increase the angle.",
            progression: ["Upright — standing tall, easy angle", "More horizontal — feet forward, harder", "Slow eccentric — 3s on the way back"] },
        ]},
      ],
    },
    LA: {
      name: "Lower A", subtitle: "Squat Focus", color: "#4ECDC4",
      sections: [
        { label: "Pistol Squats", rounds: 3, exercises: [
          { id: "v2_pistols_la", name: "Pistol Squats", detail: "Full depth, each leg", target: "3-6", isUnilateral: true,
            notes: "Standing on one leg, extend the other leg in front. Sit all the way down — hip crease well below knee, heel stays flat. Drive up through the whole foot. Keep your chest up and the free leg off the ground the whole time. Don't bounce at the bottom — pause, then push.",
            progression: ["Bodyweight — full depth, controlled", "Slow 5s eccentric — 5 count on the way down", "Weighted (backpack/stone) — add external load"] },
        ]},
        { label: "Nordics", rounds: 3, exercises: [
          { id: "v2_nordics_la", name: "Nordic Curl Negatives", detail: "Lower as slowly as possible", target: "3-6",
            notes: "Kneel with feet anchored under a bar. Starting upright, slowly lower your body toward the ground using only your hamstrings to resist — fight gravity the whole way down. Catch yourself with your hands at the bottom and push back up to reset. The slower you can go, the better. Feel your hamstrings on fire.",
            progression: ["With bar assist — hands help on the way down", "Less assist — lighter touch", "No assist — just hamstrings", "Full Nordic curls — lower and pull yourself back up"] },
        ]},
        { label: "Leg Raises", rounds: 2, exercises: [
          { id: "v2_leg_raises_la", name: "Hanging Leg Raises", detail: "Straight legs, to L or V", target: "3-6",
            notes: "Dead hang from the bar, no swinging. Lift straight legs to at least L-position (90°) — or higher toward V. Compress hard at the top, then lower slowly. Feel your lower abs doing the lifting. If you swing, you're using momentum — reset between reps.",
            progression: ["Knee raises — knees to chest", "L-raise — straight legs to 90°", "V-raise — straight legs toward bar", "Toes to bar slow — full ROM, controlled"] },
        ]},
      ],
    },
    UB: {
      name: "Upper B", subtitle: "Pull Focus", color: "#A855F7",
      sections: [
        { label: "Chin-ups", rounds: 3, exercises: [
          { id: "v2_chinups_ub", name: "Chin-ups", detail: "Palms facing you — biceps focus", target: "3-6",
            notes: "Palms facing you, shoulder-width grip. Dead hang, then pull until your chin is well over the bar — think about driving your elbows down into your pockets. Squeeze at the top for a beat. This hammers your biceps and inner lats. Full extension at the bottom, every rep.",
            progression: ["Bodyweight — full ROM, every rep", "Slow 4s eccentric — fight the descent", "Weighted — add load with backpack", "One-arm negatives — jump up, lower on one arm"] },
        ]},
        { label: "Ring Rows", rounds: 2, exercises: [
          { id: "v2_ring_rows_ub", name: "Ring Rows", detail: "Feet elevated if possible", target: "3-6",
            notes: "Hang under the rings, body straight like a plank. Pull until thumbs touch your ribs, squeezing your shoulder blades together hard at the top. Elevate feet on a bar for more difficulty. Feel mid-back and rear delts. Don't let your hips sag — if they do, lower your feet.",
            progression: ["Feet on ground — easier angle", "Feet elevated — harder angle, more horizontal", "Slow 4s eccentric — control the descent", "Front lever rows (tuck) — pull from a tuck lever"] },
        ]},
        { label: "Deep Push-ups", rounds: 2, exercises: [
          { id: "v2_deep_pushups_ub", name: "Deep Push-ups", detail: "Parallettes, full ROM", target: "3-6",
            notes: "Hands on parallettes, go deeper than regular push-ups — chest drops below hand level for a huge stretch. Full ROM is the whole point, don't cut it short. Slow and controlled. Feel the stretch in your chest at the bottom, triceps locking out at the top.",
            progression: ["Parallettes full ROM — chest below hands", "Slow 3s eccentric — control the stretch", "Deficit (elevated hands) — even more range", "Pseudo-planche push-ups — lean forward and press"] },
        ]},
        { label: "Ring Curls", rounds: 2, exercises: [
          { id: "v2_ring_curls_ub", name: "Ring Curls", detail: "Supinated grip, elbows fixed", target: "3-6",
            notes: "Grab rings palms-up, lean back with body straight. Curl yourself toward the rings by bending only at the elbows — your body from ankles to shoulders stays rigid like a plank. Squeeze your biceps hard at the top. If it's too easy standing upright, walk your feet forward to increase the angle.",
            progression: ["Upright — standing tall, easy angle", "More horizontal — feet forward, harder", "Slow eccentric — 3s on the way back"] },
        ]},
      ],
    },
    LB: {
      name: "Lower B", subtitle: "Hinge Focus", color: "#FF6B35",
      sections: [
        { label: "Bulgarians", rounds: 3, exercises: [
          { id: "v2_bulgarians_lb", name: "Bulgarian Split Squats", detail: "Rear foot on parallette", target: "3-6", isUnilateral: true,
            notes: "Rear foot on a parallette behind you, front foot about two steps forward. Drop your back knee straight down until your front thigh is parallel. Drive up through the front heel. Keep your torso upright — don't lean forward. Feel the front quad and glute doing all the work.",
            progression: ["Standard — bodyweight, full depth", "Slow 4s eccentric — control the descent", "Weighted (backpack) — add external load"] },
        ]},
        { label: "Nordics", rounds: 2, exercises: [
          { id: "v2_nordics_lb", name: "Nordic Curl Negatives", detail: "Lower as slowly as possible", target: "3-6",
            notes: "Kneel with feet anchored under a bar. Starting upright, slowly lower your body toward the ground using only your hamstrings to resist — fight gravity the whole way down. Catch yourself with your hands at the bottom and push back up to reset. The slower you can go, the better. Feel your hamstrings on fire.",
            progression: ["With bar assist — hands help on the way down", "Less assist — lighter touch", "No assist — just hamstrings", "Full Nordic curls — lower and pull yourself back up"] },
        ]},
        { label: "V-sit", rounds: 2, exercises: [
          { id: "v2_vsit_lb", name: "V-sit Hold", detail: "Max hold", target: "max hold", isHold: true,
            notes: "Sit on the ground, hands beside your hips on the floor or parallettes. Press down to lift your butt and legs off the ground — extend legs up toward a V shape. If you can't V yet, start with an L-sit (legs horizontal). Squeeze your hip flexors and abs to hold the position. Breathe shallow and stay tight.",
            progression: ["L-sit 30s+ — legs horizontal, master this first", "V-sit building to 20s — legs angled up", "V-sit 20s+ — full hold, legs high"] },
        ]},
      ],
    },
  },
};
