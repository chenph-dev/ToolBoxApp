<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>时间戳转换</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Timestamp Converter</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ts-container">
        <!-- Live Clock -->
        <div class="live-clock">
          <div class="clock-label">当前 Unix 时间戳</div>
          <div class="clock-value">{{ currentTimestamp }}</div>
        </div>

        <!-- Timestamp to Date -->
        <div class="section">
          <ion-label class="section-label">时间戳转日期</ion-label>
          <ion-item>
            <ion-input
              v-model="tsInput"
              type="number"
              placeholder="输入 Unix 时间戳（秒）"
            />
          </ion-item>
          <ion-button expand="block" fill="solid" color="primary" @click="convertToDate" :disabled="!tsInput">
            转换为日期
          </ion-button>
          <div class="result-box" v-if="dateResult">
            <div class="result-row"><span class="result-label">本地:</span> {{ dateResult.local }}</div>
            <div class="result-row"><span class="result-label">UTC:</span> {{ dateResult.utc }}</div>
          </div>
        </div>
        <!-- Date to Timestamp -->
        <div class="section">
          <ion-label class="section-label">日期转时间戳</ion-label>
          <ion-item>
            <ion-input
              v-model="dateInput"
              type="datetime-local"
            />
          </ion-item>
          <ion-button expand="block" fill="outline" color="secondary" @click="convertToTimestamp" :disabled="!dateInput">
            转换为时间戳
          </ion-button>
          <div class="result-box" v-if="timestampResult !== null">
            <div class="result-row">
              <span class="result-label">Unix 时间戳:</span> {{ timestampResult }}
              <ion-button fill="clear" size="small" @click="copyValue(String(timestampResult))">
                <ion-icon slot="icon-only" :icon="copyOutline" />
              </ion-button>
            </div>
          </div>
        </div>

        <div class="error-box" v-if="error">{{ error }}</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonLabel, IonItem, IonInput, IonButton, IonIcon, toastController
} from '@ionic/vue';
import { copyOutline } from 'ionicons/icons';
import { timestampToDate, dateToTimestamp, formatDate, formatUTC, nowTimestamp } from '@/utils/timestamp-converter';
import { copyToClipboard } from '@/utils/clipboard';

const currentTimestamp = ref(nowTimestamp());
const tsInput = ref('');
const dateInput = ref('');
const dateResult = ref<{ local: string; utc: string } | null>(null);
const timestampResult = ref<number | null>(null);
const error = ref('');

let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => { currentTimestamp.value = nowTimestamp(); }, 1000);
});
onUnmounted(() => { clearInterval(timer); });

function convertToDate() {
  error.value = '';
  dateResult.value = null;
  const ts = parseInt(tsInput.value, 10);
  if (isNaN(ts)) { error.value = '无效的时间戳'; return; }
  const date = timestampToDate(ts);
  dateResult.value = { local: formatDate(date), utc: formatUTC(date) };
}

function convertToTimestamp() {
  error.value = '';
  timestampResult.value = null;
  const date = new Date(dateInput.value);
  if (isNaN(date.getTime())) { error.value = '无效的日期'; return; }
  timestampResult.value = dateToTimestamp(date);
}

async function copyValue(text: string) {
  try {
    await copyToClipboard(text);
    const toast = await toastController.create({ message: '已复制！', duration: 1500, position: 'bottom' });
    await toast.present();
  } catch { /* ignore */ }
}
</script>

<style scoped>
.ts-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.live-clock { text-align: center; padding: 20px; background: var(--ion-color-primary); color: #fff; border-radius: 12px; }
.clock-label { font-size: 0.85rem; opacity: 0.85; margin-bottom: 4px; }
.clock-value { font-size: 1.8rem; font-weight: 700; font-family: 'Courier New', monospace; }
.section { display: flex; flex-direction: column; gap: 10px; }
.section-label { font-weight: 600; font-size: 1rem; }
.section ion-button { --border-radius: 12px; }
.result-box { background: rgba(128,128,128,0.05); border-radius: 8px; padding: 12px 16px; }
.result-row { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; margin-bottom: 4px; }
.result-label { font-weight: 600; min-width: 50px; }
.error-box { background: rgba(244,67,54,0.1); color: var(--ion-color-danger); border-radius: 8px; padding: 12px 16px; font-size: 0.9rem; }
</style>
