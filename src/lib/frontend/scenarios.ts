import fs from 'fs';
import path from 'path';
import type { FrontendJourneySection } from './types';

const SCENARIOS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'scenarios',
);

export interface ScenarioContent {
  slug: string;
  brief: string;
  walkthrough: string | null;
  promptContent: string | null;
}

export function getScenarioContent(slug: string): ScenarioContent | null {
  const briefPath = path.join(SCENARIOS_DIR, slug, 'brief.md');
  const walkthroughPath = path.join(SCENARIOS_DIR, slug, 'walkthrough.md');
  const promptPath = path.join(SCENARIOS_DIR, slug, 'prompt.md');

  const hasBrief = fs.existsSync(briefPath);
  const hasWalkthrough = fs.existsSync(walkthroughPath);

  if (!hasBrief && !hasWalkthrough) return null;

  return {
    slug,
    brief: hasBrief ? fs.readFileSync(briefPath, 'utf-8') : '',
    walkthrough: hasWalkthrough ? fs.readFileSync(walkthroughPath, 'utf-8') : null,
    promptContent: fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf-8') : null,
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

export function getSectionForScenario(_slug: string): FrontendJourneySection | null {
  return null;
}

export function getScenarioRef(
  _slug: string,
): { slug: string; label: string; blurb: string } | null {
  return null;
}
