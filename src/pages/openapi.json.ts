import { SITE_TITLE, SITE_URL } from '../consts.ts'

export const prerender = true

const PROBLEM_SCHEMA_REF = { $ref: '#/components/schemas/ProblemDetails' }

function markdownOk(description: string) {
  return {
    description,
    content: { 'text/markdown': { schema: { type: 'string' } } },
  }
}

function documentGet(summary: string) {
  return {
    tags: ['Documents'],
    summary,
    responses: {
      '200': {
        description:
          'HTML by default, or Markdown when Accept prefers text/markdown or the URL ends with .md',
        content: {
          'text/html': { schema: { type: 'string' } },
          'text/markdown': { schema: { type: 'string' } },
        },
      },
      '404': {
        description:
          'Missing document. application/problem+json when the client prefers JSON (including /api/); otherwise HTML or Markdown per Accept.',
        content: {
          'application/problem+json': { schema: PROBLEM_SCHEMA_REF },
          'text/html': { schema: { type: 'string' } },
          'text/markdown': { schema: { type: 'string' } },
        },
      },
      '406': {
        description:
          'No acceptable representation among text/html and text/markdown. application/problem+json when the client prefers JSON; otherwise text/plain.',
        content: {
          'application/problem+json': { schema: PROBLEM_SCHEMA_REF },
          'text/plain': { schema: { type: 'string' } },
        },
      },
    },
  }
}

const OPENAPI = {
  openapi: '3.1.0',
  jsonSchemaDialect: 'https://json-schema.org/draft/2020-12/schema',
  info: {
    title: `${SITE_TITLE} public machine-readable surface`,
    version: '1.0.0',
    description:
      'This document describes the resources documented here: read-only GET endpoints on Brian Kimball’s personal site. There is no authentication, no write API, and no MCP server among the resources documented here.',
  },
  servers: [{ url: SITE_URL }],
  externalDocs: {
    description: 'Brian Kimball developer documentation',
    url: `${SITE_URL}/developer/`,
  },
  tags: [{ name: 'Discovery' }, { name: 'Feeds' }, { name: 'Documents' }],
  paths: {
    '/openapi.json': {
      get: {
        tags: ['Discovery'],
        operationId: 'getOpenApiDocument',
        summary: 'OpenAPI 3.1 description of the resources documented here',
        responses: {
          '200': {
            description: 'This document as JSON',
            content: {
              'application/json': {
                schema: { type: 'object', additionalProperties: true },
              },
            },
          },
        },
      },
    },
    '/llms.txt': {
      get: {
        tags: ['Discovery'],
        operationId: 'getLlmsTxt',
        summary: 'Short agent index (llms.txt)',
        responses: { '200': markdownOk('llms.txt index') },
      },
    },
    '/llms-full.txt': {
      get: {
        tags: ['Discovery'],
        operationId: 'getLlmsFullTxt',
        summary: 'Full agent corpus (llms-full.txt)',
        responses: { '200': markdownOk('Concatenated site markdown') },
      },
    },
    '/rss.xml': {
      get: {
        tags: ['Feeds'],
        operationId: 'getRssFeed',
        summary: 'Blog RSS 2.0 feed',
        responses: {
          '200': {
            description: 'RSS XML',
            content: { 'text/xml': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/sitemap-index.xml': {
      get: {
        tags: ['Feeds'],
        operationId: 'getSitemapIndex',
        summary: 'XML sitemap index',
        responses: {
          '200': {
            description: 'Sitemap index',
            content: { 'application/xml': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/developer/': {
      get: {
        operationId: 'getDeveloperDocs',
        ...documentGet('Human developer documentation page'),
      },
    },
    '/blog/': {
      get: {
        operationId: 'getBlogIndex',
        ...documentGet('Blog index'),
      },
    },
    '/blog/{slug}/': {
      get: {
        ...documentGet(
          'Blog post HTML or negotiated Markdown for a published slug',
        ),
        operationId: 'getBlogPost',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description:
              'Published post id (directory slug), not a page number.',
            schema: { type: 'string' },
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      ProblemDetails: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        additionalProperties: true,
        required: [
          'type',
          'title',
          'status',
          'detail',
          'instance',
          'code',
          'resolution',
        ],
        properties: {
          type: {
            type: 'string',
            format: 'uri',
            description: 'RFC 9457 type URI; generic errors use about:blank',
          },
          title: { type: 'string' },
          status: { type: 'integer' },
          detail: { type: 'string' },
          instance: { type: 'string' },
          code: { type: 'string' },
          resolution: { type: 'string' },
        },
      },
    },
  },
} as const

export function GET() {
  return new Response(JSON.stringify(OPENAPI), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
