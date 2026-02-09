<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>指南针</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Compass</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="compass-container">
        <div class="compass-wrapper">
          <div class="compass-ring" :style="{ transform: `rotate(${-heading}deg)` }">
            <div class="direction north">N</div>
            <div class="direction east">E</div>
            <div class="direction south">S</div>
            <div class="direction west">W</div>
            <div class="tick" v-for="i in 36" :key="i"
              :style="{ transform: `rotate(${i * 10}deg)` }"
              :class="{ major: i % 9 === 0 }" />
          </div>
          <div class="compass-needle" />
          <div class="compass-center">
            <span class="heading-value">{{ Math.round(heading) }}°</span>
            <span class="heading-dir">{{ directionLabel }}</span>
          </div>
        </div>

        <div v-if="error" class="error-area">
          <ion-icon :icon="warningOutline" class="error-icon" />
          <p>{{ error }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon
} from '@ionic/vue';
import { warningOutline } from 'ionicons/icons';
import { Motion } from '@capacitor/motion';

const heading = ref(0);
const error = ref('');
let watchId: string | null = null;

const directionLabel = computed(() => {
  const h = heading.value;
  if (h >= 337.5 || h < 22.5) return '北';
  if (h >= 22.5 && h < 67.5) return '东北';
  if (h >= 67.5 && h < 112.5) return '东';
  if (h >= 112.5 && h < 157.5) return '东南';
  if (h >= 157.5 && h < 202.5) return '南';
  if (h >= 202.5 && h < 247.5) return '西南';
  if (h >= 247.5 && h < 292.5) return '西';
  return '西北';
});

async function startWatching() {
  try {
    // Use DeviceOrientation API (works on web and native)
    if ('DeviceOrientationEvent' in window && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const perm = await (DeviceOrientationEvent as any).requestPermission();
      if (perm !== 'granted') { error.value = '需要传感器权限'; return; }
    }

    // Try Capacitor Motion plugin first
    try {
      watchId = await Motion.addListener('orientation', (event) => {
        if (event.alpha !== null && event.alpha !== undefined) {
          // alpha: 0-360, where 0 = north
          heading.value = 360 - (event.alpha as number);
        }
      }) as unknown as string;
    } catch {
      // Fallback to web DeviceOrientation
      const handler = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          heading.value = 360 - e.alpha;
        }
        // Use webkitCompassHeading if available (iOS)
        if ((e as any).webkitCompassHeading !== undefined) {
          heading.value = (e as any).webkitCompassHeading;
        }
      };
      window.addEventListener('deviceorientation', handler);
      watchId = 'web';
      (window as any).__compassHandler = handler;
    }
  } catch (e) {
    error.value = '无法访问方向传感器';
  }
}

function stopWatching() {
  if (watchId === 'web') {
    window.removeEventListener('deviceorientation', (window as any).__compassHandler);
  } else {
    Motion.removeAllListeners();
  }
  watchId = null;
}

onMounted(startWatching);
onUnmounted(stopWatching);
</script>

<style scoped>
.compass-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; }
.compass-wrapper { position: relative; width: 280px; height: 280px; }
.compass-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--ion-color-medium); transition: transform 0.1s ease-out; }
.direction { position: absolute; font-weight: 700; font-size: 1.1rem; color: var(--ion-color-medium); }
.direction.north { top: 8px; left: 50%; transform: translateX(-50%); color: var(--ion-color-danger); }
.direction.south { bottom: 8px; left: 50%; transform: translateX(-50%); }
.direction.east { right: 8px; top: 50%; transform: translateY(-50%); }
.direction.west { left: 8px; top: 50%; transform: translateY(-50%); }
.tick { position: absolute; top: 0; left: 50%; width: 1px; height: 12px; background: var(--ion-color-medium); transform-origin: 0 140px; }
.tick.major { height: 20px; width: 2px; background: var(--ion-text-color); }
.compass-needle { position: absolute; top: 20px; left: 50%; width: 3px; height: 100px; background: var(--ion-color-danger); transform: translateX(-50%); border-radius: 2px; z-index: 2; }
.compass-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 3; }
.heading-value { display: block; font-size: 2rem; font-weight: 700; }
.heading-dir { display: block; font-size: 1rem; color: var(--ion-color-medium); }
.error-area { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--ion-color-danger); margin-top: 20px; }
.error-icon { font-size: 32px; }
</style>
