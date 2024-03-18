import { BleClient } from '@capacitor-community/bluetooth-le';
import { ref, Ref } from 'vue';
import { BLEDevice } from '@/types/BLEDevice'; // Assuming this global type declaration

// Devices discovered during scanning
const devices: Ref<BLEDevice[]> = ref([]);

// Initialize BLE and start scanning
const initializeBle = async () => {
    console.log("Scan for Devices button clicked."); // This line logs to the console
    try {
      await BleClient.initialize();
      await BleClient.requestLEScan({}, (result) => {
        console.log('Discovered device:', result);
        devices.value.push({
          deviceId: result.device.deviceId,
          name: result.device.name,
        });
      });
  
      console.log("BLE scan initialized.");
  
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log("Stopped scanning");
      }, 10000);
    } catch (error) {
      console.error('BLE error:', error);
    }
  };
  

// Connect to a specific device by its deviceId
async function pairDevice(deviceId: string) {
  try {
    await BleClient.stopLEScan(); // Consider stopping scan before attempting to connect
    console.log(`Connecting to ${deviceId}...`);
    await BleClient.connect(deviceId);
    console.log(`Connected to ${deviceId}`);
  } catch (error) {
    console.error('Error connecting to device:', error);
  }
}

export { devices, initializeBle, pairDevice };
