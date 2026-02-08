import { describe, expect, test } from 'vitest'
import { generatePassword, evaluateStrength, strengthColor } from '@/utils/password-generator'

describe('password-generator', () => {
  test('generates password of correct length', () => {
    const pw = generatePassword({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false })
    expect(pw.length).toBe(20)
  })

  test('respects character set options', () => {
    const pw = generatePassword({ length: 100, uppercase: false, lowercase: true, numbers: false, symbols: false })
    expect(pw).toMatch(/^[a-z]+$/)
  })

  test('evaluates weak password', () => {
    expect(evaluateStrength('abc')).toBe('weak')
  })

  test('evaluates strong password', () => {
    expect(evaluateStrength('Abc123!@#defGHI456')).toBe('strong')
  })

  test('strengthColor returns valid color', () => {
    expect(strengthColor('strong')).toBe('#4caf50')
    expect(strengthColor('weak')).toBe('#f44336')
  })
})
