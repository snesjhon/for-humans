import fs from 'fs';
import path from 'path';
import { JOURNEY } from './journey';
import type { InterviewPrepItem } from './types';

const FUNDAMENTALS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'interview-prep',
  'fundamentals',
);

const SINGLE_FENCE =
  /^:::stackblitz\{file="([^"]+)" step=(\d+) total=(\d+) solution="([^"]+)"\}$/gm;

function isSafeTsFilename(file: string) {
  return /\.tsx?$/.test(file) && !file.includes('/') && !file.includes('..');
}

function collectStackBlitzFiles(content: string): string[] {
  const files = new Set<string>();
  SINGLE_FENCE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SINGLE_FENCE.exec(content)) !== null) {
    if (isSafeTsFilename(match[1])) files.add(match[1]);
    if (isSafeTsFilename(match[4])) files.add(match[4]);
  }

  return Array.from(files);
}

export interface FundamentalsGuide {
  slug: string;
  content: string;
}

export function getFundamentalsGuide(slug: string): FundamentalsGuide | null {
  const filePath = path.join(FUNDAMENTALS_DIR, slug, `${slug}-fundamentals.md`);
  if (!fs.existsSync(filePath)) return null;

  return {
    slug,
    content: fs.readFileSync(filePath, 'utf-8'),
  };
}

export function getFundamentalsStepNumbers(slug: string): number[] {
  const dir = path.join(FUNDAMENTALS_DIR, slug);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  const stepNums = files
    .filter((file) => /^step\d+-exercise\d+-problem\.ts$/.test(file))
    .map((file) => parseInt(file.match(/^step(\d+)/)?.[1] ?? '0', 10))
    .filter((num) => num > 0);

  return Array.from(new Set(stepNums)).sort((a, b) => a - b);
}

export function getAllFundamentalsSlugs(): string[] {
  if (!fs.existsSync(FUNDAMENTALS_DIR)) return [];

  return fs
    .readdirSync(FUNDAMENTALS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) =>
      fs.existsSync(
        path.join(FUNDAMENTALS_DIR, entry.name, `${entry.name}-fundamentals.md`),
      ),
    )
    .map((entry) => entry.name);
}

export function getItemForFundamentals(slug: string): InterviewPrepItem | null {
  for (const phase of JOURNEY) {
    for (const item of phase.items) {
      if (item.fundamentalsSlug === slug) return item;
    }
  }
  return null;
}

export function loadReferencedCodeFiles(
  content: string,
  slug: string,
): Record<string, string> {
  const dir = path.join(FUNDAMENTALS_DIR, slug);
  const files = collectStackBlitzFiles(content);

  return Object.fromEntries(
    files.flatMap((file) => {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) return [];
      return [[file, fs.readFileSync(filePath, 'utf-8')]];
    }),
  );
}
