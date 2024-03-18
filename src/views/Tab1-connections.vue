<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>My Bike</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Button to start scanning for BLE devices -->
      <ion-button @click="initializeBle">Scan for Devices</ion-button>

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
import { devices as bleDevices, initializeBle, pairDevice } from '@/services/bleService';
</script>
