import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isDocumentPath,
  toMarkdownAssetPath,
  legacyBlogPageRedirect,
  wantsProblemJson,
} from './paths.ts'

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

  it('skips assets, feeds, sitemaps, and OpenAPI', () => {
    assert.equal(isDocumentPath('/rss.xml'), false)
    assert.equal(isDocumentPath('/_astro/chunk.js'), false)
    assert.equal(isDocumentPath('/static/images/avatar.png'), false)
    assert.equal(isDocumentPath('/sitemap-index.xml'), false)
    assert.equal(isDocumentPath('/openapi.json'), false)
    assert.equal(isDocumentPath('/llms.txt'), false)
    assert.equal(isDocumentPath('/llms-full.txt'), false)
  })
})

describe('legacyBlogPageRedirect', () => {
  it('maps the six retired pagination URLs only', () => {
    assert.equal(legacyBlogPageRedirect('/blog/2'), '/blog/')
    assert.equal(legacyBlogPageRedirect('/blog/2/'), '/blog/')
    assert.equal(legacyBlogPageRedirect('/blog/3'), '/blog/')
    assert.equal(legacyBlogPageRedirect('/blog/3/'), '/blog/')
    assert.equal(legacyBlogPageRedirect('/blog/2/index.md'), '/blog/index.md')
    assert.equal(legacyBlogPageRedirect('/blog/3/index.md'), '/blog/index.md')
  })

  it('does not capture post slugs', () => {
    assert.equal(legacyBlogPageRedirect('/blog/2-cool-post/'), null)
    assert.equal(legacyBlogPageRedirect('/blog/high-availability/'), null)
    assert.equal(legacyBlogPageRedirect('/blog/4/'), null)
  })
})

describe('wantsProblemJson', () => {
  it('is true for /api/ even without Accept', () => {
    assert.equal(wantsProblemJson('/api/unknown', null), true)
    assert.equal(wantsProblemJson('/api/', 'text/html'), true)
  })

  it('is true when Accept names JSON', () => {
    assert.equal(wantsProblemJson('/missing', 'application/json'), true)
    assert.equal(wantsProblemJson('/missing', 'application/problem+json'), true)
  })

  it('never treats /openapi.json as a problem-json request', () => {
    assert.equal(wantsProblemJson('/openapi.json', 'application/json'), false)
  })

  it('is false for ordinary HTML/Markdown Accept', () => {
    assert.equal(wantsProblemJson('/about/', 'text/html'), false)
    assert.equal(wantsProblemJson('/about/', 'text/markdown'), false)
  })

  it('honors q-values including explicit zeros', () => {
    assert.equal(
      wantsProblemJson('/missing', 'text/html;q=0, application/json'),
      true,
    )
    assert.equal(wantsProblemJson('/missing', 'application/json;q=0'), false)
    assert.equal(
      wantsProblemJson('/missing', 'application/problem+json;q=0'),
      false,
    )
    assert.equal(
      wantsProblemJson('/missing', 'text/html, application/json;q=0.1'),
      false,
    )
    assert.equal(
      wantsProblemJson('/missing', 'text/markdown;q=0, application/json'),
      true,
    )
  })

  it('treats vendor +json types with q>0 as JSON preference', () => {
    assert.equal(wantsProblemJson('/missing', 'application/vnd.api+json'), true)
    assert.equal(wantsProblemJson('/missing', 'application/ld+json;q=0'), false)
  })

  it('lets Markdown outrank JSON at equal or higher q', () => {
    assert.equal(
      wantsProblemJson('/missing', 'text/markdown, application/json'),
      false,
    )
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/markdown;q=0.9, application/json;q=0.5',
      ),
      false,
    )
  })

  it('lets JSON outrank Markdown when json q is strictly higher', () => {
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/markdown;q=0.5, application/json;q=0.9',
      ),
      true,
    )
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/markdown;q=0.2, application/problem+json;q=0.8',
      ),
      true,
    )
  })

  it('lets HTML or Markdown win ties with JSON', () => {
    assert.equal(
      wantsProblemJson('/missing', 'text/html;q=0.8, application/json;q=0.8'),
      false,
    )
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/markdown;q=0.8, application/json;q=0.8',
      ),
      false,
    )
  })

  it('compares JSON against the stronger of HTML and Markdown', () => {
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/html;q=0.2, text/markdown;q=0.9, application/json;q=0.5',
      ),
      false,
    )
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/html;q=0.1, text/markdown;q=0.2, application/vnd.api+json;q=0.9',
      ),
      true,
    )
  })

  it('lets text/* document ranges outrank JSON', () => {
    assert.equal(
      wantsProblemJson('/missing', 'text/*;q=0.9, application/json;q=0.5'),
      false,
    )
  })

  it('lets */* document ranges outrank JSON at equal or higher q', () => {
    assert.equal(
      wantsProblemJson('/missing', '*/*;q=1, application/json;q=0.5'),
      false,
    )
    assert.equal(
      wantsProblemJson('/missing', '*/*;q=0.5, application/json;q=0.5'),
      false,
    )
  })

  it('lets Markdown via text/* win when HTML is explicitly q=0', () => {
    assert.equal(
      wantsProblemJson(
        '/missing',
        'text/*;q=0.9, text/html;q=0, application/json;q=0.5',
      ),
      false,
    )
  })
})
