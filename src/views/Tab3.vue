<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Settings</ion-title>
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
import { ref } from 'vue';

const notificationsEnabled = ref(true);

// Placeholder functions for navigation
const navigateToConnectedDevices = () => {
  console.log('Navigating to Manage Connected Devices');
  // Implement navigation logic here
};

const navigateToHelpAndSupport = () => {
  console.log('Navigating to Help and Support');
  // Implement navigation logic here
};
</script>
