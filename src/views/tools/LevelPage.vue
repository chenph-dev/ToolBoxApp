<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>水平仪</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Spirit Level</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="level-container">
        <div class="level-display">
          <div class="level-circle">
            <div class="bubble" :style="bubbleStyle" :class="{ centered: isFlat }" />
            <div class="crosshair-h" />
            <div class="crosshair-v" />
            <div class="center-ring" />
          </div>
        </div>

        <div class="readings">
          <div class="reading-item">
            <span class="reading-label">X 轴</span>
            <span class="reading-value" :class="{ flat: Math.abs(tiltX) < 1 }">{{ tiltX.toFixed(1) }}°</span>
          </div>
          <div class="reading-item">
            <span class="reading-label">Y 轴</span>
            <span class="reading-value" :class="{ flat: Math.abs(tiltY) < 1 }">{{ tiltY.toFixed(1) }}°</span>
          </div>
        </div>

        <div class="status" :class="{ flat: isFlat }">
          {{ isFlat ? '✓ 水平' : '未水平' }}
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton
} from '@ionic/vue';
import { Motion } from '@capacitor/motion';

const tiltX = ref(0);
const tiltY = ref(0);
const FLAT_THRESHOLD = 1.5; // degrees

const isFlat = computed(() => Math.abs(tiltX.value) < FLAT_THRESHOLD && Math.abs(tiltY.value) < FLAT_THRESHOLD);

const bubbleStyle = computed(() => {
  // Map tilt to pixel offset, clamped to circle bounds
  const maxOffset = 90; // px from center
  const clamp = (v: number) => Math.max(-maxOffset, Math.min(maxOffset, v));
  const x = clamp(tiltX.value * 3);
  const y = clamp(tiltY.value * 3);
  return { transform: `translate(${x}px, ${y}px)` };
});

async function startWatching() {
  try {
    if ('DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const perm = await (DeviceMotionEvent as any).requestPermission();
      if (perm !== 'granted') return;
    }

    try {
      await Motion.addListener('accel', (event) => {
        const acc = event.accelerationIncludingGravity;
        if (acc) {
          // Convert acceleration to approximate tilt angle
          tiltX.value = Math.atan2(acc.x ?? 0, acc.z ?? 0) * (180 / Math.PI);
          tiltY.value = Math.atan2(acc.y ?? 0, acc.z ?? 0) * (180 / Math.PI);
        }
      });
    } catch {
      // Fallback to web API
      const handler = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity;
        if (acc) {
          tiltX.value = Math.atan2(acc.x ?? 0, acc.z ?? 0) * (180 / Math.PI);
          tiltY.value = Math.atan2(acc.y ?? 0, acc.z ?? 0) * (180 / Math.PI);
        }
      };
      window.addEventListener('devicemotion', handler);
      (window as any).__levelHandler = handler;
    }
  } catch { /* sensor unavailable */ }
}

function stopWatching() {
  Motion.removeAllListeners();
  if ((window as any).__levelHandler) {
    window.removeEventListener('devicemotion', (window as any).__levelHandler);
  }
}

onMounted(startWatching);
onUnmounted(stopWatching);
</script>

<style scoped>
.level-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; min-height: 70vh; justify-content: center; }
.level-display { position: relative; }
.level-circle { position: relative; width: 260px; height: 260px; border-radius: 50%; background: rgba(128,128,128,0.08); border: 2px solid var(--ion-color-medium); overflow: hidden; }
.bubble { position: absolute; top: 50%; left: 50%; width: 36px; height: 36px; margin: -18px 0 0 -18px; border-radius: 50%; background: var(--ion-color-danger); opacity: 0.85; transition: transform 0.08s linear; z-index: 2; }
.bubble.centered { background: var(--ion-color-success); }
.crosshair-h { position: absolute; top: 50%; left: 10%; right: 10%; height: 1px; background: var(--ion-color-medium); opacity: 0.4; }
.crosshair-v { position: absolute; left: 50%; top: 10%; bottom: 10%; width: 1px; background: var(--ion-color-medium); opacity: 0.4; }
.center-ring { position: absolute; top: 50%; left: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid var(--ion-color-medium); opacity: 0.5; }
.readings { display: flex; gap: 40px; }
.reading-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.reading-label { font-size: 0.85rem; color: var(--ion-color-medium); }
.reading-value { font-size: 1.5rem; font-weight: 700; font-family: 'Courier New', monospace; }
.reading-value.flat { color: var(--ion-color-success); }
.status { font-size: 1.2rem; font-weight: 600; color: var(--ion-color-medium); padding: 8px 24px; border-radius: 20px; background: rgba(128,128,128,0.1); }
.status.flat { color: var(--ion-color-success); background: rgba(16,185,129,0.1); }
</style>
