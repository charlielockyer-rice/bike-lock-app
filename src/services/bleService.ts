import { ref, Ref } from 'vue';
import { BleDevice } from '../types/BleDevice'; // Assuming this global type declaration
import { BluetoothLe } from '@capacitor-community/bluetooth-le';

// Devices discovered during scanning
const devices: Ref<BLEDevice[]> = ref([]);

const initializeBle = async () => {
  await BluetoothLe.initialize();
  console.log('BLE initialized');
};

const scanForDevices = async (): Promise<BleDevice[]> => {
  await BluetoothLe.requestLEScan();

  const foundDevices: BleDevice[] = []; // Renamed to avoid name conflicts

  // Add a listener for the scan result event
  const listener = await BluetoothLe.addListener('onScanResult', (result) => {
    // Assuming result.device is of type BleDevice and has a property deviceId
    if (result.device && 'deviceId' in result.device) {
      foundDevices.push(result.device); // Push the BleDevice object directly
    }
  });

  console.log('Scanning for devices...');

  // Stop scanning after a certain timeout and remove the listener
  setTimeout(async () => {
    await BluetoothLe.stopLEScan();
    listener.remove(); // Use the listener's remove method to clean up
    console.log('Scan stopped');
  }, 10000); // Adjust the timeout as needed

  return new Promise((resolve) => {
    // Resolve the devices list when scanning stops
    setTimeout(() => resolve(foundDevices), 10050);
  });
};

const pairDevice = async (deviceId: string) => {
  await BluetoothLe.connect({ deviceId });
  console.log(`Connected to device ${deviceId}`);
};

export { initializeBle, scanForDevices, pairDevice };

