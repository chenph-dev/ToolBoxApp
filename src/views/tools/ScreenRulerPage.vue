<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>屏幕尺子</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="false">
      <div class="ruler-container" ref="rulerRef"
        @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
        @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseEnd">

        <svg class="ruler-svg" :viewBox="`0 0 ${width} ${height}`">
          <!-- Ruler markings along top -->
          <template v-for="i in rulerTicks" :key="i">
            <line :x1="i.x" y1="0" :x2="i.x" :y2="i.major ? 24 : i.mid ? 16 : 10"
              stroke="var(--ion-color-medium)" :stroke-width="i.major ? 1.5 : 0.5" />
            <text v-if="i.major" :x="i.x" y="36" text-anchor="middle"
              fill="var(--ion-color-medium)" font-size="11">{{ i.label }}</text>
          </template>

          <!-- Measurement line -->
          <line v-if="measuring || measured" :x1="startX" :y1="startY" :x2="endX" :y2="endY"
            stroke="var(--ion-color-primary)" stroke-width="2" stroke-dasharray="6,3" />
          <circle v-if="measuring || measured" :cx="startX" :cy="startY" r="6"
            fill="var(--ion-color-primary)" />
          <circle v-if="measuring || measured" :cx="endX" :cy="endY" r="6"
            fill="var(--ion-color-primary)" />
        </svg>

        <div class="measurement-display" v-if="measured || measuring">
          <span class="measurement-value">{{ displayDistance }}</span>
        </div>

        <div class="hint" v-if="!measuring && !measured">
          拖动手指测量距离
        </div>

        <div class="unit-selector">
          <ion-segment v-model="unit" size="small">
            <ion-segment-button value="mm"><ion-label>mm</ion-label></ion-segment-button>
            <ion-segment-button value="cm"><ion-label>cm</ion-label></ion-segment-button>
            <ion-segment-button value="in"><ion-label>in</ion-label></ion-segment-button>
          </ion-segment>
        </div>

        <ion-button v-if="measured" fill="clear" class="reset-btn" @click="reset">
          重新测量
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/vue';

const rulerRef = ref<HTMLElement | null>(null);
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const unit = ref<'mm' | 'cm' | 'in'>('cm');
const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const endY = ref(0);
const measuring = ref(false);
const measured = ref(false);

const ppi = computed(() => 160);

const pixelDistance = computed(() => {
  const dx = endX.value - startX.value;
  const dy = endY.value - startY.value;
  return Math.sqrt(dx * dx + dy * dy);
});

const realDistanceMm = computed(() => (pixelDistance.value / ppi.value) * 25.4);

const displayDistance = computed(() => {
  const mm = realDistanceMm.value;
  if (unit.value === 'mm') return `${mm.toFixed(1)} mm`;
  if (unit.value === 'cm') return `${(mm / 10).toFixed(2)} cm`;
  return `${(mm / 25.4).toFixed(2)} in`;
});

const rulerTicks = computed(() => {
  const ticks: { x: number; major: boolean; mid: boolean; label?: string }[] = [];
  const pxPerMm = ppi.value / 25.4;
  for (let mm = 0; mm * pxPerMm < width.value; mm++) {
    const x = mm * pxPerMm;
    const major = mm % 10 === 0;
    const mid = mm % 5 === 0 && !major;
    ticks.push({ x, major, mid, label: major ? `${mm / 10}` : undefined });
  }
  return ticks;
});

function getPos(e: TouchEvent | MouseEvent) {
  if ('touches' in e && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
}
function onTouchStart(e: TouchEvent) { start(getPos(e)); }
function onMouseDown(e: MouseEvent) { start(getPos(e)); }
function start(pos: { x: number; y: number }) {
  startX.value = pos.x; startY.value = pos.y;
  endX.value = pos.x; endY.value = pos.y;
  measuring.value = true; measured.value = false;
}
function onTouchMove(e: TouchEvent) { move(getPos(e)); }
function onMouseMove(e: MouseEvent) { if (measuring.value) move(getPos(e)); }
function move(pos: { x: number; y: number }) { if (!measuring.value) return; endX.value = pos.x; endY.value = pos.y; }
function onTouchEnd() { end(); }
function onMouseEnd() { end(); }
function end() { if (measuring.value) { measuring.value = false; measured.value = true; } }
function reset() { measured.value = false; }

onMounted(() => { width.value = window.innerWidth; height.value = window.innerHeight; });
</script>

<style scoped>
.ruler-container { position: relative; width: 100%; height: 100%; touch-action: none; user-select: none; overflow: hidden; }
.ruler-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.measurement-display { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: #fff; padding: 12px 24px; border-radius: 12px; pointer-events: none; }
.measurement-value { font-size: 1.5rem; font-weight: 700; font-family: 'Courier New', monospace; }
.hint { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--ion-color-medium); font-size: 1rem; pointer-events: none; }
.unit-selector { position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 200px; }
.reset-btn { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); }
</style>
