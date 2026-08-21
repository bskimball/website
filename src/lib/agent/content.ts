import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '../../consts.ts'

export type AgentPost = {
  id: string
  title: string
  description: string
  pubDate: Date
  tags: string[]
  body: string
}

export type AgentTag = {
  id: string
  name: string
  posts: AgentPost[]
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export function parseFrontmatter(raw: string): {
  data: Record<string, string>
  body: string
} {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    data[key] = value
  }
  return { data, body: match[2] ?? '' }
}

export function parseTagList(raw: string | undefined): string[] {
  if (!raw) return []
  const inner = raw.replace(/^\[/, '').replace(/\]$/, '')
  return inner
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

export function stripMdx(body: string): string {
  const fences: string[] = []
  const withPlaceholders = body.replace(/```[\s\S]*?```/g, (block) => {
    const token = `\0FENCE${fences.length}\0`
    fences.push(block)
    return token
  })
  const stripped = withPlaceholders
    .replace(/^import\s.+?;?\s*$/gm, '')
    .replace(/<[A-Z][A-Za-z0-9]*\b[\s\S]*?(?:\/>|<\/[A-Z][A-Za-z0-9]*>)/g, '')
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/?>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return stripped.replace(
    /\0FENCE(\d+)\0/g,
    (_, idx) => fences[Number(idx)] ?? '',
  )
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function postToMarkdown(post: AgentPost): string {
  const tags = post.tags.length ? post.tags.join(', ') : 'none'
  return [
    `# ${post.title}`,
    '',
    `> ${post.description}`,
    '',
    `- Author: ${AUTHOR_NAME}`,
    `- Published: ${formatDate(post.pubDate)}`,
    `- Tags: ${tags}`,
    `- Canonical: ${SITE_URL}/blog/${post.id}/`,
    `- Markdown: ${SITE_URL}/blog/${post.id}/index.md`,
    '',
    stripMdx(post.body),
    '',
  ].join('\n')
}

export function homepageMarkdown(posts: AgentPost[]): string {
  const latest = posts
    .slice(0, 9)
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.id}/index.md): ${post.description}`,
    )
    .join('\n')

  return `# ${SITE_TITLE} — Systems Engineer & Developer

> ${SITE_DESCRIPTION}

This is the personal website and technical blog of **${AUTHOR_NAME}** at [${SITE_URL.replace('https://', '')}](${SITE_URL}/). Field notes on modernizing IBM i, operating infrastructure, and building software that survives contact with production.

## What I build

### IBM i modernization
System tooling, application integration, and a practical path forward for IBM i (AS/400) — LDAP, LAGG, Knex/DB2, MCP tools, and production operations.

### Infrastructure architecture
Networks, compute, storage, and high-availability systems designed as a whole: datacenter installs, pfSense, redundant physical and logical layers.

### Application development
Full-stack products with low operational complexity — Astro, React, Node.js, Hono, Fastify, and Cloudflare.

### Engineering tools and AI
Agent workflows, MCP servers, and tools that make technical teams more capable without hiding the process.

## Latest field notes

${latest}

## Where to go next

- [About ${AUTHOR_NAME}](${SITE_URL}/about/index.md)
- [Blog](${SITE_URL}/blog/index.md)
- [Developer resources](${SITE_URL}/developer/index.md)
- [llms.txt](${SITE_URL}/llms.txt)
- [Full markdown corpus](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap-index.xml)
- [RSS](${SITE_URL}/rss.xml)
`
}

export function aboutMarkdown(): string {
  return `# About ${AUTHOR_NAME}

> ${AUTHOR_NAME} is a Systems Engineer and Developer based in Delaware. He writes about IBM i modernization, full-stack development, network infrastructure, and building resilient systems from the metal up.

I build across the boundary between software and infrastructure. My version of "full-stack" includes racking servers, configuring VLANs, and then deploying the application.

I started in graphic design and web development, moved through helpdesk and systems administration, and eventually led the technical architecture for a cloud services division. That path taught me to treat applications, networks, and hardware as one system — not separate specialties.

## Work across the stack

- [IBM i modernization](${SITE_URL}/tags/ibmi/index.md)
- [Infrastructure architecture](${SITE_URL}/blog/high-availability/index.md)
- [Application development](${SITE_URL}/blog/building-compass-life-assistant/index.md)
- [Engineering tools and AI](${SITE_URL}/blog/custom-pi-agent-workflow/index.md)

This site is a working catalog of open-source contributions, production lessons, and technical experiments.

## Contact

- Email: hello@brian-kimball.com
- GitHub: https://github.com/bskimball
- LinkedIn: https://www.linkedin.com/in/brian-kimball-0499678a/
- Site: ${SITE_URL}/
- Developer resources: ${SITE_URL}/developer/
`
}

export function blogIndexMarkdown(posts: AgentPost[]): string {
  const items = posts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.id}/index.md) (${formatDate(post.pubDate)}): ${post.description}`,
    )
    .join('\n')

  return `# ${SITE_TITLE} blog

> Articles on IBM i modernization, full-stack development, network infrastructure, and systems engineering by ${AUTHOR_NAME}.

${items}

See also: [llms.txt](${SITE_URL}/llms.txt), [RSS](${SITE_URL}/rss.xml), [tags](${SITE_URL}/tags/index.md).
`
}

export function tagsIndexMarkdown(tags: AgentTag[]): string {
  const items = tags
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      (tag) =>
        `- [${tag.name}](${SITE_URL}/tags/${tag.id}/index.md) (${tag.posts.length})`,
    )
    .join('\n')

  return `# ${SITE_TITLE} tags

> Browse articles by topic — IBM i, full-stack development, infrastructure, design systems, and more.

${items}
`
}

export function tagMarkdown(tag: AgentTag): string {
  const items = tag.posts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.id}/index.md): ${post.description}`,
    )
    .join('\n')

  return `# ${SITE_TITLE} posts tagged "${tag.name}"

> Articles about ${tag.name} — systems engineering, development, and infrastructure from ${AUTHOR_NAME}.

${items || 'No published posts with this tag yet.'}
`
}

export function developerMarkdown(): string {
  return `# ${SITE_TITLE} developer resources

> Machine-readable entry points, public projects, and agent-facing files for ${AUTHOR_NAME} (${SITE_URL.replace('https://', '')}).

This site is a personal engineering blog, not a SaaS API. There is no public authenticated HTTP API, webhook catalog, or hosted MCP endpoint here. The resources below are the stable URLs agents should use.

## Site files for agents

- [llms.txt](${SITE_URL}/llms.txt): curated markdown index (llmstxt.org)
- [llms-full.txt](${SITE_URL}/llms-full.txt): concatenated published posts
- [Sitemap](${SITE_URL}/sitemap-index.xml)
- [RSS](${SITE_URL}/rss.xml)
- [Homepage markdown](${SITE_URL}/index.md)
- [robots.txt](${SITE_URL}/robots.txt)

## Markdown content negotiation

Send \`Accept: text/markdown\` on any HTML page URL (for example \`${SITE_URL}/\` or \`${SITE_URL}/blog/high-availability/\`). The same URL returns \`Content-Type: text/markdown; charset=utf-8\` with \`Vary: Accept\`. Equivalent files also live at \`index.md\` next to each page.

## Public projects

- [Custom Pi agent workflow](${SITE_URL}/blog/custom-pi-agent-workflow/index.md) — source: https://github.com/bskimball/pi
- [IBM i MCP server (31 tools)](${SITE_URL}/blog/ibmi-ai-mcp/index.md) — package: https://www.npmjs.com/package/@bdkinc/ibmi-mcp
- GitHub profile: https://github.com/bskimball
- This website source: https://github.com/bskimball/website

## Identity

- Name: ${AUTHOR_NAME}
- Site: ${SITE_URL}/
- Email: hello@brian-kimball.com
- LinkedIn: https://www.linkedin.com/in/brian-kimball-0499678a/
`
}

export function notFoundMarkdown(pathname: string): string {
  const path = pathname || '/'
  return `# 404 — Not Found

The path \`${path}\` is not on ${SITE_TITLE}'s site (${SITE_URL.replace('https://', '')}).

This response is an HTTP 404. The URL does not exist. Do not treat it as an empty document.

## Where to look next

- [Home](${SITE_URL}/index.md)
- [llms.txt](${SITE_URL}/llms.txt) — curated site map for agents
- [Developer resources](${SITE_URL}/developer/index.md)
- [Blog](${SITE_URL}/blog/index.md)
- [About ${AUTHOR_NAME}](${SITE_URL}/about/index.md)
- [Sitemap](${SITE_URL}/sitemap-index.xml)
- [RSS](${SITE_URL}/rss.xml)
`
}

export function llmsTxt(posts: AgentPost[]): string {
  const featured = posts.slice(0, 8)
  const rest = posts.slice(8)

  const featuredList = featured
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.id}/index.md): ${post.description}`,
    )
    .join('\n')
  const archiveList = rest
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.id}/index.md): ${post.description}`,
    )
    .join('\n')

  return `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}

Personal website of **${AUTHOR_NAME}**, a systems engineer and developer. Use the markdown URLs below (or send \`Accept: text/markdown\` to the HTML URLs). There is no public product API on this origin.

## Pages

- [Home](${SITE_URL}/index.md): ${SITE_TITLE} — systems engineer and developer
- [About](${SITE_URL}/about/index.md): biography and contact
- [Blog](${SITE_URL}/blog/index.md): all published field notes
- [Tags](${SITE_URL}/tags/index.md): topics index
- [Brian Kimball developer resources](${SITE_URL}/developer/index.md): llms.txt, markdown negotiation, GitHub, MCP, RSS

## Featured & recent articles

${featuredList}

## Complete archive

${archiveList}

## Optional

- [llms-full.txt](${SITE_URL}/llms-full.txt): full concatenated markdown corpus
- [Sitemap](${SITE_URL}/sitemap-index.xml)
- [RSS](${SITE_URL}/rss.xml)
- [GitHub](https://github.com/bskimball)
- [IBM i MCP on npm](https://www.npmjs.com/package/@bdkinc/ibmi-mcp)
- [Pi agent workflow](https://github.com/bskimball/pi)
`
}

export function llmsFullTxt(posts: AgentPost[]): string {
  const parts = [
    `# ${SITE_TITLE} — full markdown corpus`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `Generated for agents. Canonical HTML site: ${SITE_URL}/`,
    '',
  ]

  for (const post of posts) {
    parts.push('---', '', postToMarkdown(post).trim(), '')
  }

  return parts.join('\n')
}
