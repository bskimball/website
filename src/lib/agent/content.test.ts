import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  aboutMarkdown,
  developerMarkdown,
  homepageMarkdown,
  llmsFullTxt,
  llmsTxt,
  notFoundMarkdown,
  parseFrontmatter,
  parseTagList,
  stripMdx,
  type AgentPost,
} from './content.ts'

const sample: AgentPost = {
  id: 'high-availability',
  title: 'Designing Fully Redundant Infrastructure',
  description: 'HA notes.',
  pubDate: new Date('2025-11-30'),
  tags: ['networking'],
  body: 'import X from "./x"\n\nHello world.\n',
}

describe('markdown generators', () => {
  it('parses frontmatter and MDX imports', () => {
    const parsed = parseFrontmatter(
      '---\ntitle: Hello\ndraft: false\n---\nimport X from "./x"\n\nBody\n',
    )
    assert.equal(parsed.data.title, 'Hello')
    assert.match(stripMdx(parsed.body), /^Body/)
    assert.deepEqual(parseTagList("['ai', 'ibmi']"), ['ai', 'ibmi'])
  })

  it('does not strip import lines inside fenced code blocks', () => {
    const body = [
      'import Thing from "./thing"',
      '',
      '<Callout />',
      '',
      '```ts',
      'import foo from "bar"',
      'const x = 1',
      '```',
      '',
      'After.',
    ].join('\n')
    const out = stripMdx(body)
    assert.match(out, /import foo from "bar"/)
    assert.doesNotMatch(out, /import Thing/)
    assert.doesNotMatch(out, /Callout/)
    assert.match(out, /After\./)
  })

  it('builds a homepage with nested headings, developer resources, and openapi links', () => {
    const md = homepageMarkdown([sample])
    assert.match(md, /^# Brian Kimball/m)
    assert.match(md, /^## What I build/m)
    assert.match(md, /^### IBM i modernization/m)
    assert.match(md, /llms\.txt/)
    assert.match(md, /developer\/index\.md/)
    assert.match(md, /openapi\.json/)
    assert.ok(md.length > 500)
  })

  it('lists developer resources and openapi specification in llms.txt using the spec sections', () => {
    const txt = llmsTxt([sample])
    assert.match(txt, /^# Brian Kimball/)
    assert.match(txt, /^> /m)
    assert.match(txt, /## Pages/)
    assert.match(txt, /Brian Kimball developer resources/)
    assert.match(txt, /## Machine-readable APIs & specifications/)
    assert.match(txt, /https:\/\/brian-kimball\.com\/openapi\.json/)
    assert.match(txt, /curated subset of public read-only GET endpoints/i)
    assert.match(txt, /negotiated JSON 404\/406 Problem Details/i)
    assert.match(txt, /https:\/\/brian-kimball\.com\/llms\.txt/)
    assert.match(txt, /https:\/\/brian-kimball\.com\/llms-full\.txt/)
    assert.match(txt, /index\.md/)
    // llms.txt must be described as proposal/convention, not standard
    assert.match(txt, /llmstxt\.org proposal/i)
    assert.doesNotMatch(txt, /llms(\.txt)?\s+(is\s+a\s+)?standard/i)
  })

  it('generates developer markdown with Brian Kimball identity, openapi, and machine discovery', () => {
    const md = developerMarkdown()
    assert.match(md, /^# Brian Kimball developer resources/m)
    assert.match(md, /https:\/\/brian-kimball\.com\/openapi\.json/)
    assert.match(md, /https:\/\/brian-kimball\.com\/developer\//)
    assert.match(md, /https:\/\/brian-kimball\.com\/llms\.txt/)
    assert.match(md, /## Machine-readable discovery & APIs/m)
    assert.match(md, /## Markdown content negotiation/m)
    assert.match(md, /## Public projects/m)
    assert.match(md, /## Brian Kimball identity & contact/m)
    assert.match(md, /Name: Brian Kimball/)
    assert.match(md, /curated subset of public read-only/i)
    assert.match(md, /negotiated JSON 404\/406 Problem Details/i)
    assert.match(
      md,
      /crawler directives, sitemap reference, and human-readable resource comments/i,
    )
  })

  it('enforces negative claim boundaries across generated agent prose', () => {
    const devMd = developerMarkdown()
    const llms = llmsTxt([sample])
    const allText = `${devMd}\n${llms}`

    // Must not over-claim OpenAPI scope
    assert.doesNotMatch(allText, /all endpoints/i)
    assert.doesNotMatch(allText, /all errors/i)

    // Must not call llms.txt a standard
    assert.doesNotMatch(allText, /llms(\.txt)?\s+(is\s+a\s+)?standard/i)
    assert.doesNotMatch(allText, /standardized llms/i)

    // Must explicitly declare absent systems
    assert.match(devMd, /no public authenticated HTTP API/i)
    assert.match(devMd, /no .*hosted MCP/i)
    assert.match(devMd, /no .*write endpoint/i)

    // Must not invent auth endpoints or flows
    assert.doesNotMatch(allText, /\/auth\b/i)
    assert.doesNotMatch(allText, /\/login\b/i)
    assert.doesNotMatch(allText, /bearer token/i)
    assert.doesNotMatch(allText, /api[_-]?key/i)

    // Must not invent webhooks
    assert.doesNotMatch(allText, /\/webhooks?\b/i)

    // Must not invent postal addresses or phone numbers
    assert.doesNotMatch(allText, /phone:\s*\+?[0-9]/i)
    assert.doesNotMatch(allText, /tel:\s*\+?[0-9]/i)
    assert.doesNotMatch(allText, /postal code|zip code/i)
    assert.doesNotMatch(allText, /street|suite|box\s+[0-9]/i)
  })

  it('generates llms-full.txt with Brian Kimball identity, developer portal, and openapi links', () => {
    const full = llmsFullTxt([sample])
    assert.match(full, /^# Brian Kimball — full markdown corpus/)
    assert.match(full, /Brian Kimball/)
    assert.match(full, /https:\/\/brian-kimball\.com\/developer\//)
    assert.match(full, /https:\/\/brian-kimball\.com\/openapi\.json/)
    assert.match(full, /# Designing Fully Redundant Infrastructure/)
  })

  it('includes developer resources and openapi specification in about markdown', () => {
    const md = aboutMarkdown()
    assert.match(md, /^# About Brian Kimball/)
    assert.match(md, /https:\/\/brian-kimball\.com\/developer\//)
    assert.match(md, /https:\/\/brian-kimball\.com\/openapi\.json/)
  })

  it('gives 404 markdown a sitemap, llms.txt, developer resources, and openapi specification', () => {
    const md = notFoundMarkdown('/nope')
    assert.match(md, /# 404/)
    assert.match(md, /llms\.txt/)
    assert.match(md, /developer\/index\.md/)
    assert.match(md, /openapi\.json/)
    assert.match(md, /sitemap-index\.xml/)
  })
})
