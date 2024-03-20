<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { autoConnectToSavedDevice } from './services/BleService';

onMounted(() => {
  autoConnectToSavedDevice();
  
});
</script>
