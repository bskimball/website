import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkLinkActive({
  pathname,
  href,
}: {
  pathname: string
  href: string | URL | null | undefined
}): boolean {
  const subpath = pathname.match(/[^\/]+/g)
  return href === pathname || href === '/' + subpath?.[0]
}
