<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>Change PIN</ion-label>
          <ion-input placeholder="Enter new PIN"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Enable Notifications</ion-label>
          <ion-toggle v-model="notificationsEnabled"></ion-toggle>
        </ion-item>

        <ion-item button @click="navigateToConnectedDevices()">
          <ion-label>Manage Connected Devices</ion-label>
        </ion-item>

        <ion-item @click="showClearDeviceIdOption = !showClearDeviceIdOption">
          <ion-label>Device ID</ion-label>
          <ion-label>{{ savedDeviceId }}</ion-label>
        </ion-item>
        <!-- Clear Device ID Option -->
        <ion-item v-if="showClearDeviceIdOption" button @click="clearSavedDeviceId">
          <ion-label color="danger">Clear Device ID</ion-label>
        </ion-item>

        <ion-item>
          <ion-label>Connection Status</ion-label>
          <ion-label>{{ connectionStatus }}</ion-label>
        </ion-item>

        <ion-item button @click="navigateToHelpAndSupport()">
          <ion-label>Help and Support</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
IonContent,
IonHeader,
IonList,
IonPage,
IonTitle,
IonToolbar,
IonItem,
IonLabel,
IonInput,
IonToggle,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { disconnectFromDevice, getSavedDeviceId, connectionStatus } from '@/services/BleService';
import { Preferences } from '@capacitor/preferences';

const notificationsEnabled = ref(true);
const savedDeviceId = ref('');
const showClearDeviceIdOption = ref(false);

onMounted(async () => {
  savedDeviceId.value = await getSavedDeviceId() || 'No device connected';
});

const clearSavedDeviceId = async () => {
  await disconnectFromDevice(savedDeviceId.value); // Disconnect from the device
  await Preferences.remove({ key: 'connectedDeviceId' });
  savedDeviceId.value = ''; // Update local state to reflect the cleared ID
  showClearDeviceIdOption.value = false; // Hide the clear option
};

const navigateToConnectedDevices = () => {
  console.log('Navigating to Manage Connected Devices');
  // Implement navigation logic here
};

const navigateToHelpAndSupport = () => {
  console.log('Navigating to Help and Support');
  // Implement navigation logic here
};
</script>
