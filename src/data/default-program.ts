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
            notes: "3 second eccentric (slow down, fast up). Lean forward for chest emphasis.",
            progression: ["Ring dips (3s eccentric)", "Ring dips (5s eccentric)", "Ring dips w/ 2s pause at bottom", "Weighted ring dips (backpack)"] },
          { id: "pullups_a", name: "Pull-ups", detail: "Wide grip, bar", target: "6-12",
            notes: "Wide grip on bar. Controlled tempo, full range of motion.",
            progression: ["Wide grip pull-ups", "Slow tempo (4s down)", "Archer pull-ups (partial)", "Archer pull-ups (full)", "One-arm negatives"] },
        ]},
        { type: "superset", label: "Superset 2", rounds: 3, rest: 60, exercises: [
          { id: "archer_pushups", name: "Archer Push-ups", detail: "Parallettes (or diamond if needed)", target: "6-12",
            notes: "On parallettes. Start with diamond push-ups if archers aren't accessible yet.",
            progression: ["Diamond push-ups", "Archer push-ups (partial)", "Archer push-ups (full)", "One-arm negatives"] },
          { id: "ring_rows", name: "Ring Rows", detail: "Feet elevated if possible", target: "6-12",
            notes: "Elevate feet if possible. Squeeze shoulder blades hard at top.",
            progression: ["Ring rows (feet on ground)", "Ring rows (feet elevated)", "Ring rows (slow 4s eccentric)", "Front lever rows (tuck)"] },
        ]},
        { type: "superset", label: "Finisher", rounds: 2, rest: 60, exercises: [
          { id: "pike_pushups", name: "Pike Push-ups", detail: "Feet elevated on bar", target: "8-15",
            notes: "Feet elevated on bar. Progress toward handstand push-ups.",
            progression: ["Pike push-ups (feet on ground)", "Pike push-ups (feet elevated)", "Wall HSPU negatives", "Wall HSPU"] },
          { id: "face_pulls", name: "Ring Face Pulls", detail: "Squeeze rear delts", target: "8-15",
            notes: "Rear delts and external rotation. Squeeze at end range.",
            progression: ["Ring face pulls (upright)", "Ring face pulls (more horizontal)", "Ring face pulls (slow eccentric)"] },
        ]},
        { type: "straight", label: "Legs", rounds: 3, rest: 120, exercises: [
          { id: "pistols_a", name: "Pistol Squats", detail: "Full depth, each leg", target: "6-8/leg",
            notes: "Full depth, controlled. No bouncing at the bottom.",
            progression: ["Bodyweight pistols", "Slow eccentric (5s)", "Weighted (backpack/stone)"] },
        ]},
      ],
    },
    B: {
      name: "Day B", subtitle: "Pull Emphasis + Push Maintenance", color: "#4ECDC4",
      sections: [
        { type: "superset", label: "Superset 1", rounds: 3, rest: 90, exercises: [
          { id: "chinups", name: "Chin-ups", detail: "Palms facing you — biceps focus", target: "6-12",
            notes: "Palms facing you. Great for biceps. Full hang at bottom.",
            progression: ["Chin-ups (bodyweight)", "Chin-ups (slow 4s eccentric)", "Weighted chin-ups", "One-arm chin-up negatives"] },
          { id: "ring_dips_b", name: "Ring Dips", detail: "Maintenance volume", target: "6-12",
            notes: "Maintenance volume for pushing muscles.",
            progression: ["Ring dips (3s eccentric)", "Ring dips (5s eccentric)", "Ring dips w/ 2s pause", "Weighted ring dips"] },
        ]},
        { type: "superset", label: "Superset 2", rounds: 3, rest: 90, exercises: [
          { id: "archer_pullups", name: "Archer Pull-ups", detail: "Or slow-tempo pull-ups if not ready", target: "4-8",
            notes: "Or slow-tempo pull-ups (5s down) if archers aren't there yet.",
            progression: ["Slow tempo pull-ups (5s down)", "Archer pull-ups (partial shift)", "Archer pull-ups (full)", "One-arm negatives (5s+)"] },
          { id: "deep_pushups", name: "Deep Push-ups", detail: "Parallettes, full ROM", target: "8-12",
            notes: "Parallettes, full ROM. Go below hand level.",
            progression: ["Deep push-ups (parallettes)", "Deep push-ups (slow 3s eccentric)", "Deficit push-ups (elevated hands)", "Pseudo-planche push-ups"] },
        ]},
        { type: "superset", label: "Finisher", rounds: 2, rest: 60, exercises: [
          { id: "ring_curls", name: "Ring Curls", detail: "Supinated grip, elbows fixed", target: "8-12",
            notes: "Supinated grip, elbows stay fixed. Like a bicep curl on rings.",
            progression: ["Ring curls (upright)", "Ring curls (more horizontal)", "Ring curls (slow eccentric)"] },
          { id: "leg_raises", name: "Hanging Leg Raises", detail: "Straight legs, to L or V", target: "8-12",
            notes: "Straight legs to L or V position. Compress hard at top.",
            progression: ["Knee raises", "L-raise (straight legs to L)", "V-raise (legs to bar)", "Toes to bar (slow)"] },
        ]},
        { type: "straight", label: "Legs", rounds: 3, rest: 90, exercises: [
          { id: "bulgarians", name: "Bulgarian Split Squats", detail: "Rear foot on parallette", target: "8-10/leg",
            notes: "Rear foot on parallette. Slow eccentric.",
            progression: ["Bulgarian split squats", "Slow eccentric (4s)", "Weighted (backpack)"] },
        ]},
      ],
    },
    C: {
      name: "Day C", subtitle: "Legs + Core + Skill", color: "#A855F7",
      sections: [
        { type: "straight", label: "Legs", rounds: 3, rest: 120, exercises: [
          { id: "pistols_c", name: "Pistol Squats", detail: "Max quality reps per leg", target: "max/leg",
            notes: "Max quality reps per leg. Full ROM, no bounce.",
            progression: ["Bodyweight pistols", "Slow eccentric (5s)", "Weighted (backpack/stone)"] },
        ]},
        { type: "straight", label: "Posterior Chain", rounds: 3, rest: 120, exercises: [
          { id: "nordics", name: "Nordic Curl Negatives", detail: "Lower as slowly as possible", target: "4-6",
            notes: "Use bar for support. Lower yourself as slowly as possible.",
            progression: ["Nordic negatives (with bar assist)", "Nordic negatives (less assist)", "Nordic negatives (no assist)", "Full Nordic curls"] },
        ]},
        { type: "straight", label: "Power", rounds: 3, rest: 90, exercises: [
          { id: "jump_squats", name: "Jump Squats", detail: "Explosive, full recovery", target: "8",
            notes: "Explosive. Full depth on the squat, max height on the jump.",
            progression: ["Jump squats", "Jump squats (deeper)", "Weighted jump squats"] },
        ]},
        { type: "straight", label: "Core & Skills", rounds: 3, rest: 60, exercises: [
          { id: "vsit", name: "V-sit Hold", detail: "Max hold", target: "15-20s", isHold: true,
            notes: "Isometric hold. Build from L-sit if needed.",
            progression: ["L-sit (30s+)", "V-sit (building to 20s)", "V-sit (20s+)"] },
          { id: "planche_lean", name: "Pseudo-planche Lean", detail: "On parallettes, lean forward", target: "15-20s", isHold: true,
            notes: "On parallettes. Lean shoulders forward past hands.",
            progression: ["Slight lean", "Moderate lean (shoulders past wrists)", "Deep lean", "Tuck planche attempts"] },
          { id: "ring_support", name: "Ring Support Hold", detail: "Arms turned out (RTO)", target: "20-30s", isHold: true,
            notes: "Arms turned out (RTO). Builds toward iron cross.",
            progression: ["Ring support (neutral)", "Ring support (turned out 45°)", "Ring support (full RTO)", "Ring support + lean forward"] },
        ]},
      ],
    },
  },
};
