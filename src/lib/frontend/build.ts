import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { FrontendJourneySection } from './types';

const BUILD_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'build',
);

export interface BuildContent {
  slug: string;
  brief: string;
  walkthrough: string | null;
  promptContent: string | null;
}

export function getBuildContent(slug: string): BuildContent | null {
  const briefPath = path.join(BUILD_DIR, slug, 'brief.md');
  const walkthroughPath = path.join(BUILD_DIR, slug, 'walkthrough.md');
  const promptPath = path.join(BUILD_DIR, slug, 'prompt.md');

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

export function getAllBuildSlugs(): string[] {
  if (!fs.existsSync(BUILD_DIR)) return [];

  return fs
    .readdirSync(BUILD_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) => {
      const dir = path.join(BUILD_DIR, entry.name);
      return (
        fs.existsSync(path.join(dir, 'brief.md')) ||
        fs.existsSync(path.join(dir, 'walkthrough.md'))
      );
    })
    .map((entry) => entry.name);
}

export function getSectionForBuild(slug: string): FrontendJourneySection | null {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      if (section.builds?.some((build) => build.slug === slug)) return section;
    }
  }
  return null;
}

export function getBuildRef(slug: string) {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      const ref = section.builds?.find((build) => build.slug === slug);
      if (ref) return ref;
    }
  }
  return null;
}
