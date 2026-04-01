export type DsaCodeBase = 'problems' | 'fundamentals'

export interface DsaCodeSnippetRecord {
  snippet: string
  updatedAt: string
}

const STORAGE_VERSION = 2
const HELPERS_SENTINEL =
  '// ─── Helpers ──────────────────────────────────────────────────────────────────'
const HELPERS_END_SENTINEL =
  '// ─── End Helpers ──────────────────────────────────────────────────────────────'
const HARNESS_LINE_PATTERNS = [
  /^\/\/\s*Tests\b/,
  /^test\(/,
  /^runTest\(/,
  /^runCase\(/,
]

type LineRange = { start: number; end: number }

export function buildDsaCodeStorageKey(
  base: DsaCodeBase,
  slug: string,
  file: string,
): string {
  return `dfh-code:v2:${base}:${slug}:${file}`
}

function getEditableBoundaryLines(content: string) {
  const lines = content.match(/[^\n]*\n|[^\n]+$/g) ?? []
  const helperRanges = getHelperRanges(lines)
  const isHelperLine = (index: number) =>
    helperRanges.some((range) => index >= range.start && index < range.end)

  let startLine = 0
  while (startLine < lines.length) {
    const trimmed = lines[startLine].trim()
    if (isHelperLine(startLine)) {
      startLine += 1
      continue
    }
    if (trimmed && !trimmed.startsWith('//')) break
    startLine += 1
  }

  let endLine = lines.length
  for (let i = startLine; i < lines.length; i += 1) {
    if (isHelperLine(i)) continue
    const trimmed = lines[i].trim()
    if (HARNESS_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
      endLine = i
      break
    }
  }

  return { lines, startLine, endLine }
}

function getHelperRanges(lines: string[]): LineRange[] {
  const ranges: LineRange[] = []
  let openStart: number | null = null

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.includes('─── End Helpers')) {
      if (openStart !== null) {
        ranges.push({ start: openStart, end: i + 1 })
        openStart = null
      }
      continue
    }

    if (line.includes('─── Helpers')) {
      if (openStart !== null) {
        ranges.push({ start: openStart, end: i })
      }
      openStart = i
    }
  }

  if (openStart !== null) {
    ranges.push({ start: openStart, end: lines.length })
  }

  const firstCodeLine = lines.findIndex((line) => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('//')
  })
  const firstFunctionLine = lines.findIndex((line) =>
    /^function\s+\w+\(/.test(line.trim()),
  )
  const hasPreludeHelper =
    firstCodeLine >= 0 &&
    firstFunctionLine > firstCodeLine &&
    /^class\s+ListNode\b/.test(lines[firstCodeLine].trim()) &&
    !ranges.some(
      (range) => firstCodeLine >= range.start && firstCodeLine < range.end,
    )

  if (hasPreludeHelper) {
    ranges.unshift({ start: firstCodeLine, end: firstFunctionLine })
  }

  return ranges.sort((a, b) => a.start - b.start)
}

export function normalizeDsaEditorContent(content: string): string {
  const lines = content.match(/[^\n]*\n|[^\n]+$/g) ?? []
  const firstCodeLine = lines.findIndex((line) => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('//')
  })
  const firstFunctionLine = lines.findIndex((line) =>
    /^function\s+\w+\(/.test(line.trim()),
  )

  if (
    firstCodeLine < 0 ||
    firstFunctionLine <= firstCodeLine ||
    !/^class\s+ListNode\b/.test(lines[firstCodeLine].trim())
  ) {
    return content
  }

  const alreadyWrapped =
    lines[firstCodeLine - 1]?.includes('─── Helpers') &&
    lines[firstFunctionLine]?.includes('─── End Helpers')

  if (alreadyWrapped) return content

  return [
    ...lines.slice(0, firstCodeLine),
    `${HELPERS_SENTINEL}\n`,
    `\n`,
    ...lines.slice(firstCodeLine, firstFunctionLine),
    `${HELPERS_END_SENTINEL}\n`,
    `\n`,
    ...lines.slice(firstFunctionLine),
  ].join('')
}

export function extractEditableSnippet(content: string): string {
  const { lines, startLine, endLine } = getEditableBoundaryLines(content)
  return lines.slice(startLine, endLine).join('').trimEnd()
}

export function applyEditableSnippet(
  content: string,
  snippet: string | null | undefined,
): string {
  if (!snippet?.trim()) return content

  const { lines, startLine, endLine } = getEditableBoundaryLines(content)
  const prefix = lines.slice(0, startLine).join('')
  const suffix = lines.slice(endLine).join('')
  const normalizedSnippet = snippet.replace(/\s+$/, '')

  return `${prefix}${normalizedSnippet}\n\n${suffix.replace(/^\n+/, '')}`
}

export function parseStoredSnippet(
  raw: string | null,
): DsaCodeSnippetRecord | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as
      | { version?: number; snippet?: unknown; updatedAt?: unknown }
      | null

    if (
      parsed &&
      parsed.version === STORAGE_VERSION &&
      typeof parsed.snippet === 'string' &&
      typeof parsed.updatedAt === 'string'
    ) {
      return {
        snippet: parsed.snippet,
        updatedAt: parsed.updatedAt,
      }
    }
  } catch {
    return {
      snippet: extractEditableSnippet(raw),
      updatedAt: new Date(0).toISOString(),
    }
  }

  return null
}

export function serializeStoredSnippet(record: DsaCodeSnippetRecord): string {
  return JSON.stringify({
    version: STORAGE_VERSION,
    snippet: record.snippet,
    updatedAt: record.updatedAt,
  })
}
