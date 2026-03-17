import { useRef, useState } from 'react';
import type { Program } from '../types/program.ts';
import type { Session } from '../types/session.ts';
import { WEEKDAY_NAMES, fmtDate, findExerciseName } from '../lib/format.ts';
import { DataStore } from '../data/store.ts';

interface Props {
  program: Program;
  history: Session[];
  setHistory: (h: Session[]) => void;
  setProgressions: (p: Record<string, number>) => void;
  showToast: (msg: string) => void;
  onBack: () => void;
}

export function HistoryScreen({ program, history, setHistory, setProgressions, showToast, onBack }: Props) {
  const importRef = useRef<HTMLInputElement>(null);

  const schedule = program.schedule || [
    { dayKey: 'A', weekday: 1 },
    { dayKey: 'B', weekday: 3 },
    { dayKey: 'C', weekday: 5 },
  ];

  const exportAll = () => {
    const blob = DataStore.exportAll();
    const b = new Blob([JSON.stringify(blob, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `park-iron-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Backup exported!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const blob = JSON.parse(ev.target!.result as string);
        DataStore.importAll(blob);
        setHistory(DataStore.getSessions());
        setProgressions(DataStore.getProgressions());
        showToast('Data restored!');
      } catch {
        showToast('Import failed — invalid file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearHistory = () => {
    if (confirm('Delete all session history? Cannot be undone.')) {
      setHistory([]);
      DataStore.saveSessions([]);
      showToast('History cleared');
    }
  };

  return (
    <div style={{ padding: 'var(--space-4)' }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button className="btn-icon" onClick={onBack}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>History</h2>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <button onClick={exportAll} className="btn-sm" style={{
          flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(78,205,196,.3)', background: 'rgba(78,205,196,.08)',
          color: '#4ECDC4', fontSize: 'var(--text-base)',
        }}>
          Export
        </button>
        <button onClick={() => importRef.current?.click()} className="btn-sm" style={{
          flex: 1, padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(78,205,196,.3)', background: 'rgba(78,205,196,.08)',
          color: '#4ECDC4', fontSize: 'var(--text-base)',
        }}>
          Import
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        <button onClick={clearHistory} className="btn-sm" style={{
          padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255,80,80,.2)', background: 'rgba(255,80,80,.06)',
          color: 'var(--color-error)', fontSize: 'var(--text-base)',
        }}>
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-md)' }}>No sessions yet. Go train!</p>
        </div>
      ) : history.map(entry => {
        const d = program.days[entry.day];
        if (!d) return null;
        const sched = schedule.find(s => s.dayKey === entry.day);
        const dayName = sched ? WEEKDAY_NAMES[sched.weekday] : d.name;
        const totalReps = Object.values(entry.exercises).reduce(
          (a, r) => a + r.reduce((b, v) => b + v, 0), 0
        );
        const dur = entry.endDate
          ? Math.round((new Date(entry.endDate).getTime() - new Date(entry.date).getTime()) / 60000)
          : null;
        return (
          <div key={entry.id} data-day={entry.day} style={{
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4) 18px', marginBottom: '10px', border: '1px solid var(--day-bg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span style={{ color: 'var(--day-color)', fontWeight: 800, fontSize: 15 }}>{dayName}</span>
                <span style={{ color: 'var(--text-faint)', fontSize: '12px', marginLeft: 'var(--space-2)' }}>
                  {fmtDate(entry.date)}
                </span>
              </div>
              {dur != null && <span className="htag">{dur}min</span>}
            </div>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                {totalReps}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginLeft: 'var(--space-1)' }}>
                total reps
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.entries(entry.exercises).map(([exId, reps]) => (
                <span key={exId} className="htag">
                  {findExerciseName(program, entry.day, exId)}: {reps.join('-')}
                </span>
              ))}
            </div>
            {entry.coachingFeedback && (
              <CoachingToggle feedback={entry.coachingFeedback} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CoachingToggle({ feedback }: { feedback: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 'var(--space-3)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
        }}
      >
        <span style={{ transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
        Coach notes
      </button>
      {open && (
        <div className="coaching-feedback history-coaching" style={{ marginTop: 'var(--space-2)' }}>
          {feedback.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}
