import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parkiron.app',
  appName: 'Park Iron',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      backgroundColor: '#0d0d1a',
      style: 'DARK',
    },
  },
};

export default config;
