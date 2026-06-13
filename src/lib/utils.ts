import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import GithubSlugger from 'github-slugger'

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

export const slugger = new GithubSlugger()

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
