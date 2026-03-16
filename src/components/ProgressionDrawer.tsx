import type { Exercise } from '../types/program.ts';

interface Props {
  exercise: Exercise;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export function ProgressionDrawer({ exercise, currentLevel, onSelectLevel, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer slide-up" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
          {exercise.name}
        </h3>
        <p className="text-body" style={{ marginBottom: 'var(--space-5)' }}>
          Tap to set your current level
        </p>
        {exercise.progression.map((step, i) => {
          const isCurrent = i === currentLevel;
          return (
            <div key={i} className="prog-item" onClick={() => onSelectLevel(i)}
              style={{ borderBottom: i < exercise.progression.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '12px', fontWeight: 700,
                background: isCurrent ? 'var(--day-bg-subtle)' : 'var(--bg-subtle)',
                color: isCurrent ? 'var(--day-color)' : 'var(--text-secondary)',
              }}>
                {i + 1}
              </div>
              <span style={{
                color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 'var(--text-md)', fontWeight: isCurrent ? 600 : 400, flex: 1,
              }}>{step}</span>
              {isCurrent && (
                <span style={{
                  background: 'var(--day-bg-subtle)', color: 'var(--day-color)',
                  fontSize: 'var(--text-xs)', fontWeight: 700,
                  padding: '3px 8px', borderRadius: 'var(--radius-sm)', letterSpacing: 0.5,
                }}>CURRENT</span>
              )}
            </div>
          );
        })}
        <p style={{ marginTop: 'var(--space-5)', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
          Progress when you hit the top of your rep range on all sets for 2 sessions in a row.
        </p>
      </div>
    </div>
  );
}
