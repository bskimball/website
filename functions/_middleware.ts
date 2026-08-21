import { handleAgentRequest } from '../src/lib/agent/negotiate.ts'

interface PagesContext {
  request: Request
  next: () => Promise<Response>
  env: { ASSETS: { fetch: (request: Request) => Promise<Response> } }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  return handleAgentRequest({
    request: context.request,
    next: () => context.next(),
    fetchAsset: (request) => context.env.ASSETS.fetch(request),
  })
}
