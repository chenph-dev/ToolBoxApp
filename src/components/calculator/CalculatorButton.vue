<template>
  <button
    class="calc-button"
    :class="buttonClasses"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Operation } from '@/types';

interface Props {
  label: string;
  operation?: Operation;
  type?: 'number' | 'operator' | 'function' | 'equals' | 'zero';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'number'
});

const emit = defineEmits<{
  (e: 'click', operation: Operation | string): void;
}>();

const buttonClasses = computed(() => {
  return [
    `calc-button--${props.type}`
  ];
});

function onClick() {
  emit('click', props.operation || props.label);
}
</script>

<style scoped>
.calc-button {
  border: none;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 500;
  height: 72px;
  width: 100%;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.calc-button:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.calc-button--number {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.calc-button--operator {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.calc-button--function {
  background: rgba(200, 200, 200, 0.2);
  color: #a0a0a0;
  font-size: 1.2rem;
}

.calc-button--equals {
  background: #4ade80;
  color: #000;
}

.calc-button--zero {
  grid-column: span 2;
}

@media (prefers-color-scheme: light) {
  .calc-button--number {
    background: rgba(0, 0, 0, 0.05);
    color: #1e1e1e;
  }

  .calc-button--operator {
    background: rgba(255, 165, 0, 0.15);
    color: #f97316;
  }

  .calc-button--function {
    background: rgba(150, 150, 150, 0.15);
    color: #666;
  }

  .calc-button--equals {
    background: #22c55e;
  }
}
</style>
