<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>颜色选择器</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Color Picker</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="color-container">
        <!-- Color Preview -->
        <div class="color-preview" :style="{ background: hexValue }" />

        <!-- HEX Input -->
        <div class="section">
          <ion-label class="section-label">HEX</ion-label>
          <ion-item>
            <ion-input v-model="hexValue" placeholder="#000000" @ionBlur="onHexChange" />
          </ion-item>
        </div>

        <!-- RGB Sliders -->
        <div class="section">
          <ion-label class="section-label">RGB</ion-label>
          <ion-item lines="none">
            <ion-label>R: {{ rgb.r }}</ion-label>
            <ion-range v-model="rgb.r" :min="0" :max="255" color="danger" @ionChange="onRgbChange" />
          </ion-item>
          <ion-item lines="none">
            <ion-label>G: {{ rgb.g }}</ion-label>
            <ion-range v-model="rgb.g" :min="0" :max="255" color="success" @ionChange="onRgbChange" />
          </ion-item>
          <ion-item lines="none">
            <ion-label>B: {{ rgb.b }}</ion-label>
            <ion-range v-model="rgb.b" :min="0" :max="255" color="primary" @ionChange="onRgbChange" />
          </ion-item>
        </div>
        <!-- HSL Display -->
        <div class="section">
          <ion-label class="section-label">HSL</ion-label>
          <div class="hsl-display">hsl({{ hsl.h }}, {{ hsl.s }}%, {{ hsl.l }}%)</div>
        </div>

        <!-- Copy Buttons -->
        <div class="action-buttons">
          <ion-button expand="block" fill="solid" color="primary" @click="copyValue(hexValue)">
            复制 HEX
          </ion-button>
          <ion-button expand="block" fill="outline" color="secondary" @click="copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)">
            复制 RGB
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonLabel, IonItem, IonInput, IonRange, IonButton, toastController
} from '@ionic/vue';
import { hexToRgb, rgbToHex, rgbToHsl } from '@/utils/color-converter';
import { copyToClipboard } from '@/utils/clipboard';

const rgb = reactive({ r: 66, g: 133, b: 244 });
const hexValue = ref('#4285f4');

const hsl = computed(() => rgbToHsl(rgb.r, rgb.g, rgb.b));

function onRgbChange() {
  hexValue.value = rgbToHex(rgb.r, rgb.g, rgb.b);
}

function onHexChange() {
  const parsed = hexToRgb(hexValue.value);
  if (parsed) {
    rgb.r = parsed.r;
    rgb.g = parsed.g;
    rgb.b = parsed.b;
  }
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
.color-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.color-preview { height: 120px; border-radius: 12px; border: 1px solid rgba(128,128,128,0.2); }
.section { display: flex; flex-direction: column; gap: 4px; }
.section-label { font-weight: 600; font-size: 1rem; }
.hsl-display { font-family: 'Courier New', monospace; font-size: 0.95rem; padding: 10px 16px; background: rgba(128,128,128,0.05); border-radius: 8px; }
.action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.action-buttons ion-button { --border-radius: 12px; }
</style>
