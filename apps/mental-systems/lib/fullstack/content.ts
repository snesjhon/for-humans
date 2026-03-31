import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SCENARIOS_DIR = path.join(process.cwd(), 'app', 'scenarios')

export interface ScenarioContent {
  slug: string
  brief: string
  promptContent: string
  walkthrough?: string
}

export function loadScenario(slug: string): ScenarioContent | null {
  const dir = path.join(SCENARIOS_DIR, slug)
  const briefPath = path.join(dir, 'brief.md')
  const promptPath = path.join(dir, 'prompt.md')

  if (!fs.existsSync(briefPath) || !fs.existsSync(promptPath)) return null

  const { content: brief } = matter(fs.readFileSync(briefPath, 'utf-8'))
  const promptContent = fs.readFileSync(promptPath, 'utf-8')

  const walkthroughPath = path.join(dir, 'walkthrough.md')
  let walkthrough: string | undefined
  if (fs.existsSync(walkthroughPath)) {
    walkthrough = matter(fs.readFileSync(walkthroughPath, 'utf-8')).content
  }

  return { slug, brief, promptContent, walkthrough }
}

export function getAllScenarioSlugsFromDisk(): string[] {
  if (!fs.existsSync(SCENARIOS_DIR)) return []
  return fs
    .readdirSync(SCENARIOS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '[slug]')
    .filter((e) => fs.existsSync(path.join(SCENARIOS_DIR, e.name, 'brief.md')))
    .map((e) => e.name)
}
