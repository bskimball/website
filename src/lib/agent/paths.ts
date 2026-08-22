import { effectiveQuality, parseAccept } from './accept.ts'

const PASSTHROUGH_PREFIXES = [
  '/_astro/',
  '/static/',
  '/pagefind/',
  '/fonts/',
  '/favicon',
]

const PASSTHROUGH_EXACT = new Set([
  '/rss.xml',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/robots.txt',
  '/favicon.svg',
  '/default-display.png',
  '/openapi.json',
  '/llms.txt',
  '/llms-full.txt',
])

const PASSTHROUGH_EXTENSIONS = new Set([
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.woff',
  '.woff2',
  '.css',
  '.js',
  '.map',
  '.xml',
  '.json',
  '.txt',
])

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`
  return withSlash.replace(/\/{2,}/g, '/')
}

/** Map a document URL to its prerendered markdown asset path. */
export function toMarkdownAssetPath(pathname: string): string {
  const [path] = pathname.split(/[?#]/)
  if (!path || path === '/') return '/index.md'
  if (path.endsWith('.md')) return path
  if (path.endsWith('.html')) return `${path.slice(0, -5)}.md`
  const trimmed = path.replace(/\/+$/, '')
  return `${trimmed}/index.md`
}

export function isDocumentPath(pathname: string): boolean {
  const [path] = pathname.split(/[?#]/)
  if (!path) return false
  if (PASSTHROUGH_EXACT.has(path)) return false
  if (PASSTHROUGH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false
  }
  const last = path.split('/').pop() ?? ''
  if (last.includes('.')) {
    const ext = last.slice(last.lastIndexOf('.')).toLowerCase()
    if (ext === '.md' || ext === '.html') return true
    if (PASSTHROUGH_EXTENSIONS.has(ext)) return false
  }
  return true
}

export function markdownAlternateHref(
  pathname: string,
  origin: string,
): string {
  return new URL(toMarkdownAssetPath(pathname), origin).toString()
}

/** Retired numeric blog pagination — exact paths only, never post slugs. */
const LEGACY_BLOG_PAGE_REDIRECTS: Record<string, string> = {
  '/blog/2': '/blog/',
  '/blog/2/': '/blog/',
  '/blog/3': '/blog/',
  '/blog/3/': '/blog/',
  '/blog/2/index.md': '/blog/index.md',
  '/blog/3/index.md': '/blog/index.md',
}

export function legacyBlogPageRedirect(pathname: string): string | null {
  const [path] = pathname.split(/[?#]/)
  if (!path) return null
  return LEGACY_BLOG_PAGE_REDIRECTS[path] ?? null
}

function isJsonAcceptType(type: string): boolean {
  if (type === 'application/json' || type === 'application/problem+json') {
    return true
  }
  if (type === 'application/*+json') return true
  return /^application\/[a-z0-9!#$&^_.+-]*\+json$/i.test(type)
}

function bestQ(header: string, predicate: (type: string) => boolean): number {
  let best = 0
  for (const entry of parseAccept(header)) {
    if (entry.q <= 0 || !predicate(entry.type)) continue
    if (entry.q > best) best = entry.q
  }
  return best
}

export function wantsProblemJson(
  pathname: string,
  accept: string | null,
): boolean {
  const [path] = pathname.split(/[?#]/)
  if (path === '/openapi.json') return false
  if (path?.startsWith('/api/') || path === '/api') return true
  if (!accept || accept.trim() === '') return false
  const jsonQ = bestQ(accept, isJsonAcceptType)
  if (jsonQ <= 0) return false
  const htmlQ = effectiveQuality(accept, 'text/html')
  const markdownQ = effectiveQuality(accept, 'text/markdown')
  const documentQ = Math.max(htmlQ, markdownQ)
  if (documentQ > 0 && documentQ >= jsonQ) return false
  return true
}
