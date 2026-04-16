import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JOURNEY } from './journey';

const FUNDAMENTALS_DIR = path.join(process.cwd(), 'app', 'dsa', 'fundamentals');

export interface FundamentalsGuide {
  slug: string; // "binary-trees"
  filename: string; // "binary-trees-fundamentals.md"
  title: string; // "Binary Trees - Fundamentals"
  content: string;
  sections: string[]; // top-level ## headings
}

function extractTitle(content: string, fallback = ''): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : fallback;
}

function extractH2Sections(content: string): string[] {
  const matches = content.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches).map((m) => m[1]);
}

export function getFundamentalsGuide(slug: string): FundamentalsGuide | null {
  const filename = `${slug}-fundamentals.md`;
  const filePath = path.join(FUNDAMENTALS_DIR, slug, filename);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');

  // although we're not using front-matter currently, let's save this for now as I'm not sure
  // if we'll develop this a bit later
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
    .filter((f) => /^step\d+-exercise\d+-problem\.ts$/.test(f))
    .map((f) => parseInt(f.match(/^step(\d+)/)?.[1] ?? '0'))
    .filter((n) => n > 0);
  return Array.from(new Set(stepNums)).sort((a, b) => a - b);
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

// Find which journey section links to this fundamentals slug
export function getSectionForFundamentals(slug: string) {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      if (section.fundamentalsSlug === slug) {
        return { phase, section };
      }
    }
  }
  return null;
}

// Return the section that immediately precedes the one linked to this slug
export function getPrecedingSection(slug: string) {
  const allSections = JOURNEY.flatMap((phase) => phase.sections);
  const idx = allSections.findIndex((s) => s.fundamentalsSlug === slug);
  if (idx <= 0) return null;
  return allSections[idx - 1];
}
