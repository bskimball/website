'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@nextui-org/switch'

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center">
      <Switch
        defaultSelected={mounted && (theme === 'dark' || resolvedTheme === 'dark')}
        aria-label="dark mode"
        onChange={() => setTheme(theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark')}
      />
    </div>
  )
}
