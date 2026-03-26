import { useRef, useCallback } from 'react';
import { tapFeedback } from '../lib/haptics.ts';

interface Props {
  values: number[];
  value: number;
  suggested: number | null;
  onChange: (val: number) => void;
  onConfirm: () => void;
  autoAdvanceOnTap?: boolean;
  size?: number;
}

export function RepWheel({
  values, value, suggested, onChange, onConfirm,
  autoAdvanceOnTap = false, size = 240,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ angle: number; acc: number } | null>(null);
  const sector = (2 * Math.PI) / values.length;
  const numR = size / 2 - 28;
  const half = size / 2;

  const getAngle = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return 0;
    const b = el.getBoundingClientRect();
    return Math.atan2(y - b.top - b.height / 2, x - b.left - b.width / 2);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    drag.current = { angle: getAngle(t.clientX, t.clientY), acc: 0 };
  }, [getAngle]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const d = drag.current;
    if (!d) return;
    const t = e.touches[0];
    const a = getAngle(t.clientX, t.clientY);
    let delta = a - d.angle;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    d.acc += delta;
    d.angle = a;
    if (Math.abs(d.acc) >= sector) {
      const dir = Math.sign(d.acc);
      d.acc -= dir * sector;
      const idx = values.indexOf(value);
      const cur = idx < 0 ? 0 : idx;
      const next = Math.max(0, Math.min(values.length - 1, cur + dir));
      if (next !== cur) {
        tapFeedback();
        onChange(values[next]);
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }, [getAngle, sector, values, value, onChange]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    drag.current = null;
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={ref}
      className="rep-wheel"
      style={{ width: size, height: size }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="rep-wheel-track" />
      {values.map((v, i) => {
        const a = -Math.PI / 2 + i * sector;
        return (
          <button
            key={v}
            className={`rep-wheel-num${v === value ? ' selected' : ''}${v === suggested && v !== value ? ' suggested' : ''}`}
            style={{
              left: half + numR * Math.cos(a),
              top: half + numR * Math.sin(a),
            }}
            onClick={() => {
              tapFeedback();
              onChange(v);
              if (autoAdvanceOnTap) onConfirm();
            }}
          >
            {v}
          </button>
        );
      })}
      <button
        className={`rep-wheel-center${value > 0 ? ' has-value' : ''}`}
        onClick={() => { if (value > 0) { tapFeedback(); onConfirm(); } }}
      >
        <span className="rep-wheel-value">{value || '–'}</span>
        {value > 0 && <span className="rep-wheel-hint">&#x2713;</span>}
      </button>
    </div>
  );
}
