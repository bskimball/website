import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

export function checkLinkActive({
  pathname,
  href,
}: {
  pathname: string
  href: string | URL | null | undefined
}): boolean {
  if (href == null) return false
  const hrefPath = typeof href === 'string' ? href : href.pathname
  const path = normalizePath(pathname)
  const link = normalizePath(hrefPath)
  const subpath = path.match(/[^\/]+/g)
  return link === path || link === '/' + (subpath?.[0] ?? '')
}

/** Normalize a content-collection tag reference to its string id. */
export function getTagId(
  tag: string | { id: string } | { data?: unknown } & Record<string, unknown>,
): string {
  return typeof tag === 'object' && tag !== null && 'id' in tag
    ? String((tag as { id: string }).id)
    : String(tag)
}
