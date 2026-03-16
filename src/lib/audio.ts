let ctx: AudioContext | null = null;

export function beep(freq = 880): void {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.value = 0.3;
    o.start();
    o.stop(ctx.currentTime + 0.15);
  } catch { /* audio not available */ }
}
