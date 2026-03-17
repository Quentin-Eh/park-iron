import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "https://esm.sh/@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth: extract user from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { session_local_id } = await req.json();
    if (!session_local_id) {
      return new Response(
        JSON.stringify({ error: "Missing session_local_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Load target session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("local_id", session_local_id)
      .single();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If coaching feedback already exists, return it
    if (session.coaching_feedback) {
      return new Response(
        JSON.stringify({ feedback: session.coaching_feedback }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Load last 5 same-day sessions for trend comparison
    const { data: recentSessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("day", session.day)
      .neq("local_id", session_local_id)
      .order("started_at", { ascending: false })
      .limit(5);

    // Load current progressions
    const { data: progressionRow } = await supabase
      .from("progressions")
      .select("data")
      .eq("user_id", user.id)
      .single();

    const progressions =
      (progressionRow?.data as Record<string, number>) || {};

    // Build prompt
    const dayNames: Record<string, string> = {
      A: "Monday (Push Emphasis)",
      B: "Wednesday (Pull Emphasis)",
      C: "Friday (Legs + Core + Skill)",
    };

    const durationMin = session.ended_at
      ? Math.round(
          (new Date(session.ended_at).getTime() -
            new Date(session.started_at).getTime()) /
            60000,
        )
      : null;

    const exercises = session.exercises as Record<string, number[]>;
    const totalReps = Object.values(exercises).reduce(
      (a: number, r: number[]) => a + r.reduce((b: number, v: number) => b + v, 0),
      0,
    );

    const exerciseLines = Object.entries(exercises)
      .map(([exId, reps]) => {
        const level = progressions[exId] ?? 0;
        return `- ${exId}: reps [${(reps as number[]).join(", ")}], progression level ${level}`;
      })
      .join("\n");

    let historyBlock = "";
    if (recentSessions && recentSessions.length > 0) {
      historyBlock = "\n\nRecent same-day sessions:\n";
      for (const s of recentSessions) {
        const sExercises = s.exercises as Record<string, number[]>;
        const sDate = new Date(s.started_at).toLocaleDateString();
        const exSummary = Object.entries(sExercises)
          .map(([id, r]) => `${id}: [${(r as number[]).join(",")}]`)
          .join("; ");
        historyBlock += `- ${sDate}: ${exSummary}\n`;
      }
    }

    const userMessage = `Session: ${dayNames[session.day] || session.day}
Date: ${new Date(session.started_at).toLocaleDateString()}
Duration: ${durationMin ? `${durationMin} min` : "unknown"}
Total reps: ${totalReps}

Exercises:
${exerciseLines}${historyBlock}`;

    // Call Claude
    const anthropic = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    });

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: `You are a calisthenics training partner giving feedback after a workout session. You know the athlete trains 3 days per week at an outdoor park with pull-up bars, rings, and parallettes. His goal is hypertrophy while getting lean.

Rules:
- Write 3-4 short paragraphs max (this is read on a phone at the park)
- Reference specific numbers from the session ("Your ring dips went 8-10-9")
- When rep counts are trending up compared to recent sessions, call it out
- If hitting the top of a rep range consistently, suggest advancing the progression
- End with one concrete focus for the next session
- Be conversational, like a knowledgeable training buddy — not a corporate wellness bot
- No bullet points, no headers, no generic "Great job!" openers
- Use plain language, no emojis`,
      messages: [{ role: "user", content: userMessage }],
    });

    const feedback =
      msg.content[0].type === "text" ? msg.content[0].text : "";

    // Save feedback to DB
    await supabase
      .from("sessions")
      .update({ coaching_feedback: feedback })
      .eq("user_id", user.id)
      .eq("local_id", session_local_id);

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Coaching function error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate coaching feedback" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
