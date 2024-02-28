<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>My Bike</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
  
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">My Bike</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <ion-list>
          <BikeListItem v-for="bike in bikes" :key="bike.id" :bike="bike" />
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
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
  } from '@ionic/vue';
  
  import BikeListItem from '@/components/BikeListItem.vue';
  import { getBikes, Bike } from '@/data/bikes';
  import { ref } from 'vue';
  
  const bikes = ref<Bike[]>(getBikes());
  
  const refresh = (ev: CustomEvent) => {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  };
  </script>
  