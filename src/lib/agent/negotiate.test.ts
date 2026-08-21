import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { handleAgentRequest } from './negotiate.ts'

const ORIGIN = 'https://brian-kimball.com'

function html404(): Response {
  return new Response('<html><h1>Signal Lost</h1></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function html200(body = '<html><h1>Brian Kimball</h1></html>'): Response {
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

async function run(options: {
  path: string
  accept?: string
  method?: string
  assets?: Record<string, string>
  next?: () => Promise<Response>
}) {
  const url = new URL(options.path, ORIGIN)
  const headers = new Headers()
  if (options.accept) headers.set('Accept', options.accept)
  const request = new Request(url, {
    method: options.method ?? 'GET',
    headers,
  })
  const assets = options.assets ?? {}

  return handleAgentRequest({
    request,
    next: options.next ?? (async () => html200()),
    fetchAsset: async (assetRequest) => {
      const assetUrl = new URL(assetRequest.url)
      const body = assets[assetUrl.pathname]
      if (body == null) return new Response('missing', { status: 404 })
      return new Response(body, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    },
  })
}

describe('handleAgentRequest', () => {
  it('serves markdown with Vary: Accept for Accept: text/markdown', async () => {
    const response = await run({
      path: '/',
      accept: 'text/markdown',
      assets: { '/index.md': '# Brian Kimball\n' },
    })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/markdown/)
    assert.match(response.headers.get('Vary') ?? '', /Accept/i)
    assert.match(await response.text(), /Brian Kimball/)
  })

  it('keeps HTML for browsers and still sets Vary: Accept', async () => {
    const response = await run({
      path: '/',
      accept: 'text/html',
    })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
    assert.match(response.headers.get('Vary') ?? '', /Accept/i)
    assert.match(await response.text(), /<h1>Brian Kimball<\/h1>/)
  })

  it('returns HTTP 404 markdown with recovery links for unknown paths', async () => {
    const response = await run({
      path: '/some-path-that-does-not-exist',
      accept: 'text/markdown',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/markdown/)
    const body = await response.text()
    assert.match(body, /llms\.txt/)
    assert.match(body, /sitemap-index\.xml/)
    assert.match(body, /developer/)
  })

  it('maps trailing-slash missing pages to markdown 404s', async () => {
    const response = await run({
      path: '/missing-page/',
      accept: 'text/markdown',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/markdown/)
  })

  it('returns markdown 404 for generic Accept so agents can recover', async () => {
    const response = await run({
      path: '/missing',
      accept: '*/*',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/markdown/)
    assert.match(await response.text(), /Not Found/)
  })

  it('keeps the HTML 404 when the client asks for HTML', async () => {
    const response = await run({
      path: '/missing',
      accept: 'text/html',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
    assert.match(await response.text(), /Signal Lost/)
  })

  it('returns 406 with no-store when every produced type is rejected', async () => {
    const response = await run({
      path: '/',
      accept: 'text/html;q=0, text/markdown;q=0',
    })
    assert.equal(response.status, 406)
    assert.match(response.headers.get('Vary') ?? '', /Accept/i)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    const rejectedBody = await response.text()
    assert.match(rejectedBody, /text\/html/)
    assert.match(rejectedBody, /text\/markdown/)
  })

  it('preserves 301 from next() when markdown asset is missing', async () => {
    const response = await run({
      path: '/blog/first-post/',
      accept: 'text/markdown',
      next: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: '/blog/custom-pi-agent-workflow/' },
        }),
    })
    assert.equal(response.status, 301)
    assert.equal(
      response.headers.get('Location'),
      '/blog/custom-pi-agent-workflow/',
    )
    assert.match(response.headers.get('Vary') ?? '', /Accept/i)
  })

  it('returns 406 when HTML exists but markdown asset is missing', async () => {
    const response = await run({
      path: '/blog/only-html/',
      accept: 'text/markdown',
      next: async () => html200(),
    })
    assert.equal(response.status, 406)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
    const body = await response.text()
    assert.match(body, /text\/html/)
    assert.match(body, /text\/markdown/)
  })
})
