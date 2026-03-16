import type { Session, SessionDraft, SessionData } from '../types/session.ts';
import type { Program } from '../types/program.ts';
import { DEFAULT_PROGRAM } from './default-program.ts';

function get<T>(key: string): T | null {
  try { return JSON.parse(localStorage.getItem(`pi-${key}`)!) as T; }
  catch { return null; }
}

function set(key: string, val: unknown): void {
  try { localStorage.setItem(`pi-${key}`, JSON.stringify(val)); }
  catch { /* quota exceeded — silently fail */ }
}

function del(key: string): void {
  try { localStorage.removeItem(`pi-${key}`); }
  catch { /* ignore */ }
}

export const DataStore = {
  getSessions(): Session[] { return get<Session[]>('sessions') || []; },
  saveSessions(s: Session[]) { set('sessions', s); },

  getDraft(): SessionDraft | null { return get<SessionDraft>('draft'); },
  saveDraft(d: Omit<SessionDraft, 'savedAt'>) { set('draft', { ...d, savedAt: new Date().toISOString() }); },
  clearDraft() { del('draft'); },

  getProgressions(): Record<string, number> { return get<Record<string, number>>('progressions') || {}; },
  saveProgressions(p: Record<string, number>) { set('progressions', p); },

  getProgram(): Program { return get<Program>('program') || DEFAULT_PROGRAM; },
  saveProgram(p: Program) { set('program', p); },

  getVersion(): number { return get<number>('version') || 0; },
  setVersion(v: number) { set('version', v); },

  exportAll() {
    return {
      exportVersion: 1,
      exportDate: new Date().toISOString(),
      sessions: this.getSessions(),
      progressions: this.getProgressions(),
      program: this.getProgram(),
    };
  },

  importAll(blob: unknown) {
    if (!blob || typeof blob !== 'object') throw new Error('Invalid backup');
    if (Array.isArray(blob)) {
      this.saveSessions(blob as Session[]);
      return;
    }
    const b = blob as Record<string, unknown>;
    if (b.exportVersion) {
      if (b.sessions) this.saveSessions(b.sessions as Session[]);
      if (b.progressions) this.saveProgressions(b.progressions as Record<string, number>);
      if (b.program) this.saveProgram(b.program as Program);
      return;
    }
    throw new Error('Unrecognized backup format');
  },

  migrate() {
    const currentVersion = this.getVersion();
    if (currentVersion >= 1) return;
    try {
      const raw = localStorage.getItem('pi-history');
      if (raw) {
        const oldHistory = JSON.parse(raw) as Session[];
        if (Array.isArray(oldHistory) && oldHistory.length > 0) {
          const existing = this.getSessions();
          if (existing.length === 0) {
            this.saveSessions(oldHistory);
          }
        }
      }
    } catch { /* ignore corrupt data */ }
    if (!get<Program>('program')) {
      this.saveProgram(DEFAULT_PROGRAM);
    }
    this.setVersion(1);
  },
};

DataStore.migrate();

// Re-export types used by consumers
export type { SessionData };
