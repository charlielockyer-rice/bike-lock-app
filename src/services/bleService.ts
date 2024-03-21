import { ref, Ref } from 'vue';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BleDevice } from '@/types/BleDevice';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

export const devices: Ref<BleDevice[]> = ref([]);
export const connectedDeviceId: Ref<string | null> = ref(null);
export const connectionStatus: Ref<string> = ref('Disconnected');

const BIKE_SERVICE = '9a20edd4-09de-4d6b-8a96-f5b93db51f48';
const BIKE_CHARACTERISTIC = '1647ae1b-4a2d-4862-bd94-9b743dfc03f2';


export const initializeBle = async () => {
  try {
    await BleClient.initialize();
    console.log('BLE initialized');

  } catch (error) {
    console.error('BLE initialization failed', error);
  }
};

export const scanForDevices = async () => {
  try {
    // console.log('Starting BLE scan...');
    // start the scan
    await BleClient.requestLEScan({}, (result) => {
      const newDevice = {
        deviceId: result.device.deviceId,
        name: result.device.name,
        rssi: result.rssi,
      };
      // Update the devices array reactively
      devices.value.push(newDevice);
      // console.log('Discovered device:', newDevice);
    });

    // stop scanning after 3 seconds
    setTimeout(() => {
      BleClient.stopLEScan();
      // console.log('BLE scan stopped');
    }, 3000);
  } catch (error) {
    console.error('Error during BLE scan', error);
  }
};

// Call this method when a device in the list is clicked to connect
export const selectAndConnectToDevice = async (device: BleDevice) => {
  await connectToDevice(device.deviceId);
};


export const connectToDevice = async (deviceId: string): Promise<boolean> => {
  try {
    console.log(`Attempting to connect to device: ${deviceId}`);
    await BleClient.connect(deviceId);
    connectedDeviceId.value = deviceId; // Set the device as connected
    console.log('Device connected');
    connectionStatus.value = 'Connected';

    // Save the connected device ID to preferences
    await saveConnectedDeviceId(deviceId);

    // Auto-subscribe to notifications upon connection
    await startNotifications(deviceId, BIKE_SERVICE, BIKE_CHARACTERISTIC);
    return true;
  } catch (error) {
    console.error(`Could not connect to device: ${deviceId}`, error);
    return false;
  }
};

export async function autoConnectToSavedDevice() {
  console.log('Attempting to auto-connect to saved device...');
  const { value: deviceId } = await Preferences.get({ key: 'connectedDeviceId' });
  if (deviceId) {
    console.log('Auto-connecting to saved device:', deviceId);
    // NEW ATTEMPT
    await BleClient.requestLEScan({ services: [BIKE_SERVICE] }, (result) => {
      console.log('Scanning initialized; discovered device:', result.device);
      if (result.device.deviceId === deviceId) {
        try {
          connectToDevice(deviceId);
          BleClient.stopLEScan();
          console.log('Auto-connected to saved device:', deviceId);
        } catch (error) {
          BleClient.stopLEScan();
          console.error('Error connecting to device:', error);
        }
      }
    });

    // BleClient.stopLEScan();
    // const device = await BleClient.requestDevice({ services: [BIKE_SERVICE] });
    // await connectToDevice(deviceId);
  }
}

export const isConnectedToDevice = (device: BleDevice): boolean => {
  return device.deviceId === connectedDeviceId.value;
};

export async function saveConnectedDeviceId(deviceId: string) {
  await Preferences.set({
    key: 'connectedDeviceId',
    value: deviceId,
  });
}

export const getSavedDeviceId = async (): Promise<string> => {
  const { value } = await Preferences.get({ key: 'connectedDeviceId' });
  if (value) {
    return value;
  }
  return '';
};

export const startNotifications = async (deviceId: string, serviceUUID: string, characteristicUUID: string) => {
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

export const sendNotification = async (title: string, body: string) => {
  await LocalNotifications.requestPermissions();

  LocalNotifications.schedule({
    notifications: [
      {
        title,
        body,
        id: new Date().getTime(), // Use something unique if needed
        schedule: { at: new Date(new Date().getTime()) }, // Schedule for immediate display
        sound: '',
        // attachments: null,
        actionTypeId: "",
        extra: null
      },
    ],
  });
};

export async function sendCommandToDevice(deviceId: string, command: number[]) {
  try {
    // Convert the command to an ArrayBuffer
    const commandBuffer = new Uint8Array(command).buffer;

    // Assuming commandBuffer is your ArrayBuffer
    const dataView = new DataView(commandBuffer);

    // Then pass this DataView when calling write
    await BleClient.write(deviceId, BIKE_SERVICE, BIKE_CHARACTERISTIC, dataView);


    console.log('Command sent successfully');
  } catch (error) {
    console.error('Error sending command to device:', error);
  }
}

export async function disconnectFromDevice(deviceId: string) {
  await BleClient.disconnect(deviceId);
  connectedDeviceId.value = '';
  connectionStatus.value = 'Disconnected';
}

export function onDisconnect(deviceId: string): void {
  console.log(`device ${deviceId} disconnected, attempting to reconnect...`);
  // connectToDevice(deviceId);
}
