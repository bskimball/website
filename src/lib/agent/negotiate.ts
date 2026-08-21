import {
  preferredType,
  appendVaryAccept,
  explicitlyPrefersHtml,
} from './accept.ts'
import { isDocumentPath, toMarkdownAssetPath } from './paths.ts'
import { notFoundMarkdown } from './content.ts'
import { SITE_URL } from '../../consts.ts'

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8'

function notAcceptableResponse(method: string): Response {
  const headers = new Headers()
  appendVaryAccept(headers)
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  const body = `Not Acceptable. Produced types: text/html, text/markdown.`
  return new Response(method === 'HEAD' ? null : body, { status: 406, headers })
}

function setLinkHeaders(headers: Headers, requestUrl: URL): void {
  const mdPath = toMarkdownAssetPath(requestUrl.pathname)
  const mdAbs = new URL(mdPath, SITE_URL).toString()
  const value = [
    `</llms.txt>; rel="describedby"; type="text/markdown"`,
    `</sitemap-index.xml>; rel="sitemap"`,
    `<${mdAbs}>; rel="alternate"; type="text/markdown"`,
  ].join(', ')
  const existing = headers.get('Link')
  headers.set('Link', existing ? `${existing}, ${value}` : value)
}

function markdownResponse(
  body: string,
  status: number,
  method: string,
): Response {
  const headers = new Headers()
  headers.set('Content-Type', MARKDOWN_TYPE)
  appendVaryAccept(headers)
  headers.set(
    'Cache-Control',
    status === 404 ? 'no-store' : 'public, max-age=0, must-revalidate',
  )
  return new Response(method === 'HEAD' ? null : body, { status, headers })
}

function withMarkdownAsset(
  asset: Response,
  requestUrl: URL,
  method: string,
): Response {
  const headers = new Headers(asset.headers)
  headers.set('Content-Type', MARKDOWN_TYPE)
  appendVaryAccept(headers)
  setLinkHeaders(headers, requestUrl)
  return new Response(method === 'HEAD' ? null : asset.body, {
    status: asset.status,
    headers,
  })
}

export async function handleAgentRequest(options: {
  request: Request
  next: () => Promise<Response>
  fetchAsset: (request: Request) => Promise<Response>
}): Promise<Response> {
  const { request, next, fetchAsset } = options
  const url = new URL(request.url)
  const method = request.method.toUpperCase()

  if (method !== 'GET' && method !== 'HEAD') {
    return next()
  }

  if (!isDocumentPath(url.pathname)) {
    return next()
  }

  const accept = request.headers.get('accept')
  const chosen = preferredType(accept)

  if (chosen === null) {
    return notAcceptableResponse(method)
  }

  const wantsMarkdownFile = url.pathname.endsWith('.md')

  if (chosen === 'text/markdown' || wantsMarkdownFile) {
    const mdUrl = new URL(toMarkdownAssetPath(url.pathname), url.origin)
    const asset = await fetchAsset(new Request(mdUrl, { method: 'GET' }))
    if (asset.ok) {
      return withMarkdownAsset(asset, url, method)
    }

    const downstream = await next()
    if (downstream.status >= 300 && downstream.status < 400) {
      const headers = new Headers(downstream.headers)
      appendVaryAccept(headers)
      setLinkHeaders(headers, url)
      return new Response(downstream.body, {
        status: downstream.status,
        statusText: downstream.statusText,
        headers,
      })
    }
    if (downstream.status === 404) {
      const response = markdownResponse(
        notFoundMarkdown(url.pathname),
        404,
        method,
      )
      setLinkHeaders(response.headers, url)
      return response
    }
    if (downstream.ok) {
      return notAcceptableResponse(method)
    }
    const headers = new Headers(downstream.headers)
    appendVaryAccept(headers)
    setLinkHeaders(headers, url)
    return new Response(downstream.body, {
      status: downstream.status,
      statusText: downstream.statusText,
      headers,
    })
  }

  const response = await next()

  if (response.status === 404 && !explicitlyPrefersHtml(accept)) {
    const recovered = markdownResponse(
      notFoundMarkdown(url.pathname),
      404,
      method,
    )
    setLinkHeaders(recovered.headers, url)
    return recovered
  }

  const headers = new Headers(response.headers)
  appendVaryAccept(headers)
  setLinkHeaders(headers, url)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
