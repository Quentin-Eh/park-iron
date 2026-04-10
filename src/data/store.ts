import type { Session, SessionDraft, SessionData } from '../types/session.ts';
import type { Program } from '../types/program.ts';
import { DEFAULT_PROGRAM } from './default-program.ts';
import { PROGRAMS, getProgramById, DEFAULT_ACTIVE_PROGRAM_ID } from './programs.ts';

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

  /**
   * Returns the currently active program. Resolution order:
   *   1. If `pi-program` exists AND its id matches the active id, return it
   *      (preserves customizations made to the active program).
   *   2. Otherwise return the library copy for the active id.
   *   3. Fall back to DEFAULT_PROGRAM if something is wrong.
   */
  getProgram(): Program {
    const activeId = this.getActiveProgramId();
    const stored = get<Program>('program');
    if (stored && stored.id === activeId) return stored;
    return getProgramById(activeId) || DEFAULT_PROGRAM;
  },
  saveProgram(p: Program) { set('program', p); },
  hasProgram(): boolean { return localStorage.getItem('pi-program') !== null; },

  getActiveProgramId(): string {
    return get<string>('active-program') || DEFAULT_ACTIVE_PROGRAM_ID;
  },
  /**
   * Switch to a different program from the library. Clears any customizations
   * from the previously active program (`pi-program`) so the new library copy
   * is used fresh.
   */
  setActiveProgramId(id: string) {
    const program = getProgramById(id);
    if (!program) return;
    set('active-program', id);
    // Replace any cached/customized program object with the library version
    set('program', program);
  },
  listPrograms(): Program[] { return PROGRAMS; },

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

    // v0 → v1: migrate old pi-history key
    if (currentVersion < 1) {
      const hadOldHistory = localStorage.getItem('pi-history') !== null;
      try {
        if (hadOldHistory) {
          const oldHistory = JSON.parse(localStorage.getItem('pi-history')!) as Session[];
          if (Array.isArray(oldHistory) && oldHistory.length > 0) {
            const existing = this.getSessions();
            if (existing.length === 0) {
              this.saveSessions(oldHistory);
            }
          }
        }
      } catch { /* ignore corrupt data */ }
      const hasExistingData = hadOldHistory || this.getSessions().length > 0;
      if (!get<Program>('program') && hasExistingData) {
        this.saveProgram(DEFAULT_PROGRAM);
      }
      this.setVersion(1);
    }

    // v1 → v2: new 4-day program, clear stale draft
    if (currentVersion < 2) {
      this.clearDraft();
      this.saveProgram(DEFAULT_PROGRAM);
      this.setVersion(2);
    }

    // v2 → v3: revised program (new exercises, rep ranges, ordering)
    if (currentVersion < 3) {
      this.clearDraft();
      this.saveProgram(DEFAULT_PROGRAM);
      this.setVersion(3);
    }

    // v3 → v4: rest-pause program, new exercises (ring push-ups, bar dips, wall HSPU, ring leg curls)
    if (currentVersion < 4) {
      this.clearDraft();
      this.saveProgram(DEFAULT_PROGRAM);
      this.setVersion(4);
    }

    // v4 → v5: multi-program support. Existing users keep rest-pause as active;
    // any stored custom program is rebased onto the updated schema.
    if (currentVersion < 5) {
      if (!get<string>('active-program')) {
        set('active-program', DEFAULT_ACTIVE_PROGRAM_ID);
      }
      // Re-save the default program so tag fields (id, scheduleMode) are present
      const stored = get<Program>('program');
      if (!stored || stored.id !== DEFAULT_PROGRAM.id) {
        this.saveProgram(DEFAULT_PROGRAM);
      } else if (!stored.scheduleMode) {
        // Stored program predates scheduleMode — merge the required field
        this.saveProgram({ ...DEFAULT_PROGRAM, ...stored, scheduleMode: 'weekly' });
      }
      this.clearDraft();
      this.setVersion(5);
    }
  },
};

DataStore.migrate();

// Re-export types used by consumers
export type { SessionData };
