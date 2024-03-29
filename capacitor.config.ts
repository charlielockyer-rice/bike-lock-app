import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'bike.lock.app',
  appName: 'bike-lock-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BluetoothLe: {
      serviceUUIDs: ['your-service-uuids'], // Optional: add your service UUIDs if you want to filter
      peripheral: {
        requestLEScan: true,
        optionalServices: ['your-service-uuids'] // Optional: add service UUIDs if needed
      },
      PushNotifications: {
        presentationOptions: ["badge", "sound", "alert"],
      },
    }
  },
};

export default config;
