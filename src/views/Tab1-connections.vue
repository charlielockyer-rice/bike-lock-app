<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>My Bike</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Button to start scanning for BLE devices -->
      <ion-button @click="startScan">Scan for Devices</ion-button>

      <!-- List of discovered devices -->
      <ion-list>
        <ion-item v-for="device in bleDevices" :key="device.deviceId">
          {{ device.name || 'Unknown Device' }}
          <!-- Pair button for each device -->
          <ion-button @click="pairDevice(device.deviceId)" slot="end">Pair</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem } from '@ionic/vue';
import { scanForDevices, initializeBle, pairDevice } from '@/services/BleService';
import { ref, onMounted } from 'vue';
import { BleDevice } from '@/types/BleDevice';

// Use the interface to type your ref
const bleDevices = ref<BleDevice[]>([]); // This now expects an array of BleDevice objects
const isScanning = ref(false);

const startScan = async () => {
  isScanning.value = true;
  const devices = await scanForDevices();
  // Ensure that the devices array is correctly typed or cast it to BleDevice[]
  bleDevices.value = devices as BleDevice[];
  isScanning.value = false;
};

onMounted(async () => {
  await initializeBle();
});
</script>@/services/BleService