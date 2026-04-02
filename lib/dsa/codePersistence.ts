export type DsaCodeBase = 'problems' | 'fundamentals'

export interface DsaCodeSnippetRecord {
  snippet: string
  updatedAt: string
}

const STORAGE_VERSION = 2
const HARNESS_LINE_PATTERNS = [
  /^\/\/\s*Tests\b/,
  /^\/\/\s*---Tests\b/,
  /^\/\/\s*───\s*Tests\b/,
  /^test\(/,
  /^runTest\(/,
  /^runCase\(/,
]
const HELPER_START_PATTERNS = ['---Helpers', '─── Helpers']
const HELPER_END_PATTERNS = ['---End Helpers', '─── End Helpers']

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
    if (HELPER_END_PATTERNS.some((pattern) => line.includes(pattern))) {
      if (openStart !== null) {
        ranges.push({ start: openStart, end: i + 1 })
        openStart = null
      }
      continue
    }

    if (HELPER_START_PATTERNS.some((pattern) => line.includes(pattern))) {
      if (openStart !== null) {
        ranges.push({ start: openStart, end: i })
      }
      openStart = i
    }
  }

  if (openStart !== null) {
    ranges.push({ start: openStart, end: lines.length })
  }
  return ranges.sort((a, b) => a.start - b.start)
}

export function normalizeDsaEditorContent(content: string): string {
  return content
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
