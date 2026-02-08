<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>二维码生成</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">QR Code Generator</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="qrcode-container">
        <ion-item class="input-item">
          <ion-label position="floating" class="input-label">输入文本或网址</ion-label>
          <ion-textarea
            v-model="qrText"
            placeholder="https://example.com 或任意文本..."
            :rows="3"
            auto-grow
            class="qr-input"
          />
        </ion-item>

        <ion-item lines="none" class="size-item">
          <ion-label>二维码尺寸: {{ size }}px</ion-label>
          <ion-range v-model="size" :min="150" :max="400" :step="10" :snaps="true" class="size-slider" />
        </ion-item>

        <div class="qr-code-display" v-if="qrText">
          <div class="qr-code-wrapper" :style="{ width: size + 'px', height: size + 'px' }">
            <QRCodeVue :value="qrText" :size="size" level="M" render-as="svg" />
          </div>
        </div>

        <div v-else class="empty-state">
          <ion-icon :icon="qrCodeOutline" class="empty-icon" />
          <p class="empty-text">在上方输入文本以生成二维码</p>
        </div>
        <div class="action-buttons" v-if="qrText">
          <ion-button expand="block" fill="solid" color="primary" @click="downloadQRCode" :disabled="downloading">
            <ion-icon slot="start" :icon="downloadOutline" />
            {{ downloading ? '保存中...' : '保存为 PNG' }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonItem, IonLabel, IonTextarea, IonRange, IonButton, IonIcon, toastController
} from '@ionic/vue';
import { qrCodeOutline, downloadOutline } from 'ionicons/icons';
import QRCodeVue from 'qrcode.vue';

const qrText = ref('');
const size = ref(250);
const downloading = ref(false);

function downloadQRCode() {
  const qrElement = document.querySelector('.qr-code-wrapper canvas, .qr-code-wrapper svg') as HTMLElement;
  if (!qrElement) { showToast('未找到二维码'); return; }
  downloading.value = true;
  if (qrElement.tagName === 'CANVAS') {
    downloadCanvas(qrElement as HTMLCanvasElement);
  } else if (qrElement.tagName === 'svg') {
    svgToCanvas(qrElement as unknown as SVGElement);
  }
}

function svgToCanvas(svgElement: SVGElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { showToast('创建画布失败'); downloading.value = false; return; }
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  img.onload = () => {
    canvas.width = size.value; canvas.height = size.value;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, size.value, size.value);
    URL.revokeObjectURL(url);
    downloadCanvas(canvas);
  };
  img.onerror = () => { showToast('转换二维码失败'); downloading.value = false; };
  img.src = url;
}

function downloadCanvas(canvas: HTMLCanvasElement) {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('二维码已保存！');
  } catch { showToast('保存二维码失败'); }
  finally { downloading.value = false; }
}

async function showToast(message: string) {
  const toast = await toastController.create({ message, duration: 2000, position: 'bottom' });
  await toast.present();
}
</script>

<style scoped>
.qrcode-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
.input-item { margin-top: 16px; }
.input-label { font-weight: 500; }
.qr-input { --padding-start: 0; --padding-end: 0; }
.size-item { --padding-start: 0; --padding-end: 0; }
.size-slider { padding: 0 8px; }
.qr-code-display { display: flex; justify-content: center; align-items: center; min-height: 200px; background: rgba(128,128,128,0.1); border-radius: 12px; padding: 24px; }
.qr-code-wrapper { display: flex; justify-content: center; align-items: center; }
.qr-code-wrapper canvas, .qr-code-wrapper svg { max-width: 100%; height: auto; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; background: rgba(128,128,128,0.1); border-radius: 12px; color: rgba(128,128,128,0.6); }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-text { margin: 0; font-size: 0.9rem; text-align: center; }
.action-buttons { margin-top: 8px; }
.action-buttons ion-button { --border-radius: 12px; --padding-top: 16px; --padding-bottom: 16px; }
</style>
