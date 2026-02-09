<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>扫码识别</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">QR Scanner</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="scanner-container">
        <div v-if="!scanning && !result" class="start-area">
          <div class="scan-icon-wrapper">
            <ion-icon :icon="scanOutline" class="scan-icon" />
          </div>
          <p class="hint-text">点击下方按钮开始扫描</p>
          <ion-button expand="block" @click="startScan" class="scan-btn">
            <ion-icon slot="start" :icon="cameraOutline" />
            开始扫描
          </ion-button>
        </div>

        <div v-if="scanning" class="scanning-area">
          <p class="scanning-text">扫描中…请将二维码对准摄像头</p>
          <ion-button expand="block" fill="outline" color="danger" @click="stopScan">
            停止扫描
          </ion-button>
        </div>

        <div v-if="result" class="result-area">
          <ion-list>
            <ion-list-header><ion-label>扫描结果</ion-label></ion-list-header>
            <ion-item>
              <ion-label class="ion-text-wrap">
                <p class="result-text">{{ result }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <div class="result-actions">
            <ion-button expand="block" @click="copyResult">
              <ion-icon slot="start" :icon="copyOutline" />
              复制
            </ion-button>
            <ion-button expand="block" fill="outline" @click="shareResult">
              <ion-icon slot="start" :icon="shareOutline" />
              分享
            </ion-button>
            <ion-button v-if="isUrl" expand="block" fill="outline" color="secondary" @click="openUrl">
              <ion-icon slot="start" :icon="openOutline" />
              打开链接
            </ion-button>
            <ion-button expand="block" fill="clear" @click="reset">
              重新扫描
            </ion-button>
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
import { ref, computed, onUnmounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonIcon, IonList, IonListHeader, IonLabel, IonItem, toastController
} from '@ionic/vue';
import { scanOutline, cameraOutline, copyOutline, shareOutline, openOutline, warningOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Browser } from '@capacitor/browser';
import { copyToClipboard } from '@/utils/clipboard';
import { shareContent } from '@/utils/share';

const scanning = ref(false);
const result = ref('');
const error = ref('');

const isUrl = computed(() => {
  try { new URL(result.value); return true; } catch { return false; }
});

async function startScan() {
  error.value = '';
  result.value = '';
  try {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera === 'denied') {
      error.value = '需要相机权限才能扫描';
      return;
    }
    scanning.value = true;
    const { barcodes } = await BarcodeScanner.scan();
    scanning.value = false;
    if (barcodes.length > 0) {
      result.value = barcodes[0].rawValue || '';
    }
  } catch (e) {
    scanning.value = false;
    error.value = `扫描失败: ${e instanceof Error ? e.message : '未知错误'}`;
  }
}

async function stopScan() {
  try { await BarcodeScanner.stopScan(); } catch { /* */ }
  scanning.value = false;
}

async function copyResult() {
  await copyToClipboard(result.value);
  const toast = await toastController.create({ message: '已复制！', duration: 1500, position: 'bottom' });
  await toast.present();
}

async function shareResult() {
  await shareContent({ title: '扫描结果', text: result.value });
}

async function openUrl() {
  await Browser.open({ url: result.value });
}

function reset() {
  result.value = '';
  error.value = '';
}

onUnmounted(() => { if (scanning.value) stopScan(); });
</script>

<style scoped>
.scanner-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.start-area { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: 40px; }
.scan-icon-wrapper { width: 120px; height: 120px; border-radius: 24px; background: rgba(128,128,128,0.1); display: flex; align-items: center; justify-content: center; }
.scan-icon { font-size: 56px; color: var(--ion-color-primary); }
.hint-text { color: var(--ion-color-medium); font-size: 0.9rem; }
.scan-btn { --border-radius: 12px; width: 100%; }
.scanning-area { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-top: 40px; }
.scanning-text { color: var(--ion-color-medium); }
.result-area { margin-top: 16px; }
.result-text { font-family: 'Courier New', monospace; word-break: break-all; font-size: 1rem; }
.result-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.result-actions ion-button { --border-radius: 12px; }
.error-area { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--ion-color-danger); margin-top: 20px; }
.error-icon { font-size: 32px; }
</style>
