export const PRODUCES = ['text/html', 'text/markdown'] as const

export type ProducedType = (typeof PRODUCES)[number]

type AcceptEntry = { type: string; q: number; specificity: number }

/** RFC 9110 qvalue: 0[.ddd] or 1[.000] */
function parseQValue(raw: string): number | null {
  if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(raw)) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw
        .trim()
        .split(';')
        .map((s) => s.trim())
      const type = (parts[0] ?? '').toLowerCase()
      let q = 1
      let invalid = false
      for (const param of parts.slice(1)) {
        const eq = param.indexOf('=')
        if (eq === -1) continue
        const name = param.slice(0, eq).trim().toLowerCase()
        const value = param.slice(eq + 1).trim()
        if (name === 'q') {
          const parsed = parseQValue(value)
          if (parsed === null) {
            invalid = true
            break
          }
          q = parsed
        }
      }
      if (invalid || !type) return null
      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2
      return { type, q, specificity }
    })
    .filter((entry): entry is AcceptEntry => entry !== null)
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') return true
  if (entry.type.endsWith('/*')) {
    return candidate.startsWith(entry.type.slice(0, -1))
  }
  return entry.type === candidate
}

/**
 * RFC 9110 §12.5.1 negotiation used by acceptmarkdown.com.
 * Returns null when every produced type is explicitly rejected (q=0).
 */
export function preferredType(header: string | null): ProducedType | null {
  if (!header || header.trim() === '') return PRODUCES[0]

  const entries = parseAccept(header)
  if (entries.length === 0) return PRODUCES[0]

  let best: ProducedType | null = null
  let bestQ = -1
  let bestPosition = Infinity

  for (const candidate of PRODUCES) {
    let matched: AcceptEntry | null = null
    let matchedPosition = Infinity
    for (let idx = 0; idx < entries.length; idx++) {
      const entry = entries[idx]
      if (!matches(entry, candidate)) continue
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry
        matchedPosition = idx
      }
    }
    if (matched === null) continue
    if (matched.q <= 0) continue
    if (
      matched.q > bestQ ||
      (matched.q === bestQ && matchedPosition < bestPosition)
    ) {
      bestQ = matched.q
      bestPosition = matchedPosition
      best = candidate
    }
  }

  return best
}

export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get('Vary')
  const tokens = existing
    ? existing
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const lower = tokens.map((t) => t.toLowerCase())
  if (!lower.includes('accept')) tokens.push('Accept')
  if (!lower.includes('accept-encoding')) tokens.push('Accept-Encoding')
  headers.set('Vary', tokens.join(', '))
}

export function prefersMarkdown(header: string | null): boolean {
  return preferredType(header) === 'text/markdown'
}

/** True when the client named text/html with q > 0 (not only a wildcard). */
export function explicitlyPrefersHtml(header: string | null): boolean {
  if (!header || header.trim() === '') return false
  return parseAccept(header).some(
    (entry) => entry.type === 'text/html' && entry.q > 0,
  )
}
