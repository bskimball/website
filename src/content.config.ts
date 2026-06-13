import { defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
      heroImageOptimized: image().optional(),
      fullImage: z.string().optional(),
      tags: z.array(reference('tags')).optional(),
      draft: z.boolean().optional(),
    }),
})

const tags = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/tags' }),
  schema: z.object({
    name: z.string(),
  }),
})

export const collections = { blog, tags }
