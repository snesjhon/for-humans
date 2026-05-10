import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { FrontendJourneySection } from './types';

const BUILDING_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'building',
);

export interface BuildingContent {
  slug: string;
  brief: string;
  walkthrough: string | null;
  promptContent: string | null;
}

export function getBuildingContent(slug: string): BuildingContent | null {
  const briefPath = path.join(BUILDING_DIR, slug, 'brief.md');
  const walkthroughPath = path.join(BUILDING_DIR, slug, 'walkthrough.md');
  const promptPath = path.join(BUILDING_DIR, slug, 'prompt.md');

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

export function getAllBuildingSlugs(): string[] {
  if (!fs.existsSync(BUILDING_DIR)) return [];

  return fs
    .readdirSync(BUILDING_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) => {
      const dir = path.join(BUILDING_DIR, entry.name);
      return (
        fs.existsSync(path.join(dir, 'brief.md')) ||
        fs.existsSync(path.join(dir, 'walkthrough.md'))
      );
    })
    .map((entry) => entry.name);
}

export function getSectionForBuilding(slug: string): FrontendJourneySection | null {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      if (section.builds?.some((building) => building.slug === slug)) return section;
    }
  }
  return null;
}

export function getBuildingRef(slug: string) {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      const ref = section.builds?.find((building) => building.slug === slug);
      if (ref) return ref;
    }
  }
  return null;
}
