import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AstroIntegration } from 'astro'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildAgentFileMap } from '../lib/agent/generate.ts'
import { prefersMarkdown, appendVaryAccept } from '../lib/agent/accept.ts'
import { isDocumentPath, toMarkdownAssetPath } from '../lib/agent/paths.ts'
import { notFoundMarkdown } from '../lib/agent/content.ts'

function markdownHeaders(): Headers {
  const headers = new Headers()
  headers.set('Content-Type', 'text/markdown; charset=utf-8')
  appendVaryAccept(headers)
  return headers
}

export default function agentFiles(): AstroIntegration {
  return {
    name: 'agent-files',
    hooks: {
      'astro:server:setup': async ({ server }) => {
        const root = fileURLToPath(new URL('../..', import.meta.url))
        const files = await buildAgentFileMap(root)

        const handler = async (
          req: IncomingMessage,
          res: ServerResponse,
          next: () => void,
        ) => {
          const host = req.headers.host ?? 'localhost'
          const url = new URL(req.url ?? '/', `http://${host}`)
          const pathname = url.pathname
          const method = (req.method ?? 'GET').toUpperCase()
          if (method !== 'GET' && method !== 'HEAD') {
            next()
            return
          }

          const keyFromMd = pathname.replace(/^\//, '')
          const direct =
            files.get(keyFromMd) ?? files.get(`${keyFromMd}/index.md`)
          const accept = Array.isArray(req.headers.accept)
            ? req.headers.accept.join(',')
            : (req.headers.accept ?? null)

          if (
            direct &&
            (pathname.endsWith('.md') || pathname.endsWith('.txt'))
          ) {
            const headers = markdownHeaders()
            res.statusCode = 200
            for (const [name, value] of headers.entries()) {
              res.setHeader(name, value)
            }
            if (method === 'HEAD') {
              res.end()
              return
            }
            res.end(direct)
            return
          }

          if (isDocumentPath(pathname) && prefersMarkdown(accept)) {
            const asset = toMarkdownAssetPath(pathname).replace(/^\//, '')
            const body = files.get(asset)
            const headers = markdownHeaders()
            if (!body) {
              res.statusCode = 404
              headers.set('Cache-Control', 'no-store')
              for (const [name, value] of headers.entries()) {
                res.setHeader(name, value)
              }
              if (method === 'HEAD') {
                res.end()
                return
              }
              res.end(notFoundMarkdown(pathname))
              return
            }
            res.statusCode = 200
            for (const [name, value] of headers.entries()) {
              res.setHeader(name, value)
            }
            if (method === 'HEAD') {
              res.end()
              return
            }
            res.end(body)
            return
          }

          next()
        }

        server.middlewares.stack.unshift({
          route: '',
          // Connect's stack typing is loose; this is a standard Node handler.
          handle: handler as never,
        })
      },
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(new URL('../..', import.meta.url))
        const files = await buildAgentFileMap(root)
        const outDir = fileURLToPath(dir)

        for (const [relative, contents] of files) {
          const target = path.join(outDir, relative)
          await mkdir(path.dirname(target), { recursive: true })
          await writeFile(target, contents, 'utf8')
        }
      },
    },
  }
}
