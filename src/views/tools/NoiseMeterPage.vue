<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>噪音计</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Noise Meter</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="noise-container">
        <div class="meter-display">
          <div class="db-value" :style="{ color: levelColor }">{{ currentDb.toFixed(0) }}</div>
          <div class="db-unit">dB</div>
          <div class="level-label" :style="{ color: levelColor }">{{ levelLabel }}</div>
        </div>
        <div class="meter-bar-wrapper">
          <div class="meter-bar">
            <div class="meter-fill" :style="{ width: meterPercent + '%', background: levelColor }" />
          </div>
          <div class="meter-scale">
            <span>0</span><span>30</span><span>60</span><span>90</span><span>120</span>
          </div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">最小</span>
            <span class="stat-value">{{ minDb.toFixed(0) }} dB</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均</span>
            <span class="stat-value">{{ avgDb.toFixed(0) }} dB</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最大</span>
            <span class="stat-value">{{ maxDb.toFixed(0) }} dB</span>
          </div>
        </div>
        <ion-button v-if="!measuring" expand="block" @click="startMeasuring" class="action-btn">
          <ion-icon slot="start" :icon="micOutline" />
          开始测量
        </ion-button>
        <ion-button v-else expand="block" fill="outline" color="danger" @click="stopMeasuring" class="action-btn">
          停止测量
        </ion-button>
        <div v-if="error" class="error-area">
          <ion-icon :icon="warningOutline" class="error-icon" />
          <p>{{ error }}</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonIcon
} from '@ionic/vue';
import { micOutline, warningOutline } from 'ionicons/icons';

const measuring = ref(false);
const currentDb = ref(0);
const minDb = ref(120);
const maxDb = ref(0);
const error = ref('');
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let mediaStream: MediaStream | null = null;
let animFrameId: number | null = null;
let dbHistory: number[] = [];

const avgDb = computed(() => {
  if (dbHistory.length === 0) return 0;
  return dbHistory.reduce((a, b) => a + b, 0) / dbHistory.length;
});
const meterPercent = computed(() => Math.min(100, (currentDb.value / 120) * 100));
const levelLabel = computed(() => {
  const db = currentDb.value;
  if (db < 30) return '安静';
  if (db < 60) return '正常';
  if (db < 80) return '较吵';
  if (db < 100) return '很吵';
  return '危险';
});
const levelColor = computed(() => {
  const db = currentDb.value;
  if (db < 30) return '#10b981';
  if (db < 60) return '#3b82f6';
  if (db < 80) return '#f59e0b';
  if (db < 100) return '#f97316';
  return '#ef4444';
});

async function startMeasuring() {
  error.value = '';
  dbHistory = [];
  minDb.value = 120;
  maxDb.value = 0;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    measuring.value = true;
    measure();
  } catch { error.value = '需要麦克风权限'; }
}

function measure() {
  if (!analyser || !measuring.value) return;
  const data = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  const rms = Math.sqrt(sum / data.length);
  const db = Math.max(0, 20 * Math.log10(rms) + 94);
  currentDb.value = db;
  if (db < minDb.value) minDb.value = db;
  if (db > maxDb.value) maxDb.value = db;
  dbHistory.push(db);
  if (dbHistory.length > 300) dbHistory.shift();
  animFrameId = requestAnimationFrame(measure);
}

function stopMeasuring() {
  measuring.value = false;
  if (animFrameId !== null) cancelAnimationFrame(animFrameId);
  if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
  if (audioContext) { audioContext.close(); audioContext = null; }
  analyser = null;
}

onUnmounted(stopMeasuring);
</script>

<style scoped>
.noise-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.meter-display { text-align: center; margin-top: 24px; }
.db-value { font-size: 5rem; font-weight: 700; line-height: 1; font-family: 'Courier New', monospace; transition: color 0.3s; }
.db-unit { font-size: 1.5rem; color: var(--ion-color-medium); margin-top: -4px; }
.level-label { font-size: 1.2rem; font-weight: 600; margin-top: 8px; transition: color 0.3s; }
.meter-bar-wrapper { width: 100%; }
.meter-bar { height: 12px; background: rgba(128,128,128,0.15); border-radius: 6px; overflow: hidden; }
.meter-fill { height: 100%; border-radius: 6px; transition: width 0.1s, background 0.3s; }
.meter-scale { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--ion-color-medium); margin-top: 4px; }
.stats { display: flex; gap: 24px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stat-label { font-size: 0.8rem; color: var(--ion-color-medium); }
.stat-value { font-size: 1.1rem; font-weight: 600; font-family: 'Courier New', monospace; }
.action-btn { --border-radius: 12px; width: 100%; }
.error-area { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--ion-color-danger); }
.error-icon { font-size: 32px; }
</style>
