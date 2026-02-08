import { describe, expect, test } from 'vitest'
import { encodeBase64, decodeBase64 } from '@/utils/base64-codec'

describe('base64-codec', () => {
  test('encodes ASCII text', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=')
  })

  test('decodes ASCII text', () => {
    expect(decodeBase64('SGVsbG8=')).toBe('Hello')
  })

  test('handles Unicode', () => {
    const input = '你好世界'
    expect(decodeBase64(encodeBase64(input))).toBe(input)
  })

  test('handles empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })
})
