import { describe, expect, test } from 'vitest'
import { timestampToDate, dateToTimestamp, formatDate, nowTimestamp } from '@/utils/timestamp-converter'

describe('timestamp-converter', () => {
  test('converts timestamp to date', () => {
    const date = timestampToDate(0)
    expect(date.getTime()).toBe(0)
  })

  test('converts date to timestamp', () => {
    const date = new Date('2024-01-01T00:00:00Z')
    expect(dateToTimestamp(date)).toBe(1704067200)
  })

  test('formatDate returns expected format', () => {
    const date = new Date(2024, 0, 15, 10, 30, 45)
    const formatted = formatDate(date)
    expect(formatted).toMatch(/2024-01-15 10:30:45/)
  })

  test('nowTimestamp returns a number', () => {
    const ts = nowTimestamp()
    expect(typeof ts).toBe('number')
    expect(ts).toBeGreaterThan(0)
  })
})
