'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ReactNode } from 'react'

export function UIProvider({ children }: { children: ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>
}
