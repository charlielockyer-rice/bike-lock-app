import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import 'leaflet/dist/leaflet.css';


import { addIcons } from 'ionicons';
import { bicycle, lockClosed, lockOpen, settingsSharp } from 'ionicons/icons';

import initializePushNotifications from './services/pushNotificationService';

addIcons({
  'bicycle': bicycle,
  'lock-closed': lockClosed,
  'lock-open': lockOpen,
  'settings': settingsSharp
});

/* Theme variables */
import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

initializePushNotifications();
  
router.isReady().then(() => {
  app.mount('#app');
});