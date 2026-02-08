import { describe, expect, test } from 'vitest'
import { calculate, createInitialCalculatorState } from '@/utils/calculator'
import { Operation } from '@/types'

describe('calculator', () => {
  test('initial state has display 0', () => {
    const state = createInitialCalculatorState()
    expect(state.display).toBe('0')
  })

  test('addition works', () => {
    let state = createInitialCalculatorState()
    state = calculate(state, '2')
    state = calculate(state, Operation.Add)
    state = calculate(state, '3')
    state = calculate(state, Operation.Equals)
    expect(state.display).toBe('5')
  })

  test('clear resets display', () => {
    let state = createInitialCalculatorState()
    state = calculate(state, '5')
    state = calculate(state, Operation.Clear)
    expect(state.display).toBe('0')
  })
})
