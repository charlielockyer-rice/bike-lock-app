<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <!-- Use a placeholder for now -->
        <ion-title>Bike Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Use placeholders for now and remove undefined 'device' references -->
      <p>Device ID: {{ deviceId }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { connectToDevice } from '@/services/BleService';

const route = useRoute();
console.log("Device ID received in BikeDetailView:", route.params.deviceId);
const deviceId = ref(route.params.deviceId as string); // Ensure deviceId is a string

onMounted(async () => {
  if (deviceId.value) {
    await connectToDevice(deviceId.value);
    // Placeholder for fetching device details once implemented
    // getDeviceDetails(deviceId.value);
  }
});
</script>
