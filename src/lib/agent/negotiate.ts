import {
  preferredType,
  appendVaryAccept,
  explicitlyPrefersHtml,
} from './accept.ts'
import {
  isDocumentPath,
  toMarkdownAssetPath,
  legacyBlogPageRedirect,
  wantsProblemJson,
} from './paths.ts'
import { notFoundMarkdown } from './content.ts'
import { SITE_URL } from '../../consts.ts'

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8'

function problemResponse(
  status: 404 | 406,
  method: string,
  instancePath: string,
): Response {
  const title = status === 404 ? 'Not Found' : 'Not Acceptable'
  const code = status === 404 ? 'not_found' : 'not_acceptable'
  const detail =
    status === 404
      ? `No resource exists at ${instancePath}.`
      : 'No representation matches the requested Accept types. Produced types: text/html, text/markdown.'
  const resolution =
    status === 404
      ? 'Use GET /llms.txt, GET /sitemap-index.xml, or GET /developer/ to discover published URLs.'
      : 'Send Accept: text/html or Accept: text/markdown, or request a .md URL for documents.'
  const body = JSON.stringify({
    type: 'about:blank',
    title,
    status,
    detail,
    instance: instancePath,
    code,
    resolution,
  })
  const headers = new Headers()
  appendVaryAccept(headers)
  headers.set('Content-Type', 'application/problem+json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  return new Response(method === 'HEAD' ? null : body, { status, headers })
}

function notAcceptableResponse(
  method: string,
  pathname: string,
  accept: string | null,
): Response {
  if (wantsProblemJson(pathname, accept)) {
    return problemResponse(406, method, pathname)
  }
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

  const accept = request.headers.get('accept')
  const redirectTo = legacyBlogPageRedirect(url.pathname)
  if (redirectTo) {
    const location = new URL(redirectTo, url.origin)
    location.search = url.search
    return Response.redirect(location, 301)
  }

  const jsonErrors = wantsProblemJson(url.pathname, accept)

  if (!isDocumentPath(url.pathname)) {
    if (!jsonErrors) return next()
    const downstream = await next()
    if (downstream.status === 404) {
      return problemResponse(404, method, url.pathname)
    }
    if (downstream.status === 406) {
      return problemResponse(406, method, url.pathname)
    }
    return downstream
  }

  const chosen = preferredType(accept)

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
      if (jsonErrors) {
        return problemResponse(404, method, url.pathname)
      }
      const response = markdownResponse(
        notFoundMarkdown(url.pathname),
        404,
        method,
      )
      setLinkHeaders(response.headers, url)
      return response
    }
    if (downstream.status === 406) {
      if (jsonErrors) {
        return problemResponse(406, method, url.pathname)
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
    if (downstream.ok) {
      return notAcceptableResponse(method, url.pathname, accept)
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

  if (chosen === null && !jsonErrors) {
    return notAcceptableResponse(method, url.pathname, accept)
  }

  const response = await next()

  if (response.status === 404 && jsonErrors) {
    return problemResponse(404, method, url.pathname)
  }

  if (response.status === 406) {
    if (jsonErrors) {
      return problemResponse(406, method, url.pathname)
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

  if (response.ok && chosen === null) {
    return notAcceptableResponse(method, url.pathname, accept)
  }

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
