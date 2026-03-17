import { useRef, useCallback } from 'react';

type Direction = 'left' | 'right';

const MIN_DISTANCE = 50;
const MAX_VERTICAL_RATIO = 1.5; // allow fairly diagonal swipes

export function useSwipe(onSwipe: (dir: Direction) => void) {
  const startX = useRef(0);
  const startY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < MIN_DISTANCE) return;
    if (absDy > absDx * MAX_VERTICAL_RATIO) return;

    onSwipe(dx < 0 ? 'left' : 'right');
  }, [onSwipe]);

  return { onTouchStart, onTouchEnd };
}
