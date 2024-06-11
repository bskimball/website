'use client'

import { useEffect, useState } from 'react'
import siteMetaData from '@/data/siteMetadata'
import SectionContainer from '@/components/SectionContainer'

export default function Hero() {
  const [hpColor, setHpColor] = useState('heropattern-topography-cyan-500')

  useEffect(() => {
    const options = [
      'heropattern-topography-cyan-500',
      'heropattern-topography-slate-300 dark:heropattern-topography-gray-700',
    ]

    const interval = setInterval(() => {
      setHpColor(options[Math.round(Math.random())])
    }, 1941)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`transition-[background-image] duration-[1200ms] ${hpColor} mb-24`}>
      <div className="bg-gradient-to-l from-white dark:from-slate-950">
        <div className="bg-gradient-to-r from-white dark:from-slate-950">
          <div className="px-16">
            <div className="mb-8 bg-cover bg-[url('/static/images/hero.png')] min-h-[480px]">
              <SectionContainer>
                <div className="drop-shadow pt-24 max-w-lg">
                  <div className="pt-24 text-2xl text-slate-700 dark:text-slate-100 mb-2">
                    Hi, I'm <span className="font-semibold">Brian</span>, and
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl text-slate-800 dark:text-white mb-6">
                    this is my <span className="font-bold">website</span>.
                  </div>
                  <div className="py-2 text-xl prose text-slate-900 dark:text-slate-100">
                    <p>
                      I work in IT, as a Systems Admin/Network Admin/Software Developer. I mostly
                      write technical content, and things that interest me.
                    </p>
                  </div>
                </div>
              </SectionContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
