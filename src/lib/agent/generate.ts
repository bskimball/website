import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  type AgentPost,
  type AgentTag,
  aboutMarkdown,
  blogIndexMarkdown,
  developerMarkdown,
  homepageMarkdown,
  llmsFullTxt,
  llmsTxt,
  parseFrontmatter,
  parseTagList,
  postToMarkdown,
  tagMarkdown,
  tagsIndexMarkdown,
} from './content.ts'

function parseDate(value: string | undefined): Date {
  if (!value) return new Date(0)
  const cleaned = value.replace(/^['"]|['"]$/g, '')
  const date = new Date(cleaned)
  return Number.isNaN(date.valueOf()) ? new Date(0) : date
}

function isDraft(data: Record<string, string>): boolean {
  return (data.draft ?? '').toLowerCase() === 'true'
}

const BLOG_PAGE_SIZE = 10

type LoadedPost = AgentPost & { draft: boolean }

async function loadAllPosts(rootDir: string): Promise<LoadedPost[]> {
  const dir = path.join(rootDir, 'src/content/blog')
  const files = await readdir(dir)
  const posts: LoadedPost[] = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const raw = await readFile(path.join(dir, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    const id = file.replace(/\.(mdx|md)$/, '')
    posts.push({
      id,
      title: (data.title ?? id).replace(/^['"]|['"]$/g, ''),
      description: (data.description ?? '').replace(/^['"]|['"]$/g, ''),
      pubDate: parseDate(data.pubDate),
      tags: parseTagList(data.tags),
      body,
      draft: isDraft(data),
    })
  }

  return posts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
}

export async function loadPublishedPosts(
  rootDir: string,
): Promise<AgentPost[]> {
  const posts = await loadAllPosts(rootDir)
  return posts.filter((post) => !post.draft)
}

export async function loadTags(
  rootDir: string,
  posts: AgentPost[],
): Promise<AgentTag[]> {
  const dir = path.join(rootDir, 'src/content/tags')
  const files = await readdir(dir)
  const tags: AgentTag[] = []

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const id = file.replace(/\.json$/, '')
    const parsed = JSON.parse(await readFile(path.join(dir, file), 'utf8')) as {
      name?: string
    }
    tags.push({
      id,
      name: parsed.name ?? id,
      posts: posts.filter((post) => post.tags.includes(id)),
    })
  }

  return tags.sort((a, b) => a.name.localeCompare(b.name))
}

/** Map of dist-relative paths (no leading slash) to file contents. */
export async function buildAgentFileMap(
  rootDir: string,
): Promise<Map<string, string>> {
  const allPosts = await loadAllPosts(rootDir)
  const posts = allPosts.filter((post) => !post.draft)
  const tags = await loadTags(rootDir, posts)
  const files = new Map<string, string>()

  files.set('index.md', homepageMarkdown(posts))
  files.set('about/index.md', aboutMarkdown())
  files.set('tags/index.md', tagsIndexMarkdown(tags))
  files.set('developer/index.md', developerMarkdown())
  files.set('llms.txt', llmsTxt(posts))
  files.set('llms-full.txt', llmsFullTxt(posts))

  const pageCount = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE))
  for (let page = 1; page <= pageCount; page++) {
    const slice = posts.slice(
      (page - 1) * BLOG_PAGE_SIZE,
      page * BLOG_PAGE_SIZE,
    )
    const key = page === 1 ? 'blog/index.md' : `blog/${page}/index.md`
    files.set(key, blogIndexMarkdown(slice))
  }

  for (const post of allPosts) {
    files.set(`blog/${post.id}/index.md`, postToMarkdown(post))
  }
  for (const tag of tags) {
    files.set(`tags/${tag.id}/index.md`, tagMarkdown(tag))
  }

  return files
}
