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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
