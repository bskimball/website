'use client'

import { useEffect, useState } from 'react'
import siteMetaData from '@/data/siteMetadata'

export default function Hero() {
  const [hpColor, setHpColor] = useState('heropattern-topography-emerald-500')

  useEffect(() => {
    const options = [
      'heropattern-topography-emerald-500',
      'heropattern-topography-slate-300 dark:heropattern-topography-gray-700',
    ]

    const interval = setInterval(() => {
      setHpColor(options[Math.round(Math.random())])
    }, 1941)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`transition-[background-image] duration-[1200ms] -mx-16 ${hpColor}`}>
      <div className="bg-gradient-to-l from-white dark:from-slate-950">
        <div className="bg-gradient-to-r from-white dark:from-slate-950">
          <div className="px-16">
            <div className="mb-8 bg-cover bg-[url('/static/images/hero.png')] min-h-[360px]">
              <div className="drop-shadow">
                <div className="pt-24 text-slate-700 dark:text-slate-100">Hi, I'm Brian</div>
                <div className="text-3xl sm:text-4xl md:text-5xl text-slate-800 dark:text-white font-bold">
                  {siteMetaData.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
