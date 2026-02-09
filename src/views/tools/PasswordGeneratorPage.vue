<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>密码生成器</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="sharePw" :disabled="!password">
            <ion-icon slot="icon-only" :icon="shareOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Password Generator</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="pw-container">
        <!-- Generated Password -->
        <div class="password-display">
          <code class="password-text">{{ password || '点击生成' }}</code>
          <ion-button fill="clear" size="small" @click="copyPw" :disabled="!password">
            <ion-icon slot="icon-only" :icon="copyOutline" />
          </ion-button>
        </div>

        <!-- Strength Bar -->
        <div class="strength-bar" v-if="password">
          <div class="strength-fill" :style="{ width: strengthPercent + '%', background: sColor }" />
        </div>
        <div class="strength-label" v-if="password" :style="{ color: sColor }">{{ strengthLabel }}</div>

        <!-- Options -->
        <ion-list>
          <ion-item>
            <ion-label>长度: {{ options.length }}</ion-label>
            <ion-range v-model="options.length" :min="4" :max="64" :step="1" />
          </ion-item>
          <ion-item>
            <ion-label>大写字母 (A-Z)</ion-label>
            <ion-toggle v-model="options.uppercase" slot="end" />
          </ion-item>
          <ion-item>
            <ion-label>小写字母 (a-z)</ion-label>
            <ion-toggle v-model="options.lowercase" slot="end" />
          </ion-item>
          <ion-item>
            <ion-label>数字 (0-9)</ion-label>
            <ion-toggle v-model="options.numbers" slot="end" />
          </ion-item>
          <ion-item>
            <ion-label>特殊符号 (!@#$...)</ion-label>
            <ion-toggle v-model="options.symbols" slot="end" />
          </ion-item>
        </ion-list>

        <ion-button expand="block" fill="solid" color="primary" @click="generate" class="generate-btn">
          生成密码
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonLabel, IonItem, IonList, IonRange, IonToggle, IonButton, IonIcon, toastController
} from '@ionic/vue';
import { copyOutline, shareOutline } from 'ionicons/icons';
import { PasswordOptions } from '@/types';
import { generatePassword, evaluateStrength, strengthColor } from '@/utils/password-generator';
import { copyToClipboard } from '@/utils/clipboard';
import { shareContent } from '@/utils/share';

const password = ref('');
const options = reactive<PasswordOptions>({
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
});

const strength = computed(() => password.value ? evaluateStrength(password.value) : 'weak');
const sColor = computed(() => strengthColor(strength.value));
const strengthLabel = computed(() => {
  const labels = { weak: '弱', fair: '一般', good: '良好', strong: '强' };
  return labels[strength.value];
});
const strengthPercent = computed(() => {
  const map = { weak: 25, fair: 50, good: 75, strong: 100 };
  return map[strength.value];
});

function generate() {
  password.value = generatePassword(options);
}

async function copyPw() {
  try {
    await copyToClipboard(password.value);
    const toast = await toastController.create({ message: '已复制！', duration: 1500, position: 'bottom' });
    await toast.present();
  } catch { /* ignore */ }
}

async function sharePw() {
  if (!password.value) return;
  await shareContent({ title: '生成的密码', text: password.value });
}
</script>

<style scoped>
.pw-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.password-display { display: flex; align-items: center; justify-content: space-between; background: rgba(128,128,128,0.05); border-radius: 12px; padding: 16px; min-height: 56px; }
.password-text { font-family: 'Courier New', monospace; font-size: 1.1rem; word-break: break-all; flex: 1; }
.strength-bar { height: 6px; background: rgba(128,128,128,0.15); border-radius: 3px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 3px; transition: width 0.3s, background 0.3s; }
.strength-label { text-align: center; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
.generate-btn { --border-radius: 12px; --padding-top: 16px; --padding-bottom: 16px; margin-top: 8px; }
</style>
