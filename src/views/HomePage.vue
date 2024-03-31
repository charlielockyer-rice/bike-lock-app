<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet> <!-- This needs to be added -->
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/home/tab1">
          <ion-icon name="lock-closed"></ion-icon>
          <ion-label>Lock</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab2" href="/home/tab2">
          <ion-icon name="bicycle"></ion-icon>
          <ion-label>Bike</ion-label>
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

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>
