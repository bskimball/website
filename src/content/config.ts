import { defineCollection, reference, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(reference('tags')).optional(),
    draft: z.boolean().optional(),
  }),
})

const tags = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
  }),
})

export const collections = { blog, tags }
