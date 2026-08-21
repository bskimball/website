import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isDocumentPath, toMarkdownAssetPath } from './paths.ts'

describe('toMarkdownAssetPath', () => {
  it('maps the homepage and trailing-slash pages', () => {
    assert.equal(toMarkdownAssetPath('/'), '/index.md')
    assert.equal(toMarkdownAssetPath('/about/'), '/about/index.md')
    assert.equal(
      toMarkdownAssetPath('/blog/high-availability/'),
      '/blog/high-availability/index.md',
    )
  })

  it('passes through existing .md paths', () => {
    assert.equal(toMarkdownAssetPath('/index.md'), '/index.md')
  })

  it('replaces .html with .md instead of treating html as a directory', () => {
    assert.equal(toMarkdownAssetPath('/index.html'), '/index.md')
    assert.equal(toMarkdownAssetPath('/about/index.html'), '/about/index.md')
    assert.equal(toMarkdownAssetPath('/page.html'), '/page.md')
  })
})

describe('isDocumentPath', () => {
  it('treats pages as documents', () => {
    assert.equal(isDocumentPath('/'), true)
    assert.equal(isDocumentPath('/blog/foo/'), true)
    assert.equal(isDocumentPath('/missing-path'), true)
  })

  it('skips assets, feeds, and sitemaps', () => {
    assert.equal(isDocumentPath('/rss.xml'), false)
    assert.equal(isDocumentPath('/_astro/chunk.js'), false)
    assert.equal(isDocumentPath('/static/images/avatar.png'), false)
    assert.equal(isDocumentPath('/sitemap-index.xml'), false)
  })
})
