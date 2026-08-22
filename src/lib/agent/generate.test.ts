import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { buildAgentFileMap, loadPublishedPosts } from './generate.ts'

const root = fileURLToPath(new URL('../../..', import.meta.url))

describe('buildAgentFileMap', () => {
  it('emits homepage, developer, llms, and published posts', async () => {
    const files = await buildAgentFileMap(root)
    assert.ok(files.has('index.md'))
    assert.ok(files.has('developer/index.md'))
    assert.ok(files.has('llms.txt'))
    assert.ok(files.has('llms-full.txt'))
    assert.ok(files.has('blog/index.md'))
    assert.ok(files.has('blog/high-availability/index.md'))
    assert.ok(files.has('blog/bdkinc-website/index.md'))

    const published = await loadPublishedPosts(root)
    const blogIndex = files.get('blog/index.md') ?? ''
    for (const post of published) {
      assert.match(blogIndex, new RegExp(`/blog/${post.id}/index\\.md`))
    }
    for (const key of files.keys()) {
      assert.doesNotMatch(key, /^blog\/\d+\/index\.md$/)
    }

    const llms = files.get('llms.txt') ?? ''
    assert.match(llms, /^# Brian Kimball/)
    assert.match(llms, /developer/)
    assert.match(llms, /custom-pi-agent-workflow/)
    assert.doesNotMatch(llms, /bdkinc-website/)

    const developer = files.get('developer/index.md') ?? ''
    assert.match(developer, /Brian Kimball developer resources/)
    assert.match(developer, /ibmi-mcp/)
  })
})
