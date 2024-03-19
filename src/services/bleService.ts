import { ref, Ref } from 'vue';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BleDevice } from '@/types/BleDevice';
import { LocalNotifications } from '@capacitor/local-notifications';

export const devices: Ref<BleDevice[]> = ref([]);
const connectedDeviceId: Ref<string | null> = ref(null);

const BIKE_SERVICE = '9a20edd4-09de-4d6b-8a96-f5b93db51f48';
const characteristicUUID = '1647ae1b-4a2d-4862-bd94-9b743dfc03f2';


const initializeBle = async () => {
  try {
    await BleClient.initialize();
    console.log('BLE initialized');
    
  } catch (error) {
    console.error('BLE initialization failed', error);
  }
};

const scanForDevices = async () => {
  try {
    console.log('Starting BLE scan...');
    // start the scan
    await BleClient.requestLEScan({ services: [BIKE_SERVICE] }, (result) => {
      const newDevice = {
        deviceId: result.device.deviceId,
        name: result.device.name,
        rssi: result.rssi,
      };
      // Update the devices array reactively
      devices.value.push(newDevice);
      console.log('Discovered device:', newDevice);
    });

    // stop scanning after 3 seconds
    setTimeout(() => {
      BleClient.stopLEScan();
      console.log('BLE scan stopped');
    }, 3000);
  } catch (error) {
    console.error('Error during BLE scan', error);
  }
};

// Call this method when a device in the list is clicked to connect
const selectAndConnectToDevice = async (device: BleDevice) => {
  await connectToDevice(device.deviceId);
};


const connectToDevice = async (deviceId: string): Promise<boolean> => {
  try {
    console.log(`Attempting to connect to device: ${deviceId}`);
    await BleClient.connect(deviceId);
    connectedDeviceId.value = deviceId; // Set the device as connected
    console.log('Device connected');

    // Auto-subscribe to notifications upon connection
    await startNotifications(deviceId, BIKE_SERVICE, characteristicUUID);
    return true;
  } catch (error) {
    console.error(`Could not connect to device: ${deviceId}`, error);
    return false;
  }
};

const isConnectedToDevice = (device: BleDevice): boolean => {
  return device.deviceId === connectedDeviceId.value;
};

const startNotifications = async (deviceId: string, serviceUUID: string, characteristicUUID: string) => {
  try {
    console.log('Starting notifications for characteristic:', characteristicUUID);

    await BleClient.startNotifications(
      deviceId,
      serviceUUID,
      characteristicUUID,
      (value) => {
        console.log('Notification received', value);
        const uint8array = new Uint8Array(value.buffer);
        console.log(`Received value: ${uint8array}`);

        // Check if the value indicates the bike has been stolen
        if (uint8array.length > 0 && uint8array[0] === 0x00) {
          console.log("Your bike has been stolen!");
          sendNotification("Bike Alert!", "Your bike has been stolen!");
        }
      }
    );

    console.log('Notifications started');
  } catch (error) {
    console.error('Error starting notifications:', error);
  }
};

const sendNotification = async (title: string, body: string) => {
  await LocalNotifications.requestPermissions();

  LocalNotifications.schedule({
    notifications: [
      {
        title,
        body,
        id: new Date().getTime(), // Use something unique if needed
        schedule: { at: new Date(new Date().getTime() + 1000) }, // Schedule for immediate display
        // sound: null,
        // attachments: null,
        actionTypeId: "",
        extra: null
      },
    ],
  });
};


function onDisconnect(deviceId: string): void {
  console.log(`device ${deviceId} disconnected, attempting to reconnect...`);
  connectToDevice(deviceId);
}

export { initializeBle, scanForDevices, selectAndConnectToDevice, connectToDevice, isConnectedToDevice, startNotifications };
