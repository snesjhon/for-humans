import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { JOURNEY, getLessonBySlug } from './journey';

const LESSONS_DIR = path.join(process.cwd(), 'src', 'app', 'interview-prep', 'lessons');

export interface InterviewPrepLessonContent {
  slug: string;
  title: string;
  lessonContent: string;
  promptContent: string | null;
  sections: string[];
  hasLessonFile: boolean;
  hasPromptFile: boolean;
}

function extractTitle(content: string, fallback = ''): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : fallback;
}

function extractH2Sections(content: string): string[] {
  const matches = content.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches).map((match) => match[1]);
}

function buildScaffoldPlaceholder(slug: string): string {
  const lesson = getLessonBySlug(slug);
  const title = lesson?.label ?? slug.replace(/-/g, ' ');
  const conceptFocus = lesson?.conceptFocus.join(', ') ?? 'Lesson content';

  return `# ${title}

## Scaffold Status

This lesson route is live and the platform scaffold is wired. The full \`lesson.md\` content has not been generated yet.

## What Will Live Here

This page will render the lesson narrative, code blocks, explanation guidance, and checkpoint questions for \`${slug}\`.

## Concept Focus

${conceptFocus}
`;
}

export function getLessonContent(slug: string): InterviewPrepLessonContent | null {
  const lesson = getLessonBySlug(slug);
  if (!lesson) return null;

  const lessonPath = path.join(LESSONS_DIR, slug, 'lesson.md');
  const promptPath = path.join(LESSONS_DIR, slug, 'prompt.md');

  const hasLessonFile = fs.existsSync(lessonPath);
  const hasPromptFile = fs.existsSync(promptPath);

  const lessonRaw = hasLessonFile
    ? fs.readFileSync(lessonPath, 'utf-8')
    : buildScaffoldPlaceholder(slug);
  const { content: lessonContent } = matter(lessonRaw);

  return {
    slug,
    title: extractTitle(lessonContent, lesson.label),
    lessonContent,
    promptContent: hasPromptFile ? fs.readFileSync(promptPath, 'utf-8') : null,
    sections: extractH2Sections(lessonContent),
    hasLessonFile,
    hasPromptFile,
  };
}

export function getAllLessonSlugs(): string[] {
  return JOURNEY.flatMap((phase) => phase.lessons.map((lesson) => lesson.slug));
}

export function getPublishedLessonSlugs(): string[] {
  if (!fs.existsSync(LESSONS_DIR)) return [];

  return fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '[slug]')
    .filter((entry) =>
      fs.existsSync(path.join(LESSONS_DIR, entry.name, 'lesson.md')),
    )
    .map((entry) => entry.name);
}
