<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">My Lock</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
<!-- 
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Lock</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <!-- <ion-list>
        <BikeListItem v-for="bike in bikes" :key="bike.id" :bike="bike" />
      </ion-list> -->

      <div id="mapid"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue';

import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to import the Leaflet CSS

onMounted(() => {
  const map = L.map('mapid').setView([51.505, -0.09], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('Your Location')
    .openPopup();

  L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('BLE Device Location')
    .openPopup();

  // Invalidate size after a slight delay to ensure container is rendered
  setTimeout(() => map.invalidateSize(), 100);
});

import BikeListItem from '@/components/BikeListItem.vue';
// import { bicycle, lockClosed, settings } from 'ionicons/icons';
import { getBikes, Bike } from '@/data/bikes';

const bikes = ref<Bike[]>(getBikes());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>

<style>
  #mapid {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
</style>
