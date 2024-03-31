<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title size="large">My Lock</ion-title>
            </ion-toolbar>
        </ion-header>

        <div id="map" ref="mapRef" style="width: 100%; height: 100%;"></div>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GoogleMap } from '@capacitor/google-maps';

const mapRef = ref<HTMLElement | null>(null);

onMounted(async () => {
    if (mapRef.value) {
        const map = await GoogleMap.create({
            id: 'my-map',
            element: mapRef.value,
            apiKey: 'AIzaSyChIaDg0iVAdDUkB0tbcb64Sbcq5_n7G0c', // Please ensure you hide your API key when sharing code publicly
            config: {
                center: {
                    lat: 51.505,
                    lng: -0.09,
                },
                zoom: 8,
            },
        });

        // Add a marker for your location
        await map.addMarker({
            coordinate: {
                lat: 51.5,
                lng: -0.09,
            },
            title: 'Your Location',
        });

        // Add a marker for the BLE device location
        // Replace the coordinates with those from your BLE device
        await map.addMarker({
            coordinate: {
                lat: 51.505,
                lng: -0.09,
            },
            title: 'BLE Device Location',
        });
    }
});
</script>

<style>
/* Ensure that ion-page is set to fill the entire screen, so map can fill it */
ion-page {
    height: 100%;
}
</style>
