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
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
