<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>设备信息</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="shareInfo">
            <ion-icon slot="icon-only" :icon="shareOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Device Info</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="info-container">
        <ion-list v-for="section in sections" :key="section.title">
          <ion-list-header>
            <ion-label>{{ section.title }}</ion-label>
          </ion-list-header>
          <ion-item v-for="item in section.items" :key="item.label">
            <ion-label>
              <h3>{{ item.label }}</h3>
              <p>{{ item.value }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button expand="block" fill="outline" @click="refresh" class="refresh-btn">
          <ion-icon slot="start" :icon="refreshOutline" />
          刷新
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<!-- SCRIPT_SECTION -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonIcon, IonList, IonListHeader, IonLabel, IonItem
} from '@ionic/vue';
import { shareOutline, refreshOutline } from 'ionicons/icons';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { shareContent } from '@/utils/share';

interface InfoItem { label: string; value: string; }
interface InfoSection { title: string; items: InfoItem[]; }

const deviceItems = ref<InfoItem[]>([]);
const networkItems = ref<InfoItem[]>([]);
const screenItems = ref<InfoItem[]>([]);
const batteryItems = ref<InfoItem[]>([]);

const sections = computed<InfoSection[]>(() => {
  const s: InfoSection[] = [
    { title: '设备', items: deviceItems.value },
    { title: '网络', items: networkItems.value },
    { title: '屏幕', items: screenItems.value },
  ];
  if (batteryItems.value.length) s.push({ title: '电池', items: batteryItems.value });
  return s;
});

async function refresh() {
  try {
    const info = await Device.getInfo();
    deviceItems.value = [
      { label: '型号', value: info.model },
      { label: '平台', value: info.platform },
      { label: '操作系统', value: `${info.operatingSystem} ${info.osVersion}` },
      { label: '制造商', value: info.manufacturer },
      { label: '虚拟设备', value: info.isVirtual ? '是' : '否' },
      { label: 'WebView', value: info.webViewVersion || '未知' },
    ];
  } catch {
    deviceItems.value = [
      { label: '平台', value: navigator.platform },
      { label: 'User Agent', value: navigator.userAgent },
    ];
  }

  try {
    const net = await Network.getStatus();
    networkItems.value = [
      { label: '已连接', value: net.connected ? '是' : '否' },
      { label: '连接类型', value: net.connectionType },
    ];
  } catch {
    networkItems.value = [{ label: '在线', value: navigator.onLine ? '是' : '否' }];
  }

  screenItems.value = [
    { label: '分辨率', value: `${screen.width} × ${screen.height}` },
    { label: '设备像素比', value: `${window.devicePixelRatio}x` },
    { label: '色深', value: `${screen.colorDepth} bit` },
    { label: '方向', value: screen.orientation?.type || '未知' },
  ];

  try {
    const bat = await Device.getBatteryInfo();
    if (bat.batteryLevel !== undefined) {
      batteryItems.value = [
        { label: '电量', value: `${Math.round((bat.batteryLevel ?? 0) * 100)}%` },
        { label: '充电中', value: bat.isCharging ? '是' : '否' },
      ];
    }
  } catch { batteryItems.value = []; }
}

async function shareInfo() {
  const all = sections.value.flatMap(s =>
    [`\n[${s.title}]`, ...s.items.map(i => `${i.label}: ${i.value}`)]
  ).join('\n');
  await shareContent({ title: '设备信息', text: `设备信息\n${all}` });
}

onMounted(refresh);
</script>

<style scoped>
.info-container { padding: 16px; max-width: 600px; margin: 0 auto; }
.info-container ion-list { margin-bottom: 16px; }
.refresh-btn { --border-radius: 12px; margin-top: 16px; }
</style>
