export interface Heading {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`#[\]]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n')
  const headings: Heading[] = []
  const seen = new Map<string, number>()

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (!match) continue
    const level = match[1].length
    const rawText = match[2].replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim()
    let id = slugify(rawText)
    const count = seen.get(id) ?? 0
    if (count > 0) id = `${id}-${count}`
    seen.set(id, count + 1)
    headings.push({ id, text: rawText, level })
  }

  return headings
}
