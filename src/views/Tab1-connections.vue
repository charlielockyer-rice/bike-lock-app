<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>My Bike</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Button to start scanning for BLE devices -->
      <ion-button @click="startScan" :disabled="isScanning">
        {{ isScanning ? 'Scanning...' : 'Scan for Devices' }}
      </ion-button>

      <!-- List of discovered devices -->
      <ion-list>
        <ion-item v-for="device in devices" :key="device.deviceId" @click="isConnectedToDevice(device) ? openBikeDetail(device) : selectAndConnectToDevice(device)">
          {{ device.name || 'Unknown Device' }} (RSSI: {{ device.rssi }})
          <ion-button slot="end">{{ isConnectedToDevice(device) ? 'Connected' : 'Pair' }}</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem } from '@ionic/vue';
import {
  devices,
  connectToDevice,
  isConnectedToDevice,
  scanForDevices,
  selectAndConnectToDevice,
  initializeBle
} from '@/services/BleService';
import { ref, onMounted } from 'vue';
import { BleDevice } from '@/types/BleDevice';
import { useRouter } from 'vue-router';

// Use the interface to type your ref
const bleDevices = ref<BleDevice[]>([]);
const selectedDevice = ref<BleDevice | null>(null);
const isScanning = ref(false);

const startScan = async () => {
  isScanning.value = true;

  // Call the scanForDevices function which will update the bleDevices ref directly
  await scanForDevices();

  // After a delay, set isScanning to false to reflect that scanning has completed or stopped
  setTimeout(() => {
    isScanning.value = false;
  }, 3000); // The delay here should match the scanning timeout
};

const router = useRouter();

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