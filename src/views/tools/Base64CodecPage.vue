<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Base64 编解码</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="shareOutput" :disabled="!output">
            <ion-icon slot="icon-only" :icon="shareOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Base64 Codec</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="codec-container">
        <div class="section">
          <ion-label class="section-label">输入</ion-label>
          <ion-textarea
            v-model="input"
            placeholder="输入文本进行编码，或输入 Base64 进行解码..."
            :rows="6"
            auto-grow
            class="codec-textarea"
          />
        </div>

        <div class="action-buttons">
          <ion-button expand="block" fill="solid" color="primary" @click="handleEncode" :disabled="!input.trim()">
            编码
          </ion-button>
          <ion-button expand="block" fill="outline" color="secondary" @click="handleDecode" :disabled="!input.trim()">
            解码
          </ion-button>
        </div>

        <div class="section" v-if="output || error">
          <div class="output-header">
            <ion-label class="section-label">输出</ion-label>
            <ion-button fill="clear" color="primary" @click="copyOutput" size="small" v-if="output">
              <ion-icon slot="icon-only" :icon="copyOutline" />
            </ion-button>
          </div>
          <div v-if="error" class="error-box">{{ error }}</div>
          <div v-else class="output-box">
            <pre><code>{{ output }}</code></pre>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonLabel, IonTextarea, IonButton, IonIcon, toastController
} from '@ionic/vue';
import { copyOutline, shareOutline } from 'ionicons/icons';
import { encodeBase64, decodeBase64 } from '@/utils/base64-codec';
import { copyToClipboard } from '@/utils/clipboard';
import { shareContent } from '@/utils/share';

const input = ref('');
const output = ref('');
const error = ref('');

function handleEncode() {
  error.value = '';
  try {
    output.value = encodeBase64(input.value);
  } catch (e) {
    error.value = (e as Error).message;
    output.value = '';
  }
}

function handleDecode() {
  error.value = '';
  try {
    output.value = decodeBase64(input.value.trim());
  } catch (e) {
    error.value = '无效的 Base64 输入';
    output.value = '';
  }
}

async function copyOutput() {
  try {
    await copyToClipboard(output.value);
    const toast = await toastController.create({ message: '已复制！', duration: 1500, position: 'bottom' });
    await toast.present();
  } catch { /* ignore */ }
}

async function shareOutput() {
  if (!output.value) return;
  await shareContent({ title: 'Base64', text: output.value });
}
</script>

<style scoped>
.codec-container { padding: 16px; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.section { display: flex; flex-direction: column; gap: 10px; }
.section-label { font-weight: 600; font-size: 1rem; }
.codec-textarea { --background: rgba(128,128,128,0.05); --border-radius: 8px; --padding-start: 12px; --padding-end: 12px; font-family: 'Courier New', monospace; font-size: 0.9rem; }
.action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.action-buttons ion-button { --border-radius: 12px; }
.output-header { display: flex; justify-content: space-between; align-items: center; }
.output-box { background: rgba(128,128,128,0.05); border-radius: 8px; padding: 16px; overflow-x: auto; max-height: 300px; overflow-y: auto; }
.output-box pre { margin: 0; font-family: 'Courier New', monospace; font-size: 0.9rem; white-space: pre-wrap; word-wrap: break-word; }
.error-box { background: rgba(244,67,54,0.1); color: var(--ion-color-danger); border-radius: 8px; padding: 12px 16px; font-size: 0.9rem; }
</style>
