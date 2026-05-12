import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseFilesFromPrompt, readProjectFiles } from '@/lib/frontend/checkWork';

const BUILD_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'build',
);

export async function POST(req: NextRequest) {
  const { slug, projectPath } = await req.json();

  if (!slug || !projectPath) {
    return NextResponse.json(
      { error: 'Missing slug or projectPath' },
      { status: 400 },
    );
  }

  const promptPath = path.join(BUILD_DIR, slug, 'prompt.md');
  if (!fs.existsSync(promptPath)) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 });
  }

  const promptContent = fs.readFileSync(promptPath, 'utf-8');
  const filesToCheck = parseFilesFromPrompt(promptContent);
  const fileContents = readProjectFiles(projectPath, filesToCheck);

  const filesBlock = Object.entries(fileContents)
    .map(([rel, content]) => `### ${rel}\n\`\`\`\n${content}\n\`\`\``)
    .join('\n\n');

  return NextResponse.json({ filesBlock, promptContent });
}
