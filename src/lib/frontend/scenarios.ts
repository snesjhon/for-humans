import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { FrontendJourneySection } from './types';
import type { Phase } from './types';
import type { ConceptRef as ScenarioRef } from './types';

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

function getSectionById(
  sectionId: FrontendJourneySection['id'],
): { phase: Phase; section: FrontendJourneySection } | null {
  for (const phase of JOURNEY) {
    const section = phase.sections.find((entry) => entry.id === sectionId);
    if (section) return { phase, section };
  }

  return null;
}

function getScenarioEntries(): Array<
  ScenarioRef & { sectionId: FrontendJourneySection['id']; phase: Phase }
> {
  const entries: Array<
    ScenarioRef & { sectionId: FrontendJourneySection['id']; phase: Phase }
  > = [];

  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      for (const scenario of section.concepts ?? []) {
        entries.push({ ...scenario, sectionId: section.id, phase });
      }
    }
  }

  return entries;
}

export function getScenarioRef(
  slug: string,
): (ScenarioRef & { sectionId: FrontendJourneySection['id'] }) | null {
  const entry = getScenarioEntries().find((scenario) => scenario.slug === slug);
  if (!entry) return null;

  const { phase: _phase, ...ref } = entry;
  return ref;
}

export function getSectionForScenario(slug: string): FrontendJourneySection | null {
  const ref = getScenarioRef(slug);
  if (!ref) return null;

  return getSectionById(ref.sectionId)?.section ?? null;
}

export function getScenarioMatch(
  slug: string,
): {
  ref: ScenarioRef & { sectionId: FrontendJourneySection['id'] };
  phase: Phase;
  section: FrontendJourneySection;
} | null {
  const ref = getScenarioRef(slug);
  if (!ref) return null;

  const match = getSectionById(ref.sectionId);
  if (!match) return null;

  return { ref, ...match };
}
