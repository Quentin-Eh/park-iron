import type { Session, SessionData } from '../types/session.ts';
import type { Program } from '../types/program.ts';
import type { OnboardingAnswers } from '../types/onboarding.ts';
import { supabase } from '../lib/supabase.ts';
import { DataStore } from './store.ts';

interface SyncQueueItem {
  type: 'session' | 'progressions' | 'program';
  payload: unknown;
  timestamp: number;
}

function getQueue(): SyncQueueItem[] {
  try { return JSON.parse(localStorage.getItem('pi-sync-queue') || '[]'); }
  catch { return []; }
}

function setQueue(queue: SyncQueueItem[]) {
  localStorage.setItem('pi-sync-queue', JSON.stringify(queue));
}

function enqueue(item: Omit<SyncQueueItem, 'timestamp'>) {
  const queue = getQueue();
  queue.push({ ...item, timestamp: Date.now() });
  setQueue(queue);
}

export const SyncedStore = {
  // ── Sessions ──

  async getSessions(userId: string): Promise<Session[]> {
    if (!supabase) return DataStore.getSessions();

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) throw error;

      const sessions: Session[] = (data || []).map(row => ({
        id: row.local_id,
        day: row.day,
        date: row.started_at,
        endDate: row.ended_at,
        exercises: row.exercises as SessionData,
        progressions: (row.progressions as Record<string, number>) || {},
        ...(row.coaching_feedback ? { coachingFeedback: row.coaching_feedback as string } : {}),
      }));

      // Cache locally
      DataStore.saveSessions(sessions);
      return sessions;
    } catch {
      // Offline fallback
      return DataStore.getSessions();
    }
  },

  async saveSession(userId: string, session: Session): Promise<void> {
    // Always save locally first
    const local = DataStore.getSessions();
    const updated = [session, ...local.filter(s => s.id !== session.id)];
    DataStore.saveSessions(updated);

    if (!supabase || !navigator.onLine) {
      enqueue({ type: 'session', payload: session });
      return;
    }

    try {
      await supabase.from('sessions').upsert({
        user_id: userId,
        local_id: session.id,
        day: session.day,
        started_at: session.date,
        ended_at: session.endDate,
        exercises: session.exercises,
        progressions: session.progressions,
      }, { onConflict: 'user_id,local_id' });
    } catch {
      enqueue({ type: 'session', payload: session });
    }
  },

  // ── Progressions ──

  async getProgressions(userId: string): Promise<Record<string, number>> {
    if (!supabase) return DataStore.getProgressions();

    try {
      const { data, error } = await supabase
        .from('progressions')
        .select('data')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const progs = (data?.data as Record<string, number>) || {};
      DataStore.saveProgressions(progs);
      return progs;
    } catch {
      return DataStore.getProgressions();
    }
  },

  async saveProgressions(userId: string, progs: Record<string, number>): Promise<void> {
    DataStore.saveProgressions(progs);

    if (!supabase || !navigator.onLine) {
      enqueue({ type: 'progressions', payload: progs });
      return;
    }

    try {
      await supabase.from('progressions').upsert({
        user_id: userId,
        data: progs,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } catch {
      enqueue({ type: 'progressions', payload: progs });
    }
  },

  // ── Program ──

  async getProgram(userId: string): Promise<Program> {
    if (!supabase) return DataStore.getProgram();

    try {
      const { data, error } = await supabase
        .from('programs')
        .select('data')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.data) {
        const program = data.data as Program;
        DataStore.saveProgram(program);
        return program;
      }
      return DataStore.getProgram();
    } catch {
      return DataStore.getProgram();
    }
  },

  async saveProgram(userId: string, program: Program): Promise<void> {
    DataStore.saveProgram(program);

    if (!supabase || !navigator.onLine) {
      enqueue({ type: 'program', payload: program });
      return;
    }

    try {
      await supabase.from('programs').upsert({
        user_id: userId,
        data: program,
        updated_at: new Date().toISOString(),
      });
    } catch {
      enqueue({ type: 'program', payload: program });
    }
  },

  async generateProgram(answers: OnboardingAnswers): Promise<Program> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.functions.invoke('generate-program', {
      body: { answers },
    });

    if (error) throw error;
    if (!data?.program) throw new Error('Invalid response from program generator');

    return data.program as Program;
  },

  // ── Sync queue processing ──

  async processQueue(userId: string): Promise<void> {
    if (!supabase || !navigator.onLine) return;

    const queue = getQueue();
    if (queue.length === 0) return;

    const remaining: SyncQueueItem[] = [];

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'session': {
            const s = item.payload as Session;
            await supabase.from('sessions').upsert({
              user_id: userId,
              local_id: s.id,
              day: s.day,
              started_at: s.date,
              ended_at: s.endDate,
              exercises: s.exercises,
              progressions: s.progressions,
            }, { onConflict: 'user_id,local_id' });
            break;
          }
          case 'progressions': {
            await supabase.from('progressions').upsert({
              user_id: userId,
              data: item.payload,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
            break;
          }
          case 'program': {
            await supabase.from('programs').upsert({
              user_id: userId,
              data: item.payload,
              updated_at: new Date().toISOString(),
            });
            break;
          }
        }
      } catch {
        remaining.push(item);
      }
    }

    setQueue(remaining);
  },

  // ── Coaching ──

  async fetchCoaching(sessionLocalId: number): Promise<string | null> {
    if (!supabase || !navigator.onLine) return null;

    try {
      const { data, error } = await supabase.functions.invoke('coaching', {
        body: { session_local_id: sessionLocalId },
      });

      if (error) throw error;
      return data?.feedback || null;
    } catch {
      return null;
    }
  },

  // ── Migration: localStorage → Supabase ──

  async migrateLocalData(userId: string): Promise<void> {
    if (!supabase) return;
    if (localStorage.getItem('pi-migrated') === 'true') return;

    try {
      // Migrate sessions
      const localSessions = DataStore.getSessions();
      if (localSessions.length > 0) {
        const rows = localSessions.map(s => ({
          user_id: userId,
          local_id: s.id,
          day: s.day,
          started_at: s.date,
          ended_at: s.endDate,
          exercises: s.exercises,
          progressions: s.progressions || {},
        }));

        await supabase.from('sessions').upsert(rows, { onConflict: 'user_id,local_id' });
      }

      // Migrate progressions
      const localProgs = DataStore.getProgressions();
      if (Object.keys(localProgs).length > 0) {
        await supabase.from('progressions').upsert({
          user_id: userId,
          data: localProgs,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }

      // Migrate program
      const localProgram = DataStore.getProgram();
      await supabase.from('programs').insert({
        user_id: userId,
        data: localProgram,
      });

      localStorage.setItem('pi-migrated', 'true');
    } catch {
      // Migration failed — will retry next time
    }
  },
};
