import type { Program } from '../types/program.ts';

export const SCHEMA_VERSION = 1;

export const DEFAULT_PROGRAM: Program = {
  schemaVersion: SCHEMA_VERSION,
  version: "1.0.0",
  name: "Park Iron — Calisthenics Hypertrophy",
  description: "3-day full body, antagonist supersets, 35-45 min",
  schedule: [
    { dayKey: "A", weekday: 1 },
    { dayKey: "B", weekday: 3 },
    { dayKey: "C", weekday: 5 },
  ],
  days: {
    A: {
      name: "Day A", subtitle: "Push Emphasis + Pull Maintenance", color: "#FF6B35",
      sections: [
        { type: "superset", label: "Superset 1", rounds: 3, rest: 90, exercises: [
          { id: "ring_dips_a", name: "Ring Dips", detail: "3s down, 1s up", target: "6-12",
            notes: "Grip rings at hip width, lean torso forward ~30°. Lower for a full 3-count — chest to ring height, elbows behind you. Press up fast. Feel it deep in your chest and front delts. Don't flare elbows out — keep them tracking at ~45°.",
            progression: ["3s eccentric — slow lower, fast press", "5s eccentric — even slower, builds tendon strength", "2s pause at bottom — hold the stretch under load", "Weighted (backpack) — add load once bodyweight is easy"] },
          { id: "pullups_a", name: "Pull-ups", detail: "Wide grip, bar", target: "6-12",
            notes: "Hands wider than shoulders on the bar, thumbs over. Dead hang start — pull until chin clears, driving elbows down and back. Control the descent, don't just drop. Targets your lats wide. Avoid kipping or shrugging your shoulders up.",
            progression: ["Wide grip — standard full ROM", "Slow tempo 4s down — control the negative", "Archer partial — shift weight to one arm", "Archer full — one arm does most work", "One-arm negatives — jump up, lower on one arm"] },
        ]},
        { type: "superset", label: "Superset 2", rounds: 3, rest: 60, exercises: [
          { id: "archer_pushups", name: "Archer Push-ups", detail: "Parallettes (or diamond if needed)", target: "6-12",
            notes: "Parallettes shoulder-width, one arm extends straight to the side as you lower on the working arm. Chest to parallette depth. If you can't get full range, start with diamond push-ups — same parallette position, hands close together. Feel the working pec and tricep doing all the work.",
            progression: ["Diamond on parallettes — hands together, same depth", "Archer partial — extend one arm partway", "Archer full — full extension, one arm works", "One-arm negatives — lower on one arm, push up with two"] },
          { id: "ring_rows", name: "Ring Rows", detail: "Feet elevated if possible", target: "6-12",
            notes: "Hang under the rings, body straight like a plank. Pull until thumbs touch your ribs, squeezing your shoulder blades together hard at the top. Elevate feet on a bar for more difficulty. Feel mid-back and rear delts. Don't let your hips sag — if they do, lower your feet.",
            progression: ["Feet on ground — easier angle", "Feet elevated — harder angle, more horizontal", "Slow 4s eccentric — control the descent", "Front lever rows (tuck) — pull from a tuck lever"] },
        ]},
        { type: "superset", label: "Finisher", rounds: 2, rest: 60, exercises: [
          { id: "pike_pushups", name: "Pike Push-ups", detail: "Feet elevated on bar", target: "8-15",
            notes: "Hands on ground, feet elevated on the bar. Hips piked high so your torso is nearly vertical. Lower your head between your hands, then press straight up. This is overhead pressing — feel it in your shoulders and upper traps. Keep your core tight, don't let your lower back arch.",
            progression: ["Feet on ground — basic pike position", "Feet elevated on bar — more vertical, harder", "Wall HSPU negatives — kick up, lower slowly", "Wall HSPU — full handstand push-ups"] },
          { id: "face_pulls", name: "Ring Face Pulls", detail: "Squeeze rear delts", target: "8-15",
            notes: "Hold rings with arms straight out in front, lean back. Pull rings to the sides of your face, rotating hands out as you pull — finish with a double-bicep pose. Squeeze your rear delts and external rotators hard at end range. Stand more horizontal for more difficulty.",
            progression: ["Upright stance — easier angle", "More horizontal — lean back further", "Slow eccentric — 3s return to start"] },
        ]},
        { type: "straight", label: "Legs", rounds: 3, rest: 120, exercises: [
          { id: "pistols_a", name: "Pistol Squats", detail: "Full depth, each leg", target: "6-8/leg", isUnilateral: true,
            notes: "Standing on one leg, extend the other leg in front. Sit all the way down — hip crease well below knee, heel stays flat. Drive up through the whole foot. Keep your chest up and the free leg off the ground the whole time. Don't bounce at the bottom — pause, then push.",
            progression: ["Bodyweight — full depth, controlled", "Slow 5s eccentric — 5 count on the way down", "Weighted (backpack/stone) — add external load"] },
        ]},
      ],
    },
    B: {
      name: "Day B", subtitle: "Pull Emphasis + Push Maintenance", color: "#4ECDC4",
      sections: [
        { type: "superset", label: "Superset 1", rounds: 3, rest: 90, exercises: [
          { id: "chinups", name: "Chin-ups", detail: "Palms facing you — biceps focus", target: "6-12",
            notes: "Palms facing you, shoulder-width grip. Dead hang, then pull until your chin is well over the bar — think about driving your elbows down into your pockets. Squeeze at the top for a beat. This hammers your biceps and inner lats. Full extension at the bottom, every rep.",
            progression: ["Bodyweight — full ROM, every rep", "Slow 4s eccentric — fight the descent", "Weighted — add load with backpack", "One-arm negatives — jump up, lower on one arm"] },
          { id: "ring_dips_b", name: "Ring Dips", detail: "Maintenance volume", target: "6-12",
            notes: "Same setup as Day A but this is maintenance volume — don't need to go to failure. Focus on crisp form: forward lean, controlled eccentric, fast press. Keep rings turned out slightly at the top for extra shoulder stability.",
            progression: ["3s eccentric — maintenance pace", "5s eccentric — slower negative", "2s pause at bottom — stretch under load", "Weighted — add load"] },
        ]},
        { type: "superset", label: "Superset 2", rounds: 3, rest: 90, exercises: [
          { id: "archer_pullups", name: "Archer Pull-ups", detail: "Or slow-tempo pull-ups if not ready", target: "4-8",
            notes: "One hand pulls, the other arm extends straight along the bar as you rise. If you can't do this yet, do slow-tempo regular pull-ups (5-second descent) instead — same grip width. Feel the working lat doing most of the pull. The assisting arm is just a guide rail.",
            progression: ["Slow tempo 5s down — build pulling strength", "Partial shift — start moving weight to one side", "Full archer — one arm does the pulling", "One-arm negatives 5s+ — pure one-arm eccentric"] },
          { id: "deep_pushups", name: "Deep Push-ups", detail: "Parallettes, full ROM", target: "8-12",
            notes: "Hands on parallettes, go deeper than regular push-ups — chest drops below hand level for a huge stretch. Full ROM is the whole point, don't cut it short. Slow and controlled. Feel the stretch in your chest at the bottom, triceps locking out at the top.",
            progression: ["Parallettes full ROM — chest below hands", "Slow 3s eccentric — control the stretch", "Deficit (elevated hands) — even more range", "Pseudo-planche push-ups — lean forward and press"] },
        ]},
        { type: "superset", label: "Finisher", rounds: 2, rest: 60, exercises: [
          { id: "ring_curls", name: "Ring Curls", detail: "Supinated grip, elbows fixed", target: "8-12",
            notes: "Grab rings palms-up, lean back with body straight. Curl yourself toward the rings by bending only at the elbows — your body from ankles to shoulders stays rigid like a plank. Squeeze your biceps hard at the top. If it's too easy standing upright, walk your feet forward to increase the angle.",
            progression: ["Upright — standing tall, easy angle", "More horizontal — feet forward, harder", "Slow eccentric — 3s on the way back"] },
          { id: "leg_raises", name: "Hanging Leg Raises", detail: "Straight legs, to L or V", target: "8-12",
            notes: "Dead hang from the bar, no swinging. Lift straight legs to at least L-position (90°) — or higher toward V. Compress hard at the top, then lower slowly. Feel your lower abs doing the lifting. If you swing, you're using momentum — reset between reps.",
            progression: ["Knee raises — knees to chest", "L-raise — straight legs to 90°", "V-raise — straight legs toward bar", "Toes to bar slow — full ROM, controlled"] },
        ]},
        { type: "straight", label: "Legs", rounds: 3, rest: 90, exercises: [
          { id: "bulgarians", name: "Bulgarian Split Squats", detail: "Rear foot on parallette", target: "8-10/leg", isUnilateral: true,
            notes: "Rear foot on a parallette behind you, front foot about two steps forward. Drop your back knee straight down until your front thigh is parallel. Drive up through the front heel. Keep your torso upright — don't lean forward. Feel the front quad and glute doing all the work.",
            progression: ["Standard — bodyweight, full depth", "Slow 4s eccentric — control the descent", "Weighted (backpack) — add external load"] },
        ]},
      ],
    },
    C: {
      name: "Day C", subtitle: "Legs + Core + Skill", color: "#A855F7",
      sections: [
        { type: "straight", label: "Legs", rounds: 3, rest: 120, exercises: [
          { id: "pistols_c", name: "Pistol Squats", detail: "Max quality reps per leg", target: "max/leg", isUnilateral: true,
            notes: "Same form as Day A but go for max quality reps. Full depth, controlled tempo, no bouncing. If one leg is weaker, do that leg first while you're fresh. Every rep should look the same — don't get sloppy as you fatigue.",
            progression: ["Bodyweight — full depth, controlled", "Slow 5s eccentric — 5 count on the way down", "Weighted (backpack/stone) — add external load"] },
        ]},
        { type: "straight", label: "Posterior Chain", rounds: 3, rest: 120, exercises: [
          { id: "nordics", name: "Nordic Curl Negatives", detail: "Lower as slowly as possible", target: "4-6",
            notes: "Kneel with feet anchored under a bar. Starting upright, slowly lower your body toward the ground using only your hamstrings to resist — fight gravity the whole way down. Catch yourself with your hands at the bottom and push back up to reset. The slower you can go, the better. Feel your hamstrings on fire.",
            progression: ["With bar assist — hands help on the way down", "Less assist — lighter touch", "No assist — just hamstrings", "Full Nordic curls — lower and pull yourself back up"] },
        ]},
        { type: "straight", label: "Power", rounds: 3, rest: 90, exercises: [
          { id: "jump_squats", name: "Jump Squats", detail: "Explosive, full recovery", target: "8",
            notes: "Feet shoulder-width, squat to full depth, then explode up as high as you can. Land soft — absorb through your legs, don't slam your knees. Full recovery between reps: reset your feet, reset your breath, then go again. This is power — every rep should be maximal effort.",
            progression: ["Standard — full depth, max height", "Deeper — pause at the bottom", "Weighted — hold a stone or wear a pack"] },
        ]},
        { type: "straight", label: "Core & Skills", rounds: 3, rest: 60, exercises: [
          { id: "vsit", name: "V-sit Hold", detail: "Max hold", target: "15-20s", isHold: true,
            notes: "Sit on the ground, hands beside your hips on the floor or parallettes. Press down to lift your butt and legs off the ground — extend legs up toward a V shape. If you can't V yet, start with an L-sit (legs horizontal). Squeeze your hip flexors and abs to hold the position. Breathe shallow and stay tight.",
            progression: ["L-sit 30s+ — legs horizontal, master this first", "V-sit building to 20s — legs angled up", "V-sit 20s+ — full hold, legs high"] },
          { id: "planche_lean", name: "Pseudo-planche Lean", detail: "On parallettes, lean forward", target: "15-20s", isHold: true,
            notes: "Hands on parallettes, arms straight, lean your shoulders as far forward past your wrists as you can. Your body stays in a straight line — plank position but tilted forward. Feel intense pressure in your front delts and wrist flexors. Start with a slight lean and inch forward over weeks. Protract your shoulder blades (push the ground away).",
            progression: ["Slight lean — shoulders just past wrists", "Moderate — shoulders well past wrists", "Deep lean — maximum forward shift", "Tuck planche attempts — lift feet off ground"] },
          { id: "ring_support", name: "Ring Support Hold", detail: "Arms turned out (RTO)", target: "20-30s", isHold: true,
            notes: "Press up to the top of a ring dip and hold. Turn your hands out (rings turned out / RTO) — start at 45° and work toward full turnout. Lock your elbows, depress your shoulders (push down), and keep your body tight. Feel your chest, front delts, and biceps working to stabilize. This builds toward iron cross strength.",
            progression: ["Neutral — rings parallel, just hold", "Turned out 45° — partial RTO", "Full RTO — rings fully turned out", "RTO + lean forward — add forward lean"] },
        ]},
      ],
    },
  },
};
