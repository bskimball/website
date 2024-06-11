'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { usePathname } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'
import Hero from './Hero'
import { KBarProvider } from 'kbar'

const Header = () => {
  const pathname = usePathname()

  return (
    <header>
      <div className="relative z-50 backdrop-blur bg-white/50 dark:bg-slate-950/50">
        <SectionContainer>
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" aria-label={siteMetadata.headerTitle}>
                <div className="flex items-center justify-between">
                  {typeof siteMetadata.headerTitle === 'string' ? (
                    <div className="hidden text-2xl font-semibold sm:block">
                      {siteMetadata.headerTitle}
                    </div>
                  ) : (
                    siteMetadata.headerTitle
                  )}
                </div>
              </Link>
            </div>
            <div>
              <nav className="flex items-center leading-5 space-x-4 sm:space-x-6 relative z-[9999]">
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="hidden sm:block font-medium text-gray-900 dark:text-gray-100 py-4"
                  >
                    {link.title}
                  </Link>
                ))}
                <SearchButton />
                <ThemeSwitch />
                <MobileNav />
              </nav>
            </div>
          </div>
        </SectionContainer>
      </div>
      {pathname === '/' ? (
        <div className="-mt-24 -z-1">
          <Hero />
        </div>
      ) : null}
    </header>
  )
}

export default Header
