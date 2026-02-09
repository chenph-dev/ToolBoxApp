// Calculator Types
export enum Operation {
  Add = '+',
  Subtract = '-',
  Multiply = '×',
  Divide = '÷',
  Equals = '=',
  Clear = 'AC',
  Delete = 'DEL',
  Percent = '%',
  Decimal = '.',
  Negate = '+/-'
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: Operation | null;
  waitingForOperand: boolean;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

// Unit Converter Types
export enum LengthUnit {
  Meter = 'm',
  Kilometer = 'km',
  Centimeter = 'cm',
  Millimeter = 'mm',
  Mile = 'mi',
  Foot = 'ft',
  Inch = 'in'
}

export enum WeightUnit {
  Kilogram = 'kg',
  Gram = 'g',
  Pound = 'lb',
  Ounce = 'oz'
}

export enum TemperatureUnit {
  Celsius = 'C',
  Fahrenheit = 'F',
  Kelvin = 'K'
}

// JSON Formatter Types
export type JsonFormatMode = 'pretty' | 'compact';

// Password Generator Types
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

// Compass Types
export interface CompassData {
  heading: number;
  accuracy: number | null;
}

// Spirit Level Types
export interface LevelData {
  x: number; // tilt left-right (-1 to 1)
  y: number; // tilt front-back (-1 to 1)
  isFlat: boolean;
}

// Noise Meter Types
export interface NoiseMeterData {
  decibels: number;
  peak: number;
  level: NoiseLevel;
}

export type NoiseLevel = 'quiet' | 'moderate' | 'loud' | 'very-loud' | 'dangerous';

// Device Info Types
export interface DeviceInfoData {
  model: string;
  platform: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  memUsed: number | null;
  diskFree: number | null;
  diskTotal: number | null;
  batteryLevel: number | null;
  isCharging: boolean | null;
  networkType: string;
  isConnected: boolean;
}

// Screen Ruler Types
export interface RulerMeasurement {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pixelDistance: number;
  realDistance: number; // in mm
  unit: 'mm' | 'cm' | 'in';
}
