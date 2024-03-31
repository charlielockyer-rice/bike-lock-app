<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">My Bike</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div id="mapid"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';

import { onMounted, ref } from 'vue';
import { geolocationService } from '@/services/geolocationService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure to import the Leaflet CSS

onMounted(async () => {
  const map = L.map('mapid').setView([29.72078, -95.401097], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  const position = await geolocationService.getCurrentPosition();

  // Adjusted icon paths
  const yourLocationIcon = L.icon({
    iconUrl: `/images/my-location.png`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  const deviceLocationIcon = L.icon({
    iconUrl: `/images/bike-location.png`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  L.marker([29.72078815, -95.401097533], { icon: deviceLocationIcon }).addTo(map)
    .bindPopup('My Bike')

  if (position) {
    console.log('Position:', position);
    map.setView([position.coords.latitude, position.coords.longitude], 13);
    map.invalidateSize();

    L.marker([position.coords.latitude, position.coords.longitude], { icon: yourLocationIcon }).addTo(map)
      .bindPopup('Current Location')
  }

  // Invalidate size after a slight delay to ensure container is rendered
  // setTimeout(() => map.invalidateSize(), 100);
});

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
