import { ref, Ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BleDevice } from '@/types/BleDevice';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const devices: Ref<BleDevice[]> = ref([]);
export const connectedDeviceId: Ref<string | null> = ref(null);
export const connectionStatus: Ref<string> = ref('Disconnected');
export const isLocked = ref();
export const lastLockedTime = ref('');

const BIKE_SERVICE = '9a20edd4-09de-4d6b-8a96-f5b93db51f48';
const BIKE_ARMED = '1647ae1b-4a2d-4862-bd94-9b743dfc03f2';
const BIKE_LOCKED = 'e6935a88-1400-4417-ac23-dd4b607d0fc6';

// Example command bytes or data to send to the BLE device to lock/unlock
const LOCK_COMMAND = [0x01]; // Command to lock the bike
const UNLOCK_COMMAND = [0x00]; // Command to unlock the bike


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
    await startNotifications(deviceId, BIKE_SERVICE, BIKE_ARMED);

    // Fetch the lock status upon connection
    const lockStatus = await fetchLockStatus(deviceId);
    isLocked.value = lockStatus === null ? false : lockStatus;

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

export const isConnected = (): boolean => {
  return connectedDeviceId.value !== null;
}

export const isConnectedToDevice = (deviceId: string): boolean => {
  return deviceId === connectedDeviceId.value;
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
        schedule: { at: new Date(new Date().getTime() + 50) }, // Schedule for immediate display
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
    await BleClient.write(deviceId, BIKE_SERVICE, BIKE_LOCKED, dataView);

    console.log('Command sent successfully');
  } catch (error) {
    console.error('Error sending command to device:', error);
  }
}

// This method toggles the bike's lock status
export async function toggleLock(): Promise<boolean> {
  // Check if the platform is iOS
  if (Capacitor.getPlatform() === 'ios') {
    // Invoke haptic feedback
    try {
      await Haptics.impact({
        style: ImpactStyle.Light
      });
    } catch (error) {
      console.error("Haptics not available", error);
    }
  }

  const deviceId = await getSavedDeviceId();
  try {
    // Determine the command based on the current lock status
    const command = await fetchLockStatus(deviceId) ? UNLOCK_COMMAND : LOCK_COMMAND;
    // Send the command to the BLE device
    await sendCommandToDevice(deviceId, command);

    command === LOCK_COMMAND ? isLocked.value = true : isLocked.value = false;

    console.log('Lock status toggled');
    lastLockedTime.value = new Date().toLocaleString(); // Set to the current date and time when locked
    return true;
  } catch (error) {
    console.error('Error toggling lock status:', error);
    return false; // Return false on error
  }
}

// This method fetches the current lock status from the BLE device
// Assuming the status can be determined by reading a characteristic that returns either LOCK_COMMAND or UNLOCK_COMMAND
export async function fetchLockStatus(deviceId: string): Promise<boolean|null> {
  try {
    // Replace 'SERVICE_UUID' and 'CHARACTERISTIC_UUID' with your actual values
    const response = await BleClient.read(deviceId, BIKE_SERVICE, BIKE_LOCKED);

    const dataView = new DataView(response.buffer);
    // Assuming the first byte indicates lock status
    const status = dataView.getUint8(0);

    // Determine the lock status based on the response
    if (status === LOCK_COMMAND[0]) {
      console.log('Bike is locked');
      return true;
    } else if (status === UNLOCK_COMMAND[0]) {
      console.log('Bike is unlocked');
      return false;
    } else {
      console.log('Received unknown status:', status)
      return null; // Return null if status is unknown
    }
  } catch (error) {
    console.error('Error fetching lock status:', error);
    return null; // Return null on error
  }
}

export async function disconnectFromDevice(deviceId: string) {
  await BleClient.disconnect(deviceId);
  connectedDeviceId.value = '';
  connectionStatus.value = 'Disconnected';
}

export function onDisconnect(deviceId: string): void {
  console.log(`device ${deviceId} disconnected, attempting to reconnect...`);
  connectToDevice(deviceId);
}
