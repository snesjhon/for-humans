import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JOURNEY } from './journey';
import type { FrontendJourneySection, Phase } from './types';

const FUNDAMENTALS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'fundamentals',
);

export interface FundamentalsGuide {
  slug: string;
  filename: string;
  title: string;
  content: string;
  sections: string[];
}

function extractTitle(content: string, fallback = ''): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : fallback;
}

function extractH2Sections(content: string): string[] {
  const matches = content.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches).map((match) => match[1]);
}

export function getFundamentalsGuide(slug: string): FundamentalsGuide | null {
  const filename = `${slug}-fundamentals.md`;
  const filePath = path.join(FUNDAMENTALS_DIR, slug, filename);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  return {
    slug,
    filename,
    title: extractTitle(content, slug.replace(/-/g, ' ')),
    content,
    sections: extractH2Sections(content),
  };
}

export function getFundamentalsStepNumbers(slug: string): number[] {
  const dir = path.join(FUNDAMENTALS_DIR, slug);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  const stepNums = files
    .filter((file) => /^step\d+-exercise\d+-problem\.(ts|tsx|html)$/.test(file))
    .map((file) => parseInt(file.match(/^step(\d+)/)?.[1] ?? '0', 10))
    .filter((num) => num > 0);

  return Array.from(new Set(stepNums)).sort((left, right) => left - right);
}

export function getAllFundamentalsSlugs(): string[] {
  if (!fs.existsSync(FUNDAMENTALS_DIR)) return [];

  return fs
    .readdirSync(FUNDAMENTALS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) =>
      fs.existsSync(
        path.join(
          FUNDAMENTALS_DIR,
          entry.name,
          `${entry.name}-fundamentals.md`,
        ),
      ),
    )
    .map((entry) => entry.name);
}

export function getSectionForFundamentals(
  slug: string,
): { phase: Phase; section: FrontendJourneySection } | null {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      if (section.fundamentalsSlug === slug) return { phase, section };
      if (section.additionalFundamentals?.some((f) => f.slug === slug))
        return { phase, section };
    }
  }

  return null;
}

export function getPrecedingSection(
  slug: string,
): FrontendJourneySection | null {
  for (const phase of JOURNEY) {
    for (let index = 0; index < phase.sections.length; index += 1) {
      const section = phase.sections[index];
      if (
        section.fundamentalsSlug === slug ||
        section.additionalFundamentals?.some((fundamentals) => fundamentals.slug === slug)
      ) {
        for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
          if (phase.sections[cursor].fundamentalsSlug) return phase.sections[cursor];
        }

        const phaseIdx = JOURNEY.indexOf(phase);
        for (let prevPhaseIdx = phaseIdx - 1; prevPhaseIdx >= 0; prevPhaseIdx -= 1) {
          const prevPhase = JOURNEY[prevPhaseIdx];
          for (
            let sectionIdx = prevPhase.sections.length - 1;
            sectionIdx >= 0;
            sectionIdx -= 1
          ) {
            if (prevPhase.sections[sectionIdx].fundamentalsSlug) {
              return prevPhase.sections[sectionIdx];
            }
          }
        }

        return null;
      }
    }
  }

  return null;
}
