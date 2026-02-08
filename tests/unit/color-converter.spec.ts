import { describe, expect, test } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '@/utils/color-converter'

describe('color-converter', () => {
  test('hexToRgb parses valid hex', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 })
  })

  test('hexToRgb returns null for invalid hex', () => {
    expect(hexToRgb('xyz')).toBeNull()
    expect(hexToRgb('#gg0000')).toBeNull()
  })

  test('rgbToHex converts correctly', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
  })

  test('rgbToHsl converts red', () => {
    const hsl = rgbToHsl(255, 0, 0)
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)
    expect(hsl.l).toBe(50)
  })

  test('hslToRgb converts back', () => {
    const rgb = hslToRgb(0, 100, 50)
    expect(rgb.r).toBe(255)
    expect(rgb.g).toBe(0)
    expect(rgb.b).toBe(0)
  })

  test('roundtrip rgb -> hsl -> rgb', () => {
    const original = { r: 66, g: 133, b: 244 }
    const hsl = rgbToHsl(original.r, original.g, original.b)
    const back = hslToRgb(hsl.h, hsl.s, hsl.l)
    expect(Math.abs(back.r - original.r)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.g - original.g)).toBeLessThanOrEqual(2)
    expect(Math.abs(back.b - original.b)).toBeLessThanOrEqual(2)
  })
})
