import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/tools/qr-scanner',
    component: () => import('@/views/tools/QRScannerPage.vue'),
  },
  {
    path: '/tools/flashlight',
    component: () => import('@/views/tools/FlashlightPage.vue'),
  },
  {
    path: '/tools/compass',
    component: () => import('@/views/tools/CompassPage.vue'),
  },
  {
    path: '/tools/level',
    component: () => import('@/views/tools/LevelPage.vue'),
  },
  {
    path: '/tools/noise-meter',
    component: () => import('@/views/tools/NoiseMeterPage.vue'),
  },
  {
    path: '/tools/screen-ruler',
    component: () => import('@/views/tools/ScreenRulerPage.vue'),
  },
  {
    path: '/tools/screen-brightness',
    component: () => import('@/views/tools/ScreenBrightnessPage.vue'),
  },
  {
    path: '/tools/device-info',
    component: () => import('@/views/tools/DeviceInfoPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
