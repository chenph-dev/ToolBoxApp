import { LengthUnit, WeightUnit, TemperatureUnit } from '@/types';

// Length Conversions (base: meters)
const LENGTH_TO_METERS: Record<LengthUnit, number> = {
  [LengthUnit.Meter]: 1,
  [LengthUnit.Kilometer]: 1000,
  [LengthUnit.Centimeter]: 0.01,
  [LengthUnit.Millimeter]: 0.001,
  [LengthUnit.Mile]: 1609.344,
  [LengthUnit.Foot]: 0.3048,
  [LengthUnit.Inch]: 0.0254
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  const inMeters = value * LENGTH_TO_METERS[from];
  return inMeters / LENGTH_TO_METERS[to];
}

// Weight Conversions (base: kilograms)
const WEIGHT_TO_KILOGRAMS: Record<WeightUnit, number> = {
  [WeightUnit.Kilogram]: 1,
  [WeightUnit.Gram]: 0.001,
  [WeightUnit.Pound]: 0.45359237,
  [WeightUnit.Ounce]: 0.028349523125
};

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  const inKilograms = value * WEIGHT_TO_KILOGRAMS[from];
  return inKilograms / WEIGHT_TO_KILOGRAMS[to];
}

// Temperature Conversions
export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  // First convert to Celsius as base
  let inCelsius: number;
  switch (from) {
    case TemperatureUnit.Celsius:
      inCelsius = value;
      break;
    case TemperatureUnit.Fahrenheit:
      inCelsius = (value - 32) * (5 / 9);
      break;
    case TemperatureUnit.Kelvin:
      inCelsius = value - 273.15;
      break;
  }

  // Then convert from Celsius to target
  switch (to) {
    case TemperatureUnit.Celsius:
      return inCelsius;
    case TemperatureUnit.Fahrenheit:
      return inCelsius * (9 / 5) + 32;
    case TemperatureUnit.Kelvin:
      return inCelsius + 273.15;
  }
}

export function formatConversionResult(value: number, decimals: number = 6): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(decimals).replace(/\.?0+$/, '');
}
