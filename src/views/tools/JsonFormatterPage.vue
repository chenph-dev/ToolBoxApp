<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>JSON 格式化</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="shareOutput" :disabled="!jsonOutput">
            <ion-icon slot="icon-only" :icon="shareOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">JSON Formatter</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="formatter-container">
        <!-- Input Section -->
        <div class="section">
          <ion-label class="section-label">输入 JSON</ion-label>
          <ion-textarea
            v-model="jsonInput"
            placeholder='{"key": "value"}'
            :rows="10"
            auto-grow
            class="json-textarea"
            @ionInput="handleFormat"
          />
          <div class="status-bar" :class="{ 'has-error': hasError }">
            <span v-if="hasError" class="error-text">
              <ion-icon :icon="alertCircleOutline" />
              {{ errorMessage }}
            </span>
            <span v-else-if="jsonInput" class="success-text">
              <ion-icon :icon="checkmarkCircleOutline" />
              Valid JSON
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button
            expand="block"
            fill="solid"
            color="primary"
            @click="formatJson"
            :disabled="!jsonInput.trim()"
          >
            <ion-icon slot="start" :icon="codeSlashOutline" />
            格式化
          </ion-button>
          <ion-button
            expand="block"
            fill="outline"
            color="secondary"
            @click="compressJson"
            :disabled="!jsonInput.trim()"
          >
            <ion-icon slot="start" :icon="contractOutline" />
            压缩
          </ion-button>
        </div>

        <!-- Output Section -->
        <div class="section" v-if="jsonOutput">
          <div class="output-header">
            <ion-label class="section-label">格式化结果</ion-label>
            <ion-button
              fill="clear"
              color="primary"
              @click="copyOutput"
              size="small"
            >
              <ion-icon slot="icon-only" :icon="copyOutline" />
            </ion-button>
          </div>
          <div class="json-output">
            <pre><code>{{ jsonOutput }}</code></pre>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="stats-section" v-if="jsonOutput">
          <div class="stat-item">
            <span class="stat-label">字符数:</span>
            <span class="stat-value">{{ jsonOutput.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">行数:</span>
            <span class="stat-value">{{ jsonOutput.split('\n').length }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
  toastController
} from '@ionic/vue';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  codeSlashOutline,
  contractOutline,
  copyOutline,
  shareOutline
} from 'ionicons/icons';
import { formatJson as formatJsonUtil } from '@/utils/json-formatter';
import { copyToClipboard } from '@/utils/clipboard';
import { shareContent } from '@/utils/share';

const jsonInput = ref('');
const jsonOutput = ref('');
const errorMessage = ref('');
const currentMode = ref<'pretty' | 'compact'>('pretty');

const hasError = computed(() => errorMessage.value.length > 0);

function formatJson() {
  currentMode.value = 'pretty';
  const result = formatJsonUtil(jsonInput.value, 'pretty');
  jsonOutput.value = result.output;
  errorMessage.value = result.error || '';

  if (result.error) {
    showToast(result.error);
  }
}

function compressJson() {
  currentMode.value = 'compact';
  const result = formatJsonUtil(jsonInput.value, 'compact');
  jsonOutput.value = result.output;
  errorMessage.value = result.error || '';

  if (result.error) {
    showToast(result.error);
  }
}

function handleFormat() {
  // Auto-validate on input (but don't format unless triggered)
  if (jsonInput.value.trim()) {
    try {
      JSON.parse(jsonInput.value);
      errorMessage.value = '';
    } catch (e) {
      errorMessage.value = (e as Error).message;
    }
  } else {
    errorMessage.value = '';
  }
}

async function copyOutput() {
  if (!jsonOutput.value) return;

  try {
    await copyToClipboard(jsonOutput.value);
    showToast('已复制到剪贴板！');
  } catch (error) {
    showToast('复制失败');
  }
}

async function showToast(message: string) {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: 'bottom'
  });
  await toast.present();
}

async function shareOutput() {
  if (!jsonOutput.value) return;
  await shareContent({ title: 'JSON', text: jsonOutput.value });
}
</script>

<style scoped>
.formatter-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-weight: 600;
  font-size: 1rem;
  color: var(--ion-text-color);
}

.json-textarea {
  --background: rgba(128, 128, 128, 0.05);
  --border-radius: 8px;
  --padding-start: 12px;
  --padding-end: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(76, 175, 80, 0.1);
}

.status-bar.has-error {
  background: rgba(244, 67, 54, 0.1);
}

.error-text {
  color: var(--ion-color-danger);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.success-text {
  color: var(--ion-color-success);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-buttons ion-button {
  --border-radius: 12px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.json-output {
  background: rgba(128, 128, 128, 0.05);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.json-output pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.stats-section {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: rgba(128, 128, 128, 0.05);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ion-text-color);
}

@media (max-width: 576px) {
  .action-buttons {
    grid-template-columns: 1fr;
  }

  .stats-section {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
