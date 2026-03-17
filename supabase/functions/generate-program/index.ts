import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PROGRAM_INTERFACE = `
interface Exercise {
  id: string;          // snake_case, unique across program
  name: string;        // human-readable name
  detail: string;      // short technique cue
  notes?: string;      // 2-3 sentence coaching notes
  target: string;      // e.g. "6-12", "8-15", "max/leg", "15-20s"
  isHold?: boolean;    // true for isometric holds (target is seconds)
  isUnilateral?: boolean; // true for single-leg exercises
  progression: string[]; // ordered easiest → hardest, 3-4 levels
}

interface Section {
  type: "superset" | "straight"; // superset = alternating exercises, straight = one at a time
  label: string;       // e.g. "Superset 1", "Finisher", "Legs"
  rounds: number;      // how many times to repeat
  rest: number;        // seconds between rounds
  exercises: Exercise[];
}

interface Day {
  name: string;        // e.g. "Day A"
  subtitle: string;    // e.g. "Push Emphasis + Pull Maintenance"
  color: string;       // hex color for UI theming
  sections: Section[];
}

interface ScheduleEntry {
  dayKey: string;      // e.g. "A", "B", "C"
  weekday: number;     // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
}

interface Program {
  schemaVersion: 1;
  version: "1.0.0";
  name: string;
  description: string;
  schedule: ScheduleEntry[];
  days: Record<string, Day>;
}`;

const EXERCISE_CATALOG = `
## Available Exercises by Equipment

### Pull-up bar
- Pull-ups (wide, narrow, chin-ups, archer, commando)
- Hanging leg raises, knee raises, toes to bar
- Australian/inverted rows (if bar is low enough)

### Rings
- Ring dips, ring push-ups
- Ring rows, ring face pulls
- Ring curls (biceps)
- Ring support hold, ring turned-out support
- Muscle-ups (advanced)
- Ring L-sit, ring ab rollouts

### Parallettes
- Push-up variations (diamond, archer, pseudo-planche, deep)
- L-sit, V-sit holds
- Planche leans, tuck planche
- Handstand push-up negatives

### Dip station
- Dips (chest focus with lean, tricep focus upright)
- Knee/leg raises
- L-sit holds

### Resistance bands
- Band-assisted pull-ups, dips
- Band pull-aparts, face pulls
- Band rows, curls, overhead press
- Band-resisted push-ups

### No equipment (bodyweight only)
- Push-up variations (standard, diamond, archer, decline)
- Squats (air, pistol, shrimp, jump)
- Lunges, Bulgarian split squats (using a bench/step)
- Plank variations, hollow body holds
- Glute bridges, Nordic curl negatives (feet anchored)
- Burpees, mountain climbers

### Legs (always available)
- Pistol squats, shrimp squats
- Bulgarian split squats
- Jump squats
- Nordic curl negatives
- Calf raises (single leg on a step)
- Wall sits

## Progression Principles
- Each exercise needs 3-4 progression levels (easiest to hardest)
- Progressions should manipulate: tempo (slow eccentrics), range of motion, load, leverage
- Example: Push-ups → Diamond → Archer partial → Archer full → One-arm negatives

## Day Colors
Use these colors for days (cycle through them):
- "#FF6B35" (orange)
- "#4ECDC4" (teal)
- "#A855F7" (purple)
- "#F43F5E" (rose)
- "#22D3EE" (cyan)

## Rep Range Guidelines by Goal
- Build muscle: 6-12 reps, 3 rounds, 60-90s rest
- Get stronger: 3-6 reps, 4-5 rounds, 120-180s rest
- Get lean: 12-20 reps, 2-3 rounds, 30-60s rest
- All-around: 8-15 reps, 3 rounds, 60-90s rest

## Session Structure
- Use antagonist supersets (push+pull paired) to save time when session length is short
- A good session: 2-3 supersets/sections of upper body + 1 legs section
- For 2 days/week: full body each day
- For 3 days/week: push emphasis / pull emphasis / legs+core, or upper/lower/full
- For 4 days/week: upper push / upper pull / legs / full body
- For 5 days/week: push / pull / legs / upper / full body or skills
- Beginners: fewer exercises, more rest, straight sets over supersets
- Advanced: more exercises, supersets, harder progressions`;

const SYSTEM_PROMPT = `You are a calisthenics program designer. Your job is to generate a personalized training program as JSON.

You MUST return ONLY valid JSON matching this TypeScript interface — no markdown fences, no explanation, no extra text:
${PROGRAM_INTERFACE}

Available exercises and guidelines:
${EXERCISE_CATALOG}

Rules:
- Only use exercises that match the user's available equipment
- Every exercise MUST have a progression array with 3-4 levels
- Exercise IDs must be unique snake_case strings
- Set schemaVersion to 1 and version to "1.0.0"
- Spread training days across the week (e.g., Mon/Wed/Fri for 3 days)
- Adjust volume and complexity to the user's experience level
- Match session length by adjusting number of sections and rounds
- For supersets, always pair 2 exercises (push+pull or agonist+antagonist)
- Give the program a descriptive name based on the user's profile
- Include helpful coaching notes for each exercise (2-3 sentences)
- Isometric holds should have isHold: true and target like "15-20s"
- Unilateral exercises should have isUnilateral: true and target like "6-8/leg"`;

async function generateWithRetry(
  anthropic: Anthropic,
  userMessage: string,
): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20241022",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";

    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;

      // Basic structure validation
      if (
        !parsed.days ||
        !parsed.schedule ||
        typeof parsed.days !== "object" ||
        !Array.isArray(parsed.schedule)
      ) {
        if (attempt === 0) continue;
        throw new Error("Invalid program structure");
      }

      return parsed;
    } catch (e) {
      if (attempt === 1) throw e;
      // Retry on first failure
    }
  }

  throw new Error("Failed to generate valid program after retries");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();

    if (!answers || !answers.experience || !answers.equipment || !answers.goal || !answers.days || !answers.sessionLength) {
      return new Response(
        JSON.stringify({ error: "Missing required answers" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const equipmentLabels: Record<string, string> = {
      pullup_bar: "Pull-up bar",
      rings: "Rings",
      parallettes: "Parallettes",
      dip_station: "Dip station",
      resistance_bands: "Resistance bands",
      none: "No equipment",
    };

    const experienceLabels: Record<string, string> = {
      beginner: "Just starting out (complete beginner)",
      "6-12mo": "6-12 months of training",
      "1-3yr": "1-3 years of training",
      "3yr+": "3+ years of training (advanced)",
    };

    const goalLabels: Record<string, string> = {
      muscle: "Build muscle (hypertrophy focus)",
      strength: "Get stronger (strength focus)",
      lean: "Get lean (fat loss, high volume)",
      fitness: "All-around fitness (balanced)",
    };

    const equipmentList = (answers.equipment as string[])
      .map((e: string) => equipmentLabels[e] || e)
      .join(", ");

    const userMessage = `Create a training program for this person:

- Experience: ${experienceLabels[answers.experience] || answers.experience}
- Available equipment: ${equipmentList}
- Main goal: ${goalLabels[answers.goal] || answers.goal}
- Training days per week: ${answers.days}
- Session length: ${answers.sessionLength} minutes

Generate the complete Program JSON.`;

    const anthropic = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    });

    const program = await generateWithRetry(anthropic, userMessage);

    return new Response(JSON.stringify({ program }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Generate program error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate program" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
