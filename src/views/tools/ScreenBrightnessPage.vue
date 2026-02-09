<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>屏幕亮度</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Screen Brightness</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="brightness-container">
        <div class="brightness-display">
          <div class="brightness-icon">
            <ion-icon :icon="brightnessIcon" class="icon" />
          </div>
          <div class="brightness-value">{{ brightnessPercent }}%</div>
        </div>

        <div class="brightness-slider">
          <ion-range
            v-model="brightness"
            :min="0"
            :max="100"
            :step="1"
            snap-points="[0, 25, 50, 75, 100]"
            @ionChange="onBrightnessChange"
          />
        </div>

        <div class="brightness-presets">
          <ion-button @click="setPreset(25)" class="preset-btn">25%</ion-button>
          <ion-button @click="setPreset(50)" class="preset-btn">50%</ion-button>
          <ion-button @click="setPreset(75)" class="preset-btn">75%</ion-button>
          <ion-button @click="setPreset(100)" class="preset-btn">100%</ion-button>
        </div>

        <div class="auto-brightness">
          <ion-toggle
            v-model="autoBrightness"
            @ionChange="onAutoChange"
            label-placement="start"
          >
            自动调节
          </ion-toggle>
        </div>

        <div class="night-mode">
          <ion-toggle
            v-model="nightMode"
            @ionChange="onNightModeChange"
            label-placement="start"
          >
            夜间模式
          </ion-toggle>
        </div>

        <div class="info-section">
          <ion-item>
            <ion-label>当前模式</ion-label>
            <ion-note slot="end">{{ currentMode }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-label>设备支持</ion-label>
            <ion-note slot="end">{{ deviceSupport }}</ion-note>
          </ion-item>
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
import { ref, computed, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonRange, IonToggle, IonButton, IonItem, IonLabel, IonNote
} from '@ionic/vue';
import { warningOutline } from 'ionicons/icons';
import { StatusBar } from '@capacitor/status-bar';
import { setBrightness, getBrightness, setAutoBrightness, isAutoBrightness, isBrightnessAvailable } from '@/utils/screen-brightness';

const brightness = ref(50);
const autoBrightness = ref(false);
const nightMode = ref(false);
const error = ref('');
const supported = ref(true);

const brightnessPercent = computed(() => Math.round(brightness.value));
const brightnessIcon = computed(() => {
  const level = brightness.value;
  if (level < 25) return 'moon';
  if (level < 50) return 'partly-sunny';
  if (level < 75) return 'sunny';
  return 'sunny-outline';
});

const currentMode = computed(() => {
  if (autoBrightness.value) return '自动';
  if (nightMode.value) return '夜间';
  return '手动';
});

const deviceSupport = computed(() => {
  return supported.value ? '支持' : '不支持';
});

async function initialize() {
  try {
    const current = await getBrightness();
    brightness.value = Math.round(current * 100);

    const auto = await isAutoBrightness();
    autoBrightness.value = auto;

    // Check if device supports screen brightness control (using StatusBar as fallback)
    supported.value = await isBrightnessAvailable();
  } catch (e) {
    error.value = '无法获取屏幕亮度信息';
    supported.value = false;
  }
}

async function onBrightnessChange() {
  try {
    await setBrightness({ brightness: brightness.value / 100 });
    autoBrightness.value = false;
    nightMode.value = false;
  } catch (e) {
    error.value = '无法设置屏幕亮度';
    console.error('亮度设置失败:', e);
  }
}

async function onAutoChange() {
  try {
    await setAutoBrightness(autoBrightness.value);
    nightMode.value = false;
  } catch (e) {
    error.value = '无法设置自动亮度';
    autoBrightness.value = false;
    console.error('自动亮度设置失败:', e);
  }
}

async function onNightModeChange() {
  try {
    if (nightMode.value) {
      brightness.value = 20;
      await setBrightness({ brightness: 0.2 });
      autoBrightness.value = false;
    } else {
      await initialize();
    }
  } catch (e) {
    error.value = '无法设置夜间模式';
    nightMode.value = false;
    console.error('夜间模式设置失败:', e);
  }
}

async function setPreset(value: number) {
  brightness.value = value;
  await onBrightnessChange();
}

onMounted(initialize);
</script>

<style scoped>
.brightness-container { padding: 16px; max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
.brightness-display { text-align: center; margin-top: 40px; }
.brightness-icon { font-size: 4rem; color: var(--ion-color-warning); }
.icon { font-size: 5rem; }
.brightness-value { font-size: 2.5rem; font-weight: 700; margin-top: 8px; }
.brightness-slider { margin: 24px 0; }
.brightness-presets { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.preset-btn { --border-radius: 20px; min-width: 60px; }
.auto-brightness, .night-mode { padding: 16px; border-radius: 12px; background: rgba(128,128,128,0.1); }
ion-toggle { --color: var(--ion-color-primary); }
.info-section { margin-top: 24px; }
.error-area { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--ion-color-danger); margin-top: 20px; }
.error-icon { font-size: 32px; }
</style>