import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  appendVaryAccept,
  effectiveQuality,
  explicitlyPrefersHtml,
  preferredType,
  prefersMarkdown,
} from './accept.ts'

describe('preferredType', () => {
  it('defaults to HTML when Accept is missing', () => {
    assert.equal(preferredType(null), 'text/html')
    assert.equal(preferredType(''), 'text/html')
  })

  it('picks markdown when it is listed first at equal q', () => {
    assert.equal(
      preferredType('text/markdown, text/html, */*'),
      'text/markdown',
    )
  })

  it('honors q-values', () => {
    assert.equal(
      preferredType('text/html;q=0.8, text/markdown;q=0.9'),
      'text/markdown',
    )
    assert.equal(
      preferredType('text/markdown;q=0.2, text/html;q=0.9'),
      'text/html',
    )
  })

  it('compares q parameter names case-insensitively', () => {
    assert.equal(
      preferredType('text/markdown;Q=0.9, text/html;q=0.1'),
      'text/markdown',
    )
  })

  it('skips entries whose q is not a finite number', () => {
    assert.equal(
      preferredType('text/markdown;q=not-a-number, text/html'),
      'text/html',
    )
  })

  it('skips out-of-range and malformed q-values', () => {
    assert.equal(
      preferredType('text/markdown;q=2, text/html;q=0.9'),
      'text/html',
    )
    assert.equal(preferredType('text/markdown;q=-1'), 'text/html')
    assert.equal(
      preferredType('text/markdown;q=.5, text/html;q=0.9'),
      'text/html',
    )
  })

  it('lets a specific type override a wildcard regardless of q', () => {
    assert.equal(preferredType('text/html;q=0, */*;q=1'), 'text/markdown')
  })

  it('returns null when every produced type is rejected', () => {
    assert.equal(preferredType('text/html;q=0, text/markdown;q=0'), null)
  })
})

describe('effectiveQuality', () => {
  it('uses text/* for HTML and Markdown when no exact type is listed', () => {
    const header = 'text/*;q=0.9, application/json;q=0.5'
    assert.equal(effectiveQuality(header, 'text/html'), 0.9)
    assert.equal(effectiveQuality(header, 'text/markdown'), 0.9)
  })

  it('uses */* for document candidates', () => {
    const header = '*/*;q=1, application/json;q=0.5'
    assert.equal(effectiveQuality(header, 'text/html'), 1)
    assert.equal(effectiveQuality(header, 'text/markdown'), 1)
  })

  it('lets exact text/html;q=0 override text/* for HTML only', () => {
    const header = 'text/*;q=0.9, text/html;q=0, application/json;q=0.5'
    assert.equal(effectiveQuality(header, 'text/html'), 0)
    assert.equal(effectiveQuality(header, 'text/markdown'), 0.9)
  })
})

describe('appendVaryAccept', () => {
  it('sets Accept and Accept-Encoding', () => {
    const headers = new Headers()
    appendVaryAccept(headers)
    assert.equal(headers.get('Vary'), 'Accept, Accept-Encoding')
  })

  it('does not duplicate existing tokens', () => {
    const headers = new Headers({ Vary: 'Accept-Encoding, Accept' })
    appendVaryAccept(headers)
    assert.equal(headers.get('Vary'), 'Accept-Encoding, Accept')
  })
})

describe('prefersMarkdown / explicitlyPrefersHtml', () => {
  it('detects markdown Accept', () => {
    assert.equal(prefersMarkdown('text/markdown'), true)
    assert.equal(prefersMarkdown('text/html'), false)
  })

  it('detects an explicit HTML type, not a bare wildcard', () => {
    assert.equal(explicitlyPrefersHtml('text/html'), true)
    assert.equal(explicitlyPrefersHtml('*/*'), false)
    assert.equal(explicitlyPrefersHtml(null), false)
  })
})
