import { Operation, CalculatorState, HistoryEntry } from '@/types';

const MAX_HISTORY = 10;

export function calculate(state: CalculatorState, nextOperation: Operation | string): CalculatorState {
  const { display, previousValue, operation: currentOperation, waitingForOperand, history } = state;

  // Handle Clear
  if (nextOperation === Operation.Clear) {
    return {
      ...state,
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false
    };
  }

  // Handle Delete
  if (nextOperation === Operation.Delete) {
    const newDisplay = display.length === 1 ? '0' : display.slice(0, -1);
    return { ...state, display: newDisplay };
  }

  // Handle Percent
  if (nextOperation === Operation.Percent) {
    const value = parseFloat(display);
    const result = value / 100;
    return { ...state, display: result.toString() };
  }

  // Handle Negate
  if (nextOperation === Operation.Negate) {
    const value = parseFloat(display);
    const result = value * -1;
    return { ...state, display: result.toString() };
  }

  // Handle Equals
  if (nextOperation === Operation.Equals && currentOperation && previousValue !== null) {
    const result = performOperation(previousValue, parseFloat(display), currentOperation);
    const newHistory = addToHistory(history, previousValue, currentOperation, parseFloat(display), result);
    return {
      ...state,
      display: formatResult(result),
      previousValue: null,
      operation: null,
      waitingForOperand: true,
      history: newHistory
    };
  }

  // Handle Operation buttons (+, -, ×, ÷)
  if (isOperator(nextOperation)) {
    if (previousValue !== null && currentOperation && !waitingForOperand) {
      const result = performOperation(previousValue, parseFloat(display), currentOperation);
      return {
        ...state,
        display: formatResult(result),
        previousValue: result,
        operation: nextOperation,
        waitingForOperand: true
      };
    }
    return {
      ...state,
      previousValue: parseFloat(display),
      operation: nextOperation,
      waitingForOperand: true
    };
  }

  // Handle Decimal
  if (nextOperation === Operation.Decimal) {
    if (waitingForOperand) {
      return { ...state, display: '0.', waitingForOperand: false };
    }
    if (display.includes('.')) {
      return state;
    }
    return { ...state, display: display + '.' };
  }

  // Handle Numbers
  if (isNumberOperation(nextOperation)) {
    if (waitingForOperand) {
      return { ...state, display: nextOperation, waitingForOperand: false };
    }
    if (display === '0' && nextOperation !== '0') {
      return { ...state, display: nextOperation };
    }
    if (display === '0' && nextOperation === '0') {
      return state;
    }
    if (display.length >= 12) {
      return state;
    }
    return { ...state, display: display + nextOperation };
  }

  return state;
}

function performOperation(a: number, b: number, operation: Operation): number {
  switch (operation) {
    case Operation.Add:
      return a + b;
    case Operation.Subtract:
      return a - b;
    case Operation.Multiply:
      return a * b;
    case Operation.Divide:
      if (b === 0) {
        return NaN;
      }
      return a / b;
    default:
      return b;
  }
}

function formatResult(result: number): string {
  if (Number.isNaN(result)) {
    return 'Error';
  }
  if (!Number.isFinite(result)) {
    return 'Infinity';
  }
  if (Number.isInteger(result)) {
    return result.toString();
  }
  const formatted = result.toFixed(10).replace(/\.?0+$/, '');
  return formatted;
}

function isOperator(op: string | Operation): op is Operation {
  return op === Operation.Add || op === Operation.Subtract || op === Operation.Multiply || op === Operation.Divide;
}

function isNumberOperation(value: string | Operation): value is string {
  return /^[0-9]$/.test(value as string);
}

function addToHistory(
  history: HistoryEntry[],
  a: number,
  op: Operation,
  b: number,
  result: number
): HistoryEntry[] {
  const entry: HistoryEntry = {
    expression: `${a} ${op} ${b}`,
    result: formatResult(result),
    timestamp: Date.now()
  };
  const newHistory = [entry, ...history];
  return newHistory.slice(0, MAX_HISTORY);
}

export function createInitialCalculatorState(): CalculatorState {
  return {
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
    history: []
  };
}
