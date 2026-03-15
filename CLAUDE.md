# PARK IRON — Project Brief & Context

## What this is
A mobile-first PWA workout tracker for calisthenics training. Built as a single `index.html` file, deployed via GitHub Pages. The user (Quentin) opens it on his phone as a home screen app and uses it at an outdoor park with bars, rings, and parallettes.

## Current state
- The app is in `index.html` in this repo
- It's a single HTML file using React 18 (via CDN + Babel standalone)
- Styling is inline CSS, no build step needed
- Data persists via localStorage
- Deployed on GitHub Pages

## The user
- 29 years old, 183cm, 81kg, ~15% body fat
- 10 years of calisthenics training
- Trains at an outdoor park with: pull-up bars, rings, parallettes
- Non-technical — communicates changes in plain language
- Goal: "size while getting shredded" with minimal time investment

## The workout program (science-based)
3 days per week, full body, ~35-45 min per session using antagonist supersets.

### Day A — Push Emphasis + Pull Maintenance
**Superset 1** (3 rounds, 90s rest):
- Ring Dips (3s eccentric) — target 6-12 reps
- Pull-ups (wide grip, bar) — target 6-12 reps

**Superset 2** (3 rounds, 60s rest):
- Archer Push-ups (parallettes, or diamond if needed) — target 6-12 reps
- Ring Rows (feet elevated if possible) — target 6-12 reps

**Finisher** (2 rounds, 60s rest):
- Pike Push-ups (feet elevated on bar) — target 8-15 reps
- Ring Face Pulls — target 8-15 reps

**Legs** (3 sets, 120s rest):
- Pistol Squats — target 6-8/leg

### Day B — Pull Emphasis + Push Maintenance
**Superset 1** (3 rounds, 90s rest):
- Chin-ups (palms facing, biceps focus) — target 6-12 reps
- Ring Dips (maintenance) — target 6-12 reps

**Superset 2** (3 rounds, 90s rest):
- Archer Pull-ups (or slow-tempo pull-ups if not ready) — target 4-8 reps
- Deep Push-ups (parallettes, full ROM) — target 8-12 reps

**Finisher** (2 rounds, 60s rest):
- Ring Curls (supinated grip, elbows fixed) — target 8-12 reps
- Hanging Leg Raises (straight legs) — target 8-12 reps

**Legs** (3 sets, 90s rest):
- Bulgarian Split Squats (rear foot on parallette) — target 8-10/leg

### Day C — Legs + Core + Skill
**Legs** (3 sets, 120s rest):
- Pistol Squats — max quality reps/leg

**Posterior Chain** (3 sets, 120s rest):
- Nordic Curl Negatives — target 4-6

**Power** (3 sets, 90s rest):
- Jump Squats — target 8

**Core & Skills** (3 sets each, 60s rest):
- V-sit Hold — target 15-20s (isometric, needs hold timer)
- Pseudo-planche Lean (parallettes) — target 15-20s (isometric)
- Ring Support Hold (arms turned out) — target 20-30s (isometric)

## Key training principles encoded in the app
1. **RIR (Repetitions In Reserve):** Stop each set when you could do 1-2 more ugly reps. Go all-out only on the LAST set of each exercise.
2. **Progression ladders:** Each exercise has a progression ladder (easier → harder variations). Progress when you hit the top of the rep range on all sets for 2 sessions in a row.
3. **Antagonist supersets:** Push/pull are paired. Do exercise A, rest 60-90s, do exercise B, rest 60-90s, repeat. This cuts session time ~36% vs traditional sets with identical hypertrophy.
4. **No logging burden:** The app should make tracking effortless — tap +/- for reps, that's it. No spreadsheets.

## App features (current)
- Home screen: pick Day A, B, or C. Shows last session date.
- Active session: exercise cards with +/- rep counters per set, rest timer with countdown + audio beep (3s warning beep + completion beep), progression ladder drawer per exercise (tap "↑ Prog"), hold timer for isometric exercises on Day C, RIR reminder banner
- Finish & save: stores session to localStorage with timestamp, duration, and all reps
- History screen: lists all past sessions with total reps, duration, per-exercise breakdown
- Export JSON: downloads full history as a .json file for review/analysis
- Clear history option
- Toast notifications for save/export/clear

## Progression ladders (reference)
Each exercise has these progressions built into the app:

**Dips:** Ring dips (3s eccentric) → 5s eccentric → 2s pause at bottom → Weighted (backpack)
**Pull-ups:** Wide grip → Slow tempo (4s down) → Archer (partial) → Archer (full) → One-arm negatives
**Push-ups:** Diamond → Archer (partial) → Archer (full) → One-arm negatives
**Pike push-ups:** Feet on ground → Feet elevated → Wall HSPU negatives → Wall HSPU
**Pistol squats:** Bodyweight → Slow eccentric (5s) → Weighted (backpack/stone)
**Chin-ups:** Bodyweight → Slow 4s eccentric → Weighted → One-arm negatives
**Archer pull-ups:** Slow tempo (5s down) → Partial shift → Full → One-arm negatives (5s+)
**Deep push-ups:** Parallettes → Slow 3s eccentric → Deficit → Pseudo-planche push-ups
**Ring rows:** Feet on ground → Feet elevated → Slow 4s eccentric → Front lever rows (tuck)
**Ring curls:** Upright → More horizontal → Slow eccentric
**Face pulls:** Upright → More horizontal → Slow eccentric
**Hanging leg raises:** Knee raises → L-raise → V-raise → Toes to bar (slow)
**Nordics:** With bar assist → Less assist → No assist → Full Nordic curls
**Jump squats:** Normal → Deeper → Weighted
**Bulgarians:** Normal → Slow eccentric (4s) → Weighted
**V-sit:** L-sit (30s+) → V-sit (building to 20s) → V-sit (20s+)
**Planche lean:** Slight lean → Moderate → Deep lean → Tuck planche attempts
**Ring support:** Neutral → Turned out 45° → Full RTO → RTO + lean forward

## Tech stack
- Single HTML file with inline React 18 + Babel (loaded from CDN)
- No build step — edit index.html, push to GitHub, it's live
- localStorage for data persistence
- GitHub Pages for hosting
- PWA meta tags for "Add to Home Screen" on mobile

## Future plans (in order of priority)
1. Polish the current app based on real usage feedback
2. Refactor into a proper React app with Vite when the single-file gets unwieldy
3. Add AI coaching layer (Claude API) that reads training logs and auto-adjusts the program
4. Eventually publish to App Store via Capacitor or React Native rewrite

## Workflow for changes
1. Quentin describes what he wants in plain language
2. Claude Code makes the changes to index.html
3. Push: `git add . && git commit -m "description" && git push`
4. App auto-updates on GitHub Pages in ~60 seconds
5. Quentin tests on his phone

## Design guidelines
- Dark theme (base: #0d0d1a)
- Day A color: #FF6B35 (orange)
- Day B color: #4ECDC4 (teal)
- Day C color: #A855F7 (purple)
- Fonts: Inter for UI, JetBrains Mono for numbers/data
- Mobile-first, touch-friendly (large tap targets, 36px+ buttons)
- Minimal, utilitarian aesthetic — this is a tool used at the park, not a showcase
- Animations should be subtle and functional, not decorative
