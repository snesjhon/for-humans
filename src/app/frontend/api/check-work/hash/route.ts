import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { hashFileMtimes, parseFilesFromPrompt } from '@/lib/fullstack/checkWork';

const SCENARIOS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'scenarios',
);

export async function POST(req: NextRequest) {
  const { slug, projectPath } = await req.json();

  if (!slug || !projectPath) {
    return NextResponse.json(
      { error: 'Missing slug or projectPath' },
      { status: 400 },
    );
  }

  const promptPath = path.join(SCENARIOS_DIR, slug, 'prompt.md');
  if (!fs.existsSync(promptPath)) {
    return NextResponse.json({ hash: '' });
  }

  const promptContent = fs.readFileSync(promptPath, 'utf-8');
  const filesToCheck = parseFilesFromPrompt(promptContent);
  const hash = hashFileMtimes(projectPath, filesToCheck);

  return NextResponse.json({ hash });
}
