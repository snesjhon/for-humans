import fs from 'fs';
import path from 'path';

type FrontendStackBlitzSingleEmbed = {
  type: 'single';
  file: string;
  solution: string;
};

type FrontendStackBlitzMultiEmbed = {
  type: 'multi';
  exercises: string[];
  solutions: string[];
};

type FrontendStackBlitzEmbed =
  | FrontendStackBlitzSingleEmbed
  | FrontendStackBlitzMultiEmbed;

const SINGLE_FENCE =
  /^:::stackblitz\{file="([^"]+)" step=(\d+) total=(\d+) solution="([^"]+)"\}$/gm;
const MULTI_FENCE =
  /^:::stackblitz\{step=(\d+) total=(\d+) exercises="([^"]+)" solutions="([^"]+)"\}$/gm;

function isSafeTsFilename(file: string) {
  return /\.tsx?$/.test(file) && !file.includes('/') && !file.includes('..');
}

function extractStackBlitzEmbeds(content: string): FrontendStackBlitzEmbed[] {
  const embeds: FrontendStackBlitzEmbed[] = [];

  SINGLE_FENCE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SINGLE_FENCE.exec(content)) !== null) {
    embeds.push({
      type: 'single',
      file: match[1],
      solution: match[4],
    });
  }

  MULTI_FENCE.lastIndex = 0;
  while ((match = MULTI_FENCE.exec(content)) !== null) {
    embeds.push({
      type: 'multi',
      exercises: match[3].split(','),
      solutions: match[4].split(','),
    });
  }

  return embeds;
}

function collectStackBlitzFiles(content: string): string[] {
  const files = new Set<string>();

  for (const embed of extractStackBlitzEmbeds(content)) {
    if (embed.type === 'single') {
      if (isSafeTsFilename(embed.file)) files.add(embed.file);
      if (isSafeTsFilename(embed.solution)) files.add(embed.solution);
      continue;
    }

    for (const file of [...embed.exercises, ...embed.solutions].map((value) =>
      value.trim(),
    )) {
      if (isSafeTsFilename(file)) files.add(file);
    }
  }

  return Array.from(files);
}

export function loadReferencedFrontendCodeFiles(
  content: string,
  slug: string,
  base: 'fundamentals' | 'problems',
): Record<string, string> {
  const dir = path.join(process.cwd(), 'src', 'app', 'frontend', base, slug);
  const files = collectStackBlitzFiles(content);

  return Object.fromEntries(
    files.flatMap((file) => {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) return [];

      return [[file, fs.readFileSync(filePath, 'utf-8')]];
    }),
  );
}
