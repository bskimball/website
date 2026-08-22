import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { handleAgentRequest } from './negotiate.ts'
import { GET as getOpenApi } from '../../pages/openapi.json.ts'

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

  it('passes /openapi.json through without rewriting JSON as a problem', async () => {
    const spec = '{"openapi":"3.1.0"}'
    const response = await run({
      path: '/openapi.json',
      accept: 'application/json',
      next: async () =>
        new Response(spec, {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }),
    })
    assert.equal(response.status, 200)
    assert.match(
      response.headers.get('Content-Type') ?? '',
      /application\/json/,
    )
    assert.equal(await response.text(), spec)
  })

  it('returns problem+json 404 for unknown /api/ paths', async () => {
    const response = await run({
      path: '/api/nope',
      accept: 'application/json',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    assert.match(
      response.headers.get('Content-Type') ?? '',
      /application\/problem\+json/,
    )
    const body = JSON.parse(await response.text())
    assert.equal(body.status, 404)
    assert.equal(body.code, 'not_found')
    assert.equal(body.instance, '/api/nope')
    assert.ok(body.resolution)
    assert.equal(body.type, 'about:blank')
    assert.ok(body.title)
    assert.ok(body.detail)
  })

  it('returns problem+json 404 when Accept is application/json on a missing page', async () => {
    const response = await run({
      path: '/missing-json',
      accept: 'application/json',
      next: async () => html404(),
    })
    assert.equal(response.status, 404)
    const body = JSON.parse(await response.text())
    assert.equal(body.status, 404)
    assert.equal(body.code, 'not_found')
  })

  it('returns problem+json 406 when JSON is requested for a successful HTML page', async () => {
    const response = await run({
      path: '/',
      accept: 'application/json',
    })
    assert.equal(response.status, 406)
    assert.match(
      response.headers.get('Content-Type') ?? '',
      /application\/problem\+json/,
    )
    const body = JSON.parse(await response.text())
    assert.equal(body.status, 406)
    assert.equal(body.code, 'not_acceptable')
  })

  it('keeps successful HTML when Accept is text/html even if JSON is listed later', async () => {
    const response = await run({
      path: '/',
      accept: 'text/html, application/json;q=0.1',
    })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/)
  })

  it('301s the six retired blog pagination paths', async () => {
    const cases: Array<[string, string]> = [
      ['/blog/2', '/blog/'],
      ['/blog/2/', '/blog/'],
      ['/blog/3', '/blog/'],
      ['/blog/3/', '/blog/'],
      ['/blog/2/index.md', '/blog/index.md'],
      ['/blog/3/index.md', '/blog/index.md'],
    ]
    for (const [from, to] of cases) {
      const response = await run({
        path: from,
        accept: 'text/html',
        next: async () => html404(),
      })
      assert.equal(response.status, 301, from)
      assert.equal(new URL(response.headers.get('Location') ?? '').pathname, to)
    }
  })

  it('serves a parseable OpenAPI 3.1 document with documented contracts', async () => {
    const response = getOpenApi()
    assert.equal(response.status, 200)
    assert.equal(
      response.headers.get('Content-Type'),
      'application/json; charset=utf-8',
    )
    const spec = JSON.parse(await response.text())
    assert.equal(spec.openapi, '3.1.0')
    assert.match(spec.info.title, /Brian Kimball/)
    assert.equal(spec.servers[0].url, ORIGIN)
    assert.equal(spec.externalDocs.url, `${ORIGIN}/developer/`)
    for (const path of [
      '/openapi.json',
      '/llms.txt',
      '/llms-full.txt',
      '/rss.xml',
      '/sitemap-index.xml',
      '/developer/',
      '/blog/',
      '/blog/{slug}/',
    ]) {
      assert.ok(spec.paths[path], path)
      assert.ok(spec.paths[path].get)
    }
    assert.equal(spec.paths['/{documentPath}'], undefined)
    assert.ok(spec.components.schemas.ProblemDetails)
    assert.ok(spec.paths['/rss.xml'].get.responses['200'].content['text/xml'])
    assert.equal(
      spec.paths['/rss.xml'].get.responses['200'].content['application/xml'],
      undefined,
    )
    assert.equal(
      spec.paths['/rss.xml'].get.responses['200'].content[
        'application/rss+xml'
      ],
      undefined,
    )
    assert.match(spec.info.description, /this document/i)
    assert.match(spec.info.description, /resources documented here/)
    assert.deepEqual(spec.components.schemas.ProblemDetails.required, [
      'type',
      'title',
      'status',
      'detail',
      'instance',
      'code',
      'resolution',
    ])
  })

  it('rewrites document-path 406 to problem JSON only when JSON wins Accept', async () => {
    const jsonWinsHtml = await run({
      path: '/missing',
      accept: 'application/json;q=0.9, text/html;q=0.1',
      next: async () =>
        new Response('nope', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(jsonWinsHtml.status, 406)
    assert.match(
      jsonWinsHtml.headers.get('Content-Type') ?? '',
      /application\/problem\+json/,
    )
    const htmlProblem = JSON.parse(await jsonWinsHtml.text())
    assert.equal(htmlProblem.code, 'not_acceptable')

    const htmlWins = await run({
      path: '/missing',
      accept: 'text/html;q=0.9, application/json;q=0.1',
      next: async () =>
        new Response('keep-html', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(htmlWins.status, 406)
    assert.match(htmlWins.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await htmlWins.text(), 'keep-html')

    const jsonWinsMd = await run({
      path: '/missing',
      accept: 'application/json;q=0.9, text/markdown;q=0.1',
      next: async () =>
        new Response('nope-md', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(jsonWinsMd.status, 406)
    assert.match(
      jsonWinsMd.headers.get('Content-Type') ?? '',
      /application\/problem\+json/,
    )

    const markdownWins = await run({
      path: '/missing',
      accept: 'text/markdown;q=0.9, application/json;q=0.1',
      next: async () =>
        new Response('keep-md', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(markdownWins.status, 406)
    assert.match(markdownWins.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await markdownWins.text(), 'keep-md')
  })

  it('does not rewrite downstream 406 when text/* outranks JSON', async () => {
    const response = await run({
      path: '/missing',
      accept: 'text/*;q=0.9, application/json;q=0.5',
      next: async () =>
        new Response('keep-text-star', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(response.status, 406)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await response.text(), 'keep-text-star')
  })

  it('does not rewrite downstream 406 when */* outranks JSON', async () => {
    const response = await run({
      path: '/missing',
      accept: '*/*;q=1, application/json;q=0.5',
      next: async () =>
        new Response('keep-star', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(response.status, 406)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await response.text(), 'keep-star')
  })

  it('does not rewrite downstream 406 when Markdown still wins via text/*', async () => {
    const response = await run({
      path: '/missing',
      accept: 'text/*;q=0.9, text/html;q=0, application/json;q=0.5',
      next: async () =>
        new Response('keep-md-via-text-star', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(response.status, 406)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await response.text(), 'keep-md-via-text-star')
  })

  it('does not rewrite downstream 406 on equal-q wildcard document vs JSON', async () => {
    const response = await run({
      path: '/missing',
      accept: '*/*;q=0.5, application/json;q=0.5',
      next: async () =>
        new Response('keep-equal-wildcard', {
          status: 406,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    })
    assert.equal(response.status, 406)
    assert.match(response.headers.get('Content-Type') ?? '', /text\/plain/)
    assert.equal(await response.text(), 'keep-equal-wildcard')
  })

  it('does not rewrite downstream 403 or 500 into problem JSON', async () => {
    const forbidden = await run({
      path: '/missing',
      accept: 'application/json',
      next: async () =>
        new Response('nope', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' },
        }),
    })
    assert.equal(forbidden.status, 403)
    assert.equal(await forbidden.text(), 'nope')

    const boom = await run({
      path: '/missing',
      accept: 'application/json',
      next: async () =>
        new Response('boom', {
          status: 500,
          headers: { 'Content-Type': 'text/plain' },
        }),
    })
    assert.equal(boom.status, 500)
    assert.equal(await boom.text(), 'boom')
  })

  it('validates OpenAPI 3.1 structure without an installed validator', async () => {
    const spec = JSON.parse(await getOpenApi().text())
    assert.equal(spec.openapi, '3.1.0')
    assert.equal(
      spec.jsonSchemaDialect,
      'https://json-schema.org/draft/2020-12/schema',
    )
    assert.ok(spec.info.title && spec.info.version)
    assert.ok(Array.isArray(spec.servers) && spec.servers.length >= 1)
    assert.equal(typeof spec.paths, 'object')
    for (const [p, item] of Object.entries(spec.paths)) {
      assert.match(p, /^\//)
      assert.ok(item && typeof item === 'object')
      const get = (item as { get?: { responses?: Record<string, unknown> } })
        .get
      assert.ok(get?.responses?.['200'], p)
    }
    const problem = spec.components.schemas.ProblemDetails
    assert.equal(problem.type, 'object')
    assert.ok(problem.properties.type)
    assert.ok(problem.properties.status)
  })
})
