import '@/css/tailwind.css'
// import 'pliny/search/algolia.css'

import { Lato } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchConfig, SearchProvider } from 'pliny/search'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import { UIProvider } from './ui-provider'
import { ReactNode } from 'react'
import SectionContainer from '@/components/SectionContainer'

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: '400',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: 'https://brian-kimball.com',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className={`${lato.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-slate-100 heropattern-texture-slate-100 dark:heropattern-texture-slate-900">
        <ThemeProviders>
          <UIProvider>
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <div className="h-full w-full flex flex-col min-h-screen overflow-x-hidden">
                <Header />
                <div className="flex-1">
                  <SectionContainer>
                    <div className="flex flex-col justify-between font-sans">
                      <main className="mb-auto">{children}</main>
                    </div>
                  </SectionContainer>
                </div>
                <Footer />
              </div>
            </SearchProvider>
          </UIProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
