import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/tools/calculator',
    component: () => import('@/views/tools/CalculatorPage.vue'),
  },
  {
    path: '/tools/unit-converter',
    component: () => import('@/views/tools/UnitConverterPage.vue'),
  },
  {
    path: '/tools/qrcode-generator',
    component: () => import('@/views/tools/QRCodeGeneratorPage.vue'),
  },
  {
    path: '/tools/json-formatter',
    component: () => import('@/views/tools/JsonFormatterPage.vue'),
  },
  {
    path: '/tools/base64-codec',
    component: () => import('@/views/tools/Base64CodecPage.vue'),
  },
  {
    path: '/tools/url-codec',
    component: () => import('@/views/tools/UrlCodecPage.vue'),
  },
  {
    path: '/tools/timestamp-converter',
    component: () => import('@/views/tools/TimestampConverterPage.vue'),
  },
  {
    path: '/tools/password-generator',
    component: () => import('@/views/tools/PasswordGeneratorPage.vue'),
  },
  {
    path: '/tools/color-picker',
    component: () => import('@/views/tools/ColorPickerPage.vue'),
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
    path: '/tools/device-info',
    component: () => import('@/views/tools/DeviceInfoPage.vue'),
  },
  {
    path: '/tools/screen-brightness',
    component: () => import('@/views/tools/ScreenBrightnessPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
