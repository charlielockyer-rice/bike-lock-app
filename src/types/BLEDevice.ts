import { ref, Ref } from 'vue';
import { BleClient, RequestBleDeviceOptions, ScanResult } from '@capacitor-community/bluetooth-le';

// BLEDevice.ts
export interface BleDevice {
  deviceId: string;
  name?: string;
  rssi?: number;
}
  
// const devices: Ref<BleDevice[]> = ref([]);

// const initializeBle = async () => {
//   try {
//     await BleClient.initialize();

//     const options: RequestBleDeviceOptions = {}; // Adjust according to your needs
//     const callback = (result: ScanResult) => {
//       console.log('Discovered device:', result);
//       devices.value.push({
//         deviceId: result.device.deviceId,
//         name: result.device.name,
//       });
//     };

//     await BleClient.requestLEScan(options, callback);

//     // Optionally, stop scanning after a timeout (e.g., 10 seconds)
//     setTimeout(() => {
//       BleClient.stopLEScan();
//       console.log('Stopped scanning');
//     }, 10000);
//   } catch (error) {
//     console.error('BLE error:', error);
//   }
// };
