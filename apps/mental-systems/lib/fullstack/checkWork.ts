import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function parseFilesFromPrompt(promptContent: string): string[] {
  const { data } = matter(promptContent)
  if (!data.files || !Array.isArray(data.files)) return []
  return data.files as string[]
}

export function readChessAppFiles(
  projectPath: string,
  relativeFiles: string[]
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const rel of relativeFiles) {
    const abs = path.join(projectPath, rel)
    if (fs.existsSync(abs)) {
      result[rel] = fs.readFileSync(abs, 'utf-8')
    } else {
      result[rel] = '(file not found)'
    }
  }
  return result
}

export function hashFileMtimes(
  projectPath: string,
  relativeFiles: string[]
): string {
  const mtimes = relativeFiles.map((rel) => {
    const abs = path.join(projectPath, rel)
    try {
      return `${rel}:${fs.statSync(abs).mtimeMs}`
    } catch {
      return `${rel}:missing`
    }
  })
  return mtimes.join('|')
}
