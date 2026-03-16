-- Park Iron — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project.

-- ═══════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════

-- Profiles (auto-created on signup via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (workout history)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id BIGINT NOT NULL,
  day TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  exercises JSONB NOT NULL,
  progressions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, local_id)
);

-- Progressions (current progression levels per exercise)
CREATE TABLE progressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Programs (per-user program)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own only
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions: users CRUD own only
CREATE POLICY "Users read own sessions"
  ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions"
  ON sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions"
  ON sessions FOR DELETE USING (auth.uid() = user_id);

-- Progressions: users CRUD own only
CREATE POLICY "Users read own progressions"
  ON progressions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progressions"
  ON progressions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progressions"
  ON progressions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own progressions"
  ON progressions FOR DELETE USING (auth.uid() = user_id);

-- Programs: users CRUD own only
CREATE POLICY "Users read own programs"
  ON programs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own programs"
  ON programs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own programs"
  ON programs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own programs"
  ON programs FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
