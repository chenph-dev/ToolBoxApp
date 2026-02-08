<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>工具箱</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">ToolBox</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="home-container">
        <div class="category-section">
          <h2 class="category-title">日常工具</h2>
          <div class="tools-grid">
            <div
              v-for="tool in dailyTools"
              :key="tool.id"
              class="tool-card"
              @click="router.push(tool.route)"
            >
              <ion-icon :icon="tool.icon" class="tool-icon" />
              <div class="tool-info">
                <span class="tool-name">{{ tool.name }}</span>
                <span class="tool-desc">{{ tool.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="category-section">
          <h2 class="category-title">开发工具</h2>
          <div class="tools-grid">
            <div
              v-for="tool in devTools"
              :key="tool.id"
              class="tool-card"
              @click="router.push(tool.route)"
            >
              <ion-icon :icon="tool.icon" class="tool-icon" />
              <div class="tool-info">
                <span class="tool-name">{{ tool.name }}</span>
                <span class="tool-desc">{{ tool.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { getToolsByCategory } from '@/data/tools';

const router = useRouter();
const dailyTools = getToolsByCategory('daily');
const devTools = getToolsByCategory('dev');
</script>

<style scoped>
.home-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.category-section {
  margin-bottom: 24px;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ion-color-medium);
  margin: 0 0 12px 4px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  border-radius: 12px;
  background: var(--ion-card-background, var(--ion-item-background, #fff));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  text-align: center;
}

.tool-card:active {
  transform: scale(0.97);
}

.tool-icon {
  font-size: 32px;
  color: var(--ion-color-primary);
}

.tool-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.tool-desc {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
}

@media (prefers-color-scheme: dark) {
  .tool-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}
</style>
