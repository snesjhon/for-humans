import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { InterviewPrepItem } from './types';

const SCENARIOS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'interview-prep',
  'scenarios',
);

export interface ScenarioContent {
  slug: string;
  content: string;
  promptContent: string | null;
}

export function getScenarioContent(slug: string): ScenarioContent | null {
  const briefPath = path.join(SCENARIOS_DIR, slug, 'brief.md');
  const walkthroughPath = path.join(SCENARIOS_DIR, slug, 'walkthrough.md');
  const promptPath = path.join(SCENARIOS_DIR, slug, 'prompt.md');

  const hasBrief = fs.existsSync(briefPath);
  const hasWalkthrough = fs.existsSync(walkthroughPath);

  if (!hasBrief && !hasWalkthrough) return null;

  const parts: string[] = [];
  if (hasBrief) parts.push(fs.readFileSync(briefPath, 'utf-8'));
  if (hasWalkthrough) parts.push(fs.readFileSync(walkthroughPath, 'utf-8'));

  return {
    slug,
    content: parts.join('\n\n---\n\n'),
    promptContent: fs.existsSync(promptPath)
      ? fs.readFileSync(promptPath, 'utf-8')
      : null,
  };
}

export function getAllScenarioSlugs(): string[] {
  if (!fs.existsSync(SCENARIOS_DIR)) return [];

  return fs
    .readdirSync(SCENARIOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) => {
      const dir = path.join(SCENARIOS_DIR, entry.name);
      return (
        fs.existsSync(path.join(dir, 'brief.md')) ||
        fs.existsSync(path.join(dir, 'walkthrough.md'))
      );
    })
    .map((entry) => entry.name);
}

export function getItemForScenario(slug: string): InterviewPrepItem | null {
  for (const phase of JOURNEY) {
    for (const item of phase.items) {
      if (item.scenarioSlug === slug) return item;
    }
  }
  return null;
}
