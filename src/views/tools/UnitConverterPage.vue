<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>单位转换</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Unit Converter</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="converter-container">
        <ion-segment v-model="selectedCategory" :scrollable="true" class="category-segment">
          <ion-segment-button value="length">
            <ion-label>长度</ion-label>
          </ion-segment-button>
          <ion-segment-button value="weight">
            <ion-label>重量</ion-label>
          </ion-segment-button>
          <ion-segment-button value="temperature">
            <ion-label>温度</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Length Converter -->
        <div v-if="selectedCategory === 'length'" class="converter-section">
          <ion-item-group>
            <ion-item>
              <ion-label position="floating">从</ion-label>
              <ion-input v-model="lengthInput" type="number" placeholder="输入数值" />
              <ion-select v-model="lengthFrom" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in lengthUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="none">
              <ion-label position="floating">到</ion-label>
              <ion-input :value="lengthResult" type="text" readonly class="result-input" />
              <ion-select v-model="lengthTo" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in lengthUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-item-group>
        </div>

        <!-- Weight Converter -->
        <div v-if="selectedCategory === 'weight'" class="converter-section">
          <ion-item-group>
            <ion-item>
              <ion-label position="floating">从</ion-label>
              <ion-input v-model="weightInput" type="number" placeholder="输入数值" />
              <ion-select v-model="weightFrom" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in weightUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="none">
              <ion-label position="floating">到</ion-label>
              <ion-input :value="weightResult" type="text" readonly class="result-input" />
              <ion-select v-model="weightTo" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in weightUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-item-group>
        </div>

        <!-- Temperature Converter -->
        <div v-if="selectedCategory === 'temperature'" class="converter-section">
          <ion-item-group>
            <ion-item>
              <ion-label position="floating">从</ion-label>
              <ion-input v-model="temperatureInput" type="number" placeholder="输入数值" />
              <ion-select v-model="temperatureFrom" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in temperatureUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item lines="none">
              <ion-label position="floating">到</ion-label>
              <ion-input :value="temperatureResult" type="text" readonly class="result-input" />
              <ion-select v-model="temperatureTo" interface="popover" slot="end" style="min-width: 120px;">
                <ion-select-option v-for="unit in temperatureUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-item-group>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonSegment, IonSegmentButton, IonLabel, IonItem, IonItemGroup, IonInput,
  IonSelect, IonSelectOption
} from '@ionic/vue';
import { LengthUnit, WeightUnit, TemperatureUnit } from '@/types';
import { convertLength, convertWeight, convertTemperature, formatConversionResult } from '@/utils/converters';

const selectedCategory = ref('length');

const lengthInput = ref('');
const lengthFrom = ref(LengthUnit.Meter);
const lengthTo = ref(LengthUnit.Kilometer);
const lengthResult = computed(() => {
  if (!lengthInput.value) return '';
  const value = parseFloat(lengthInput.value);
  return formatConversionResult(convertLength(value, lengthFrom.value, lengthTo.value));
});
const lengthUnits = [
  { value: LengthUnit.Meter, label: '米' },
  { value: LengthUnit.Kilometer, label: '千米' },
  { value: LengthUnit.Centimeter, label: '厘米' },
  { value: LengthUnit.Millimeter, label: '毫米' },
  { value: LengthUnit.Mile, label: '英里' },
  { value: LengthUnit.Foot, label: '英尺' },
  { value: LengthUnit.Inch, label: '英寸' }
];

const weightInput = ref('');
const weightFrom = ref(WeightUnit.Kilogram);
const weightTo = ref(WeightUnit.Gram);
const weightResult = computed(() => {
  if (!weightInput.value) return '';
  const value = parseFloat(weightInput.value);
  return formatConversionResult(convertWeight(value, weightFrom.value, weightTo.value));
});
const weightUnits = [
  { value: WeightUnit.Kilogram, label: '千克' },
  { value: WeightUnit.Gram, label: '克' },
  { value: WeightUnit.Pound, label: '磅' },
  { value: WeightUnit.Ounce, label: '盎司' }
];

const temperatureInput = ref('');
const temperatureFrom = ref(TemperatureUnit.Celsius);
const temperatureTo = ref(TemperatureUnit.Fahrenheit);
const temperatureResult = computed(() => {
  if (!temperatureInput.value) return '';
  const value = parseFloat(temperatureInput.value);
  return formatConversionResult(convertTemperature(value, temperatureFrom.value, temperatureTo.value));
});
const temperatureUnits = [
  { value: TemperatureUnit.Celsius, label: '摄氏度' },
  { value: TemperatureUnit.Fahrenheit, label: '华氏度' },
  { value: TemperatureUnit.Kelvin, label: '开尔文' }
];
</script>

<style scoped>
.converter-container {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}
.category-segment {
  margin-bottom: 24px;
}
.converter-section {
  margin-top: 16px;
}
.result-input {
  --background: rgba(128, 128, 128, 0.1);
}
</style>
