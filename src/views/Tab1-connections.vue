<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">My Lock</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="lock-status">
        <p v-if="isConnected()">
          {{ isLocked ? 'Bike is currently locked.' : 'Bike is currently unlocked.' }}
        </p>
        <p v-else>
          Connecting to bike...
        </p>
        <p>Last locked: {{ lastLockedTime }}</p>
      </div>

      <div class="lock-button-container">
        <div class="lock-button" @click="toggleLock()" :disabled="!isConnected()" :class="{ 'connecting': !isConnected(), 'locked': isConnected() && isLocked, 'unlocked': isConnected() && !isLocked }">
          <transition name="icon-fade" mode="out-in">
            <i v-if="!isConnected()" key="connecting" class="fas fa-spinner fa-spin"></i>
            <i v-else-if="isConnected() && isLocked" key="locked" class="fas fa-lock"></i>
            <i v-else key="unlocked" class="fas fa-lock-open"></i>
          </transition>
        </div>
        <!-- Lock action text moved here, outside the .lock-button but still inside its container -->
        <p class="lock-action-text">{{ isConnected() ? (isLocked ? 'Tap to Unlock' : 'Tap to Lock') : '' }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonRefresher, IonRefresherContent } from '@ionic/vue';
import {
  devices,
  connectToDevice,
  getSavedDeviceId,
  isConnected,
  isConnectedToDevice,
  lastLockedTime,
  scanForDevices,
  selectAndConnectToDevice,
  initializeBle,
  isLocked,
  fetchLockStatus,
  toggleLock,
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

const openBikeDetail = (device: BleDevice) => {
  console.log('Opening bike detail for device:', device);
  const targetPath = `/home/tab1/bike/${device.deviceId}`;
  console.log('Navigating to:', targetPath);
  router.push(targetPath);
};

// Lifecycle hooks
onMounted(async () => {
  await initializeBle();
  
  const savedDeviceId = await getSavedDeviceId(); // Fetch the saved device ID if any
  if (savedDeviceId && isConnectedToDevice(savedDeviceId)) {
    const status = await fetchLockStatus(savedDeviceId); // Fetch the lock status
    if (status !== null) {
      isLocked.value = status; // Only assign if status is not null
    } else {
      // Handle the null case, maybe set a default or show an error
      console.error('Unable to fetch lock status');
      // isLocked.value could be set to a default or handled appropriately
    }
  }
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 2s linear infinite;
}

.lock-status {
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff; /* Adjust as needed */
}

.lock-button-container {
  text-align: center;
}

.lock-action-text {
  margin-top: 0.5rem; /* Adjust spacing as needed */
  font-size: 1.2rem;
  color: #ffffff; /* Adjust color as needed */
}

.lock-button {
  position: fixed;
  bottom: 5vh; /* Positioned at the bottom 10% of the viewport height */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Adjust horizontal positioning */
  width: 40vw; /* Width is 10% of the viewport width */
  height: 40vw; /* Height is the same as width to maintain a circle */
  border-radius: 50%; /* Rounded edges for the circle */
  background-color: #707070; /* Example: gray background */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20vw; /* Icon size responsive to viewport width */
  transition: background-color 0.3s, transform 0.3s; /* Include transform to smooth out the active scaling */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: Adds a subtle shadow for depth */
}

.lock-button:active {
  transform: scale(0.9); /* Slight shrink effect to simulate button press */
  transform: translateX(-50%) scale(0.9); /* Include translateX(-50%) to maintain horizontal position */
}

.lock-button.locked {
  background-color: #F44336; /* Example: red for locked state */
}

.lock-button.unlocked {
  background-color: #4CAF50; /* Example: green for unlocked state */
}

.lock-button i {
  display: block;
  /* transition: opacity 0.3s ease-in-out; */
}

.lock-button.connecting i,
.lock-button:active i {
  opacity: 0.5;
}

</style>
