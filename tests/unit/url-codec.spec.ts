import { describe, expect, test } from 'vitest'
import { encodeURIComponentSafe, decodeURIComponentSafe, encodeURISafe, decodeURISafe } from '@/utils/url-codec'

describe('url-codec', () => {
  test('encodes component', () => {
    expect(encodeURIComponentSafe('hello world&foo=bar')).toBe('hello%20world%26foo%3Dbar')
  })

  test('decodes component', () => {
    expect(decodeURIComponentSafe('hello%20world%26foo%3Dbar')).toBe('hello world&foo=bar')
  })

  test('encodes full URI', () => {
    const uri = 'https://example.com/path?q=hello world'
    expect(encodeURISafe(uri)).toBe('https://example.com/path?q=hello%20world')
  })

  test('decodes full URI', () => {
    expect(decodeURISafe('https://example.com/path?q=hello%20world')).toBe('https://example.com/path?q=hello world')
  })
})
