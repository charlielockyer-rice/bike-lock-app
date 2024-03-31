<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">My Lock</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">

      <!-- Pull-to-refresh for scanning -->
      <ion-refresher slot="fixed" @ionRefresh="!isScanning && startScan($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- List of discovered devices -->
      <ion-list v-if="devices.length > 0">
        <ion-item v-for="device in devices" :key="device.deviceId" @click="isConnectedToDevice(device) ? openBikeDetail(device) : selectAndConnectToDevice(device)">
          {{ device.name || 'Unknown Device' }} (RSSI: {{ device.rssi }})
          <ion-button slot="end">{{ isConnectedToDevice(device) ? 'Connected' : 'Pair' }}</ion-button>
        </ion-item>
      </ion-list>

      <!-- Button at the bottom, visible when not scanning or no devices found -->
      <!-- <div v-if="!isScanning || devices.length === 0" class="scan-button-container">
        <ion-button @click="startScan" :disabled="isScanning" expand="block" size="large" class="ion-margin">
          {{ isScanning ? 'Scanning...' : 'Scan for Devices' }}
        </ion-button>
      </div> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonRefresher, IonRefresherContent } from '@ionic/vue';
import {
  devices,
  connectToDevice,
  getSavedDeviceId,
  isConnectedToDevice,
  scanForDevices,
  selectAndConnectToDevice,
  initializeBle,
} from '@/services/BleService';
import { ref, onMounted } from 'vue';
import { BleDevice } from '@/types/BleDevice';
import { useRouter } from 'vue-router';

// Use the interface to type your ref
const bleDevices = ref<BleDevice[]>([]);
const selectedDevice = ref<BleDevice | null>(null);
const isScanning = ref(false);

// Instantiate the router
const router = useRouter();

const startScan = async (event: CustomEvent) => {
  isScanning.value = true;

  // Call the scanForDevices function which will update the bleDevices ref directly
  await scanForDevices();

  // After a delay, set isScanning to false to reflect that scanning has completed or stopped
  setTimeout(() => {
    isScanning.value = false;
    (event.target as HTMLIonRefresherElement).complete();
  }, 2000); // The delay here should match the scanning timeout
};

// const handleConnectionOrScan = async () => {
//   isScanning.value = true; // Optionally indicate scanning or connecting activity
  
//   const deviceId = await getSavedDeviceId();
//   if (deviceId) {
//     await autoConnectToSavedDevice().catch((error) => {
//       console.error("Error connecting to device:", error);
//       // Optionally handle connection error, like alerting the user
//     });
//   } else {
//     startScan(); // Assume this method initiates scanning and handles its own state
//   }

//   isScanning.value = false; // Reset scanning state if needed
// };

const openBikeDetail = (device: BleDevice) => {
  console.log('Opening bike detail for device:', device);
  const targetPath = `/home/tab1/bike/${device.deviceId}`;
  console.log('Navigating to:', targetPath);
  router.push(targetPath);
};

onMounted(async () => {
  await initializeBle();
});
</script>@/services/BleService

<style>
.scan-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* Or absolute, depending on your needs */
  left: 0;
  right: 0;
  bottom: 20px; /* Adjust this value based on desired distance from the bottom */
  padding: 0 10px; /* Ensures some padding on the sides */
}
</style>
