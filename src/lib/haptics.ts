import { isNative } from './platform.ts';

let Haptics: typeof import('@capacitor/haptics').Haptics | null = null;
let ImpactStyle: typeof import('@capacitor/haptics').ImpactStyle | undefined;

if (isNative) {
  import('@capacitor/haptics').then(mod => {
    Haptics = mod.Haptics;
    ImpactStyle = mod.ImpactStyle;
  });
}

export function tapFeedback() {
  if (Haptics && ImpactStyle) {
    Haptics.impact({ style: ImpactStyle.Light });
  }
}

export function heavyFeedback() {
  if (Haptics && ImpactStyle) {
    Haptics.impact({ style: ImpactStyle.Heavy });
  }
}

export function notifyFeedback() {
  if (Haptics) {
    Haptics.notification({ type: 'SUCCESS' as never });
  }
}
