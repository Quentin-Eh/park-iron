# Growth Opportunities

## Distribution: Pinterest (Phase 4)
- 480M monthly users, 85% female, household income >$75k, 87% have bought from platform content
- Organic CPM ~$0.12 (vs $2-4 TikTok, $6-12 Instagram) — 50-400x more reach per piece
- Content lifespan 4-6 months (compounding asset, not disposable)
- Fitness/transformation content crushes on Pinterest (before/after, progress photos)
- Women in calisthenics = underserved market, almost zero competition
- Window: ~12-18 months before saturation (as of March 2026)
- **Action:** Build shareable content features (progress photos, workout summary cards, transformation timelines) with Pinterest distribution in mind
- **Action:** When app launches publicly, start 3-5 Pinterest accounts in calisthenics/fitness niches with Canva slideshows linking to app

## Product Development: Reddit Mining
- Append `/.json` to any Reddit thread URL → structured data with all replies + metadata
- Feed r/bodyweightfitness, r/calisthenics complaint threads into LLM
- Extract feature patterns, pain points, and unmet needs
- **Action:** Before Phase 4 feature planning, run this process on top 50 complaint threads in fitness app subreddits
- **Action:** Could automate this as a recurring product insight pipeline

## Business Model: Service-as-a-Software
- Encode 10 years of calisthenics expertise into AI skill files
- Sell the SERVICE (personalized training), not the software
- AI handles delivery at scale, domain knowledge is the moat
- Competing with manual personal trainers, not with OpenAI
- Near-zero marginal cost per additional client
- **Action:** Phase 3 AI coaching layer IS this — the app becomes the delivery mechanism for expert knowledge at infinite scale
- **Action:** Consider pricing as a service ($X/month for AI personal trainer) not as an app subscription

## Indie Tech Stack (validated by market)
- Claude (code) + Supabase (backend) + Vercel/GitHub Pages (deploy) + Stripe (payments)
- Clerk or Supabase Auth (auth) + Resend (email) + PostHog (analytics) + Sentry (errors)
- Already on this path — validates the Phase 3 architecture choices
- **Action:** When starting Phase 3, evaluate Clerk vs Supabase Auth, add PostHog + Sentry early

## Resource
- public-apis/public-apis GitHub repo — catalog of free APIs
- Potentially useful for Phase 3+ integrations (weather for outdoor training, health data, etc.)
