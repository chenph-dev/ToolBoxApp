import { describe, expect, test } from 'vitest'
import { formatJson } from '@/utils/json-formatter'

describe('json-formatter', () => {
  test('formats valid JSON in pretty mode', () => {
    const result = formatJson('{"a":1}', 'pretty')
    expect(result.error).toBeNull()
    expect(result.output).toBe('{\n  "a": 1\n}')
  })

  test('compacts valid JSON', () => {
    const result = formatJson('{ "a" : 1 }', 'compact')
    expect(result.error).toBeNull()
    expect(result.output).toBe('{"a":1}')
  })

  test('returns error for invalid JSON', () => {
    const result = formatJson('{invalid}', 'pretty')
    expect(result.error).toBeTruthy()
    expect(result.output).toBe('')
  })

  test('returns error for empty input', () => {
    const result = formatJson('', 'pretty')
    expect(result.error).toBe('Please enter JSON input')
  })
})
