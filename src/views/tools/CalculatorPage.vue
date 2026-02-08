<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>计算器</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Calculator</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="calculator-container">
        <CalculatorDisplay :display="state.display" :history="state.history" />

        <div class="calculator-keypad">
          <CalculatorButton label="AC" :operation="Operation.Clear" type="function" @click="handleButtonClick" />
          <CalculatorButton label="+/-" :operation="Operation.Negate" type="function" @click="handleButtonClick" />
          <CalculatorButton label="%" :operation="Operation.Percent" type="function" @click="handleButtonClick" />
          <CalculatorButton label="÷" :operation="Operation.Divide" type="operator" @click="handleButtonClick" />

          <CalculatorButton label="7" @click="handleButtonClick" />
          <CalculatorButton label="8" @click="handleButtonClick" />
          <CalculatorButton label="9" @click="handleButtonClick" />
          <CalculatorButton label="×" :operation="Operation.Multiply" type="operator" @click="handleButtonClick" />

          <CalculatorButton label="4" @click="handleButtonClick" />
          <CalculatorButton label="5" @click="handleButtonClick" />
          <CalculatorButton label="6" @click="handleButtonClick" />
          <CalculatorButton label="-" :operation="Operation.Subtract" type="operator" @click="handleButtonClick" />

          <CalculatorButton label="1" @click="handleButtonClick" />
          <CalculatorButton label="2" @click="handleButtonClick" />
          <CalculatorButton label="3" @click="handleButtonClick" />
          <CalculatorButton label="+" :operation="Operation.Add" type="operator" @click="handleButtonClick" />

          <CalculatorButton label="0" type="zero" @click="handleButtonClick" />
          <CalculatorButton label="." :operation="Operation.Decimal" type="number" @click="handleButtonClick" />
          <CalculatorButton label="=" :operation="Operation.Equals" type="equals" @click="handleButtonClick" />
          <CalculatorButton label="DEL" :operation="Operation.Delete" type="function" @click="handleButtonClick" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue';
import CalculatorDisplay from '@/components/calculator/CalculatorDisplay.vue';
import CalculatorButton from '@/components/calculator/CalculatorButton.vue';
import { Operation } from '@/types';
import { calculate, createInitialCalculatorState } from '@/utils/calculator';

const state = reactive(createInitialCalculatorState());

function handleButtonClick(value: string | Operation) {
  const operation = value as Operation;
  const newState = calculate(state, operation);
  Object.assign(state, newState);
}
</script>

<style scoped>
.calculator-container {
  padding: 16px;
  max-width: 420px;
  margin: 0 auto;
}

.calculator-keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
</style>
