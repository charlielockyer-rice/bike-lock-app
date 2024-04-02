<!-- Pull-to-refresh for scanning -->
<ion-refresher slot="fixed" @ionRefresh="!isScanning && startScan($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <!-- List of discovered devices -->
  <ion-list v-if="devices.length > 0">
    <ion-item v-for="device in devices" :key="device.deviceId" @click="isConnectedToDevice(device.deviceId) ? openBikeDetail(device) : selectAndConnectToDevice(device)">
      {{ device.name || 'Unknown Device' }} (RSSI: {{ device.rssi }})
      <ion-button slot="end">{{ isConnectedToDevice(device.deviceId) ? 'Connected' : 'Pair' }}</ion-button>
    </ion-item>
  </ion-list>

  <!-- Button at the bottom, visible when not scanning or no devices found -->
  <!-- <div v-if="!isScanning || devices.length === 0" class="scan-button-container">
    <ion-button @click="startScan" :disabled="isScanning" expand="block" size="large" class="ion-margin">
      {{ isScanning ? 'Scanning...' : 'Scan for Devices' }}
    </ion-button>
  </div> -->
<!-- 
<script lang="ts">
  const startScan = async (event: CustomEvent) => {
  isScanning.value = true;

  // Call the scanForDevices function which will update the bleDevices ref directly
  await scanForDevices();

  // After a delay, set isScanning to false to reflect that scanning has completed or stopped
  setTimeout(() => {
    isScanning.value = false;
    (event.target as HTMLIonRefresherElement).complete();
  }, 2000); // The delay here should match the scanning timeout
</script> -->