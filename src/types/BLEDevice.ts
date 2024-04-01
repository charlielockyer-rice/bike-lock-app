import { ref, Ref } from 'vue';
import { BleClient, RequestBleDeviceOptions, ScanResult } from '@capacitor-community/bluetooth-le';

// BLEDevice.ts
export interface BleDevice {
  deviceId: string;
  name?: string;
  rssi?: number;
}
