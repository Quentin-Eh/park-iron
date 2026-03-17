let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

export function beep(freq = 880): void {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.frequency.value = freq;
    g.gain.value = 0.3;
    o.start();
    o.stop(c.currentTime + 0.15);
  } catch { /* audio not available */ }
}

/** Soft two-tone chime (440Hz → 523Hz, major third) for rest completion */
export function gentleChime(): void {
  try {
    const c = getCtx();
    const now = c.currentTime;

    // First tone: A4 (440Hz)
    const o1 = c.createOscillator();
    const g1 = c.createGain();
    o1.type = 'sine';
    o1.frequency.value = 440;
    g1.gain.value = 0.15;
    o1.connect(g1);
    g1.connect(c.destination);
    o1.start(now);
    o1.stop(now + 0.2);

    // Second tone: C5 (523Hz) after 150ms gap
    const o2 = c.createOscillator();
    const g2 = c.createGain();
    o2.type = 'sine';
    o2.frequency.value = 523;
    g2.gain.value = 0.15;
    o2.connect(g2);
    g2.connect(c.destination);
    o2.start(now + 0.35);
    o2.stop(now + 0.55);
  } catch { /* audio not available */ }
}
