import { useSyncExternalStore } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'

function getMode() {
  if (typeof window === 'undefined') return ''
  return localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'dark'
    : 'light'
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('theme-change', callback)

  const query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addEventListener('change', callback)

  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('theme-change', callback)
    query.removeEventListener('change', callback)
  }
}

function Icon({ mode }: { mode: string }) {
  if (mode === 'dark') return <FaMoon />
  if (mode === 'light') return <FaSun />
  return null
}

export default function DarkModeToggle() {
  const mode = useSyncExternalStore(subscribe, getMode, () => '')

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    localStorage.theme = newMode
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    window.dispatchEvent(new Event('theme-change'))
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className={cn([
          'rounded-full',
          mode === 'light'
            ? 'text-primary hover:text-primary/80'
            : mode === 'dark'
              ? 'text-primary hover:text-primary/80'
              : 'text-foreground/50',
        ])}
        size="icon"
        onClick={toggleMode}
      >
        <Icon mode={mode} />
      </Button>
    </div>
  )
}
