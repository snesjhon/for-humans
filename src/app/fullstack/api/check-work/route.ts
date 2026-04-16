import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import path from 'path'
import fs from 'fs'
import { parseFilesFromPrompt, readChessAppFiles } from '@/lib/fullstack/checkWork'

const SCENARIOS_DIR = path.join(process.cwd(), 'app', 'scenarios')

export async function POST(req: NextRequest) {
  const { slug, projectPath, apiKey } = await req.json()

  if (!slug || !projectPath || !apiKey) {
    return NextResponse.json({ error: 'Missing slug, projectPath, or apiKey' }, { status: 400 })
  }

  const promptPath = path.join(SCENARIOS_DIR, slug, 'prompt.md')
  if (!fs.existsSync(promptPath)) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
  }

  const promptContent = fs.readFileSync(promptPath, 'utf-8')
  const filesToCheck = parseFilesFromPrompt(promptContent)
  const fileContents = readChessAppFiles(projectPath, filesToCheck)

  const filesBlock = Object.entries(fileContents)
    .map(([rel, content]) => `### ${rel}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n\n')

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: promptContent,
    messages: [
      {
        role: 'user',
        content: `Here are the relevant files from my project:\n\n${filesBlock}\n\nPlease evaluate my work.`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  let result: { covered: string[]; missed: string[]; followUp: string | null }
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    result = jsonMatch ? JSON.parse(jsonMatch[0]) : { covered: [], missed: [], followUp: raw }
  } catch {
    result = { covered: [], missed: [], followUp: raw }
  }

  return NextResponse.json(result)
}
