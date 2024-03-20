<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet> <!-- This needs to be added -->
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/home/tab1">
          <ion-icon name="bicycle"></ion-icon>
          <ion-label>Bikes</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab2" href="/home/tab2">
          <ion-icon name="lock-closed"></ion-icon>
          <ion-label>Lock</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/home/tab3">
          <ion-icon name="settings"></ion-icon>
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
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
  IonLabel,
  IonRouterOutlet
} from '@ionic/vue';

// import BikeListItem from '@/components/BikeListItem.vue';
import Tab1Component from '@/views/Tab1.vue';
import Tab2Component from '@/views/Tab2.vue';
import Tab3Component from '@/views/Tab3.vue';
// import { getBikes, Bike } from '@/data/bikes';
// import { ref } from 'vue';

// const bikes = ref<Bike[]>(getBikes());

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>
