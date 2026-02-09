<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>手电筒</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Flashlight</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="flashlight-container">
        <div class="torch-area" :class="{ active: isOn }">
          <div class="torch-circle" @click="toggle">
            <ion-icon :icon="isOn ? flashlight : flashlightOutline" class="torch-icon" />
          </div>
          <p class="torch-label">{{ isOn ? '已开启' : '点击开启' }}</p>
        </div>

        <div class="mode-section">
          <ion-segment v-model="mode" @ionChange="onModeChange">
            <ion-segment-button value="normal">
              <ion-label>常亮</ion-label>
            </ion-segment-button>
            <ion-segment-button value="sos">
              <ion-label>SOS</ion-label>
            </ion-segment-button>
            <ion-segment-button value="strobe">
              <ion-label>频闪</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <div class="speed-section" v-if="mode === 'strobe'">
          <ion-item lines="none">
            <ion-label>频率: {{ strobeSpeed }}ms</ion-label>
            <ion-range v-model="strobeSpeed" :min="50" :max="500" :step="50" />
          </ion-item>
        </div>

        <div class="unavailable" v-if="!available">
          <ion-icon :icon="warningOutline" class="warn-icon" />
          <p>当前设备不支持手电筒控制</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonIcon, IonSegment, IonSegmentButton, IonLabel, IonItem, IonRange
} from '@ionic/vue';
import { flashlight, flashlightOutline, warningOutline } from 'ionicons/icons';
import { Torch } from '@capawesome/capacitor-torch';

const isOn = ref(false);
const available = ref(true);
const mode = ref<'normal' | 'sos' | 'strobe'>('normal');
const strobeSpeed = ref(200);
let intervalId: ReturnType<typeof setInterval> | null = null;

// SOS pattern: 3 short, 3 long, 3 short (in ms)
const SOS_PATTERN = [
  200, 200, 200, 200, 200, 400,  // 3 short
  500, 200, 500, 200, 500, 400,  // 3 long
  200, 200, 200, 200, 200, 800,  // 3 short + pause
];

async function torchOn() {
  try { await Torch.enable(); isOn.value = true; } catch { available.value = false; }
}

async function torchOff() {
  try { await Torch.disable(); isOn.value = false; } catch { /* ignore */ }
}

async function toggle() {
  if (isOn.value) {
    stopPattern();
    await torchOff();
  } else {
    if (mode.value === 'normal') {
      await torchOn();
    } else if (mode.value === 'sos') {
      startSOS();
    } else {
      startStrobe();
    }
  }
}

function stopPattern() {
  if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
}

function startStrobe() {
  isOn.value = true;
  let on = false;
  intervalId = setInterval(async () => {
    on = !on;
    if (on) await torchOn(); else { try { await Torch.disable(); } catch { /* */ } }
  }, strobeSpeed.value);
}

function startSOS() {
  isOn.value = true;
  let step = 0;
  const runStep = async () => {
    if (!isOn.value) return;
    if (step % 2 === 0) {
      try { await Torch.enable(); } catch { /* */ }
    } else {
      try { await Torch.disable(); } catch { /* */ }
    }
    const delay = SOS_PATTERN[step % SOS_PATTERN.length];
    step++;
    intervalId = setTimeout(runStep, delay) as unknown as ReturnType<typeof setInterval>;
  };
  runStep();
}

function onModeChange() {
  if (isOn.value) {
    stopPattern();
    torchOff().then(() => {
      isOn.value = false;
    });
  }
}

onUnmounted(() => {
  stopPattern();
  torchOff();
});
</script>

<style scoped>
.flashlight-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.torch-area { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 40px; transition: all 0.3s; }
.torch-area.active { filter: drop-shadow(0 0 40px rgba(255, 214, 10, 0.6)); }
.torch-circle { width: 140px; height: 140px; border-radius: 50%; background: rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.3s, transform 0.15s; }
.torch-circle:active { transform: scale(0.95); }
.torch-area.active .torch-circle { background: var(--ion-color-warning); }
.torch-icon { font-size: 56px; color: var(--ion-color-medium); }
.torch-area.active .torch-icon { color: #fff; }
.torch-label { font-size: 1rem; color: var(--ion-color-medium); }
.mode-section { width: 100%; max-width: 400px; }
.speed-section { width: 100%; }
.unavailable { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--ion-color-danger); margin-top: 20px; }
.warn-icon { font-size: 32px; }
</style>