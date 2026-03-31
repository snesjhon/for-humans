import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { JOURNEY } from './journey'
import type { JourneySection, Phase } from './types'

const FUNDAMENTALS_DIR = path.join(process.cwd(), 'app', 'fundamentals')

export interface FundamentalsGuide {
  slug: string
  title: string
  content: string        // parsed markdown content
  levelPrompts: string[] // per-evaluator system prompts (index matches :::evaluator fence order)
}

function parseLevelPrompts(raw: string): string[] {
  const levelRe = /^## Level \d+:/gm
  const starts: number[] = []
  let m: RegExpExecArray | null

  levelRe.lastIndex = 0
  while ((m = levelRe.exec(raw)) !== null) {
    starts.push(m.index)
  }

  if (starts.length === 0) return [raw.trim()]

  return starts.map((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1] : raw.length
    return raw.slice(start, end).trim()
  })
}

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1] : fallback
}

export function getFundamentalsGuide(slug: string): FundamentalsGuide | null {
  const dir = path.join(FUNDAMENTALS_DIR, slug)
  const guidePath = path.join(dir, `${slug}-fundamentals.md`)
  const promptPath = path.join(dir, 'prompt.md')

  if (!fs.existsSync(guidePath) || !fs.existsSync(promptPath)) return null

  const { content, data } = matter(fs.readFileSync(guidePath, 'utf-8'))
  const promptRaw = fs.readFileSync(promptPath, 'utf-8')
  const levelPrompts = parseLevelPrompts(promptRaw)

  return {
    slug,
    title: extractTitle(content, slug.replace(/-/g, ' ')),
    content,
    levelPrompts,
  }
}

export function getAllFundamentalsSlugs(): string[] {
  if (!fs.existsSync(FUNDAMENTALS_DIR)) return []

  return fs
    .readdirSync(FUNDAMENTALS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== '[slug]')
    .filter(entry =>
      fs.existsSync(path.join(FUNDAMENTALS_DIR, entry.name, `${entry.name}-fundamentals.md`))
    )
    .map(entry => entry.name)
}

export function getSectionForFundamentals(slug: string): { phase: Phase; section: JourneySection } | null {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      if (section.fundamentalsSlug === slug) return { phase, section }
    }
  }
  return null
}

export function getPrecedingSection(slug: string): JourneySection | null {
  for (const phase of JOURNEY) {
    for (let i = 0; i < phase.sections.length; i++) {
      if (phase.sections[i].fundamentalsSlug === slug) {
        // Find the previous section that has a fundamentalsSlug
        for (let j = i - 1; j >= 0; j--) {
          if (phase.sections[j].fundamentalsSlug) return phase.sections[j]
        }
        // Check previous phases
        const phaseIdx = JOURNEY.indexOf(phase)
        for (let pi = phaseIdx - 1; pi >= 0; pi--) {
          const prevPhase = JOURNEY[pi]
          for (let si = prevPhase.sections.length - 1; si >= 0; si--) {
            if (prevPhase.sections[si].fundamentalsSlug) return prevPhase.sections[si]
          }
        }
        return null
      }
    }
  }
  return null
}
