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
