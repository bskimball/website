import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'

function getMode() {
  return typeof window == 'undefined'
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

function applyMode(mode: string) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export default function DarkModeToggle() {
  const [mode, setMode] = useState(() => {
    const initialMode = getMode()
    if (typeof window !== 'undefined') {
      applyMode(initialMode)
    }
    return initialMode
  })

  useEffect(() => {
    const initialMode = getMode()
    applyMode(initialMode)
  }, [])

  useEffect(() => {
    if (!mode) return
    
    localStorage.theme = mode
    applyMode(mode)
  }, [mode])

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className={cn([
          'rounded-full',
          mode === 'light'
            ? 'text-amber-500 hover:text-amber-400'
            : mode === 'dark'
              ? 'text-sky-500 hover:text-sky-400'
              : 'text-neutral-500',
        ])}
        size="icon"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        <Icon mode={mode} />
      </Button>
    </div>
  )
}
