import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Problem } from './types'
import { PROBLEM_TITLES as TITLE_MAP } from './titles'

const STUDY_GUIDES_DIR = path.join(process.cwd(), 'app', 'dsa', 'problems')

function extractIdFromSlug(slug: string): string | null {
  const match = slug.match(/^(\d+)-/)
  return match ? match[1].padStart(3, '0') : null
}

let _problems: Problem[] | null = null

export function getAllProblems(): Problem[] {
  if (_problems) return _problems

  const problems: Problem[] = []

  if (!fs.existsSync(STUDY_GUIDES_DIR)) {
    console.warn('problems directory not found at', STUDY_GUIDES_DIR)
    return []
  }

  const entries = fs.readdirSync(STUDY_GUIDES_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const id = extractIdFromSlug(entry.name)
    if (!id) continue

    const dirPath = path.join(STUDY_GUIDES_DIR, entry.name)
    const files = fs.readdirSync(dirPath)

    const hasMentalModel = files.includes('mental-model.md')

    const problem: Problem = {
      id,
      title: TITLE_MAP[id] || entry.name.replace(/^\d+-/, '').replace(/-/g, ' '),
      hasMentalModel,
      slug: entry.name,
      files: {
        mentalModel: hasMentalModel ? path.join(dirPath, 'mental-model.md') : undefined,
      },
    }

    problems.push(problem)
  }

  problems.sort((a, b) => parseInt(a.id) - parseInt(b.id))
  _problems = problems
  return problems
}

export function getProblemById(id: string): Problem | undefined {
  return getAllProblems().find(p => p.id === id)
}

export function readMarkdownFile(filePath: string): { content: string; data: Record<string, unknown> } {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(raw)
  return { content, data }
}
