// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import react from '@astrojs/react'
import pagefind from 'astro-pagefind'
import tailwindcss from '@tailwindcss/vite'
import agentFiles from './src/integrations/agent-files'

// https://astro.build/config
export default defineConfig({
  site: 'https://brian-kimball.com',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap(), react(), pagefind(), agentFiles()],
  // Hover/tap prefetch only — prefetchAll would fetch every card
  // on /blog/ (29+ posts) on page load, which is wasteful on mobile.
  prefetch: {
    prefetchAll: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
