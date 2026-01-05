import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'

function getMode() {
  return typeof window === 'undefined'
    ? ''
    : localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light'
}

function Icon({ mode }: { mode: string }) {
  if (mode === 'dark') return <FaMoon />
  if (mode === 'light') return <FaSun />
  return null
}

export default function DarkModeToggle() {
  const [mode, setMode] = useState('')

  useEffect(() => {
    setMode(getMode())
  }, [])

  useEffect(() => {
    if (!mode) return
    localStorage.theme = mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

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
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        <Icon mode={mode} />
      </Button>
    </div>
  )
}
