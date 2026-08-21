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
