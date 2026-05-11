import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { FrontendJourneySection } from './types';
import type { Phase } from './types';
import type { ConceptRef } from './types';

const CONCEPTS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'concepts',
);

export interface ConceptContent {
  slug: string;
  concept: string;
  promptContent: string | null;
}

export function getConceptContent(slug: string): ConceptContent | null {
  const conceptPath = path.join(CONCEPTS_DIR, slug, 'concept.md');

  if (!fs.existsSync(conceptPath)) return null;

  const promptPath = path.join(CONCEPTS_DIR, slug, 'prompt.md');

  return {
    slug,
    concept: fs.readFileSync(conceptPath, 'utf-8'),
    promptContent: fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf-8') : null,
  };
}

export function getAllConceptSlugs(): string[] {
  if (!fs.existsSync(CONCEPTS_DIR)) return [];

  return fs
    .readdirSync(CONCEPTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) => {
      const dir = path.join(CONCEPTS_DIR, entry.name);
      return fs.existsSync(path.join(dir, 'concept.md'));
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

function getConceptEntries(): Array<
  ConceptRef & { sectionId: FrontendJourneySection['id']; phase: Phase }
> {
  const entries: Array<
    ConceptRef & { sectionId: FrontendJourneySection['id']; phase: Phase }
  > = [];

  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      for (const concept of section.concepts ?? []) {
        entries.push({ ...concept, sectionId: section.id, phase });
      }
    }
  }

  return entries;
}

export function getConceptRef(
  slug: string,
): (ConceptRef & { sectionId: FrontendJourneySection['id'] }) | null {
  const entry = getConceptEntries().find((concept) => concept.slug === slug);
  if (!entry) return null;

  const { phase: _phase, ...ref } = entry;
  return ref;
}

export function getSectionForConcept(slug: string): FrontendJourneySection | null {
  const ref = getConceptRef(slug);
  if (!ref) return null;

  return getSectionById(ref.sectionId)?.section ?? null;
}

export function getConceptMatch(
  slug: string,
): {
  ref: ConceptRef & { sectionId: FrontendJourneySection['id'] };
  phase: Phase;
  section: FrontendJourneySection;
} | null {
  const ref = getConceptRef(slug);
  if (!ref) return null;

  const match = getSectionById(ref.sectionId);
  if (!match) return null;

  return { ref, ...match };
}
