import { useRef, useCallback, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ angle: number; acc: number } | null>(null);

  // Refs to avoid stale closures in native event listeners
  const valuesRef = useRef(values);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  valuesRef.current = values;
  valueRef.current = value;
  onChangeRef.current = onChange;

  const numR = size / 2 - 28;
  const half = size / 2;
  const sector = (2 * Math.PI) / values.length;

  const getAngle = useCallback((x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const b = el.getBoundingClientRect();
    return Math.atan2(y - b.top - b.height / 2, x - b.left - b.width / 2);
  }, []);

  // Native event listeners with passive: false so we can preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleStart = (e: TouchEvent) => {
      const t = e.touches[0];
      dragRef.current = { angle: getAngle(t.clientX, t.clientY), acc: 0 };
    };

    const handleMove = (e: TouchEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const t = e.touches[0];
      const a = getAngle(t.clientX, t.clientY);
      let delta = a - d.angle;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      d.acc += delta;
      d.angle = a;

      const sectorAngle = (2 * Math.PI) / valuesRef.current.length;
      if (Math.abs(d.acc) >= sectorAngle) {
        const dir = Math.sign(d.acc);
        d.acc -= dir * sectorAngle;
        const vals = valuesRef.current;
        const idx = vals.indexOf(valueRef.current);
        const cur = idx < 0 ? 0 : idx;
        const next = Math.max(0, Math.min(vals.length - 1, cur + dir));
        if (next !== cur) {
          tapFeedback();
          onChangeRef.current(vals[next]);
        }
      }
      // Prevent page scroll and parent swipe handler
      e.preventDefault();
      e.stopPropagation();
    };

    const handleEnd = (e: TouchEvent) => {
      if (dragRef.current) {
        dragRef.current = null;
        e.stopPropagation();
      }
    };

    el.addEventListener('touchstart', handleStart, { passive: true });
    el.addEventListener('touchmove', handleMove, { passive: false });
    el.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleStart);
      el.removeEventListener('touchmove', handleMove);
      el.removeEventListener('touchend', handleEnd);
    };
  }, [getAngle]);

  return (
    <div
      ref={containerRef}
      className="rep-wheel"
      style={{ width: size, height: size }}
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
