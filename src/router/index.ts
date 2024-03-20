import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';

// Import your tab components
import Tab1 from '../views/Tab1-connections.vue';
import Tab2 from '../views/Tab2.vue';
import Tab3 from '../views/Tab3.vue';
import BikeDetailView from '@/views/BikeDetailView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: HomePage,
    children: [
      {
        path: '',
        redirect: '/home/tab1'
      },
      {
        path: 'tab1',
        component: Tab1,
        children: [
          {
            path: 'bike/:deviceId', // Child route for BikeDetailView under Tab1
            component: BikeDetailView,
            props: true
          }
        ]
      },
      {
        path: '/bike/:id',
        component: () => import('../views/ViewBikePage.vue')
      },
      {
        path: 'tab2',
        component: Tab2
      },
      {
        path: 'tab3',
        component: Tab3
      }
      // Add additional tabs as needed
    ]
  },
  // Your other routes...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
