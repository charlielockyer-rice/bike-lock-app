import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bike.lock.app',
  appName: 'bike-lock-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
