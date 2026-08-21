import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  homepageMarkdown,
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

  it('builds a homepage with nested headings and recovery links', () => {
    const md = homepageMarkdown([sample])
    assert.match(md, /^# Brian Kimball/)
    assert.match(md, /^## What I build/m)
    assert.match(md, /^### IBM i modernization/m)
    assert.match(md, /llms\.txt/)
    assert.ok(md.length > 500)
  })

  it('lists developer resources in llms.txt using the spec sections', () => {
    const txt = llmsTxt([sample])
    assert.match(txt, /^# Brian Kimball/)
    assert.match(txt, /^> /m)
    assert.match(txt, /## Pages/)
    assert.match(txt, /developer resources/)
    assert.match(txt, /index\.md/)
  })

  it('gives 404 markdown a sitemap and llms.txt', () => {
    const md = notFoundMarkdown('/nope')
    assert.match(md, /# 404/)
    assert.match(md, /llms\.txt/)
    assert.match(md, /sitemap-index\.xml/)
  })
})
