<template>
  <div class="calculator-display">
    <div class="history-entries" v-if="history.length > 0">
      <div v-for="(entry, index) in history" :key="index" class="history-entry">
        <span class="history-expression">{{ entry.expression }}</span>
        <span class="history-result">= {{ entry.result }}</span>
      </div>
    </div>
    <div class="current-display" :class="{ 'error': isError }">
      {{ display }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HistoryEntry } from '@/types';

interface Props {
  display: string;
  history: HistoryEntry[];
}

const props = defineProps<Props>();

const isError = computed(() => props.display === 'Error' || props.display === 'Infinity');
</script>

<style scoped>
.calculator-display {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 180px;
}

.history-entries {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.history-entry {
  font-size: 0.85rem;
  color: #888;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.history-expression {
  margin-right: 8px;
}

.history-result {
  color: #4ade80;
  font-weight: 500;
}

.current-display {
  font-size: 3rem;
  font-weight: 300;
  color: #fff;
  text-align: right;
  word-break: break-all;
  line-height: 1.2;
}

.current-display.error {
  color: #ef4444;
  font-size: 2rem;
}

@media (prefers-color-scheme: light) {
  .calculator-display {
    background: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .history-entry {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }

  .history-result {
    color: #16a34a;
  }

  .current-display {
    color: #1e1e1e;
  }

  .current-display.error {
    color: #dc2626;
  }
}
</style>
