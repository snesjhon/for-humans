import { getAllFundamentalsSlugs as getAllDsaFundamentalsSlugs, getFundamentalsGuide as getDsaFundamentalsGuide, getSectionForFundamentals as getDsaSectionForFundamentals } from '@/lib/dsa/fundamentals';
import { getAllFundamentalsSlugs as getAllFrontendFundamentalsSlugs, getFundamentalsGuide as getFrontendFundamentalsGuide, getSectionForFundamentals as getFrontendSectionForFundamentals } from '@/lib/frontend/fundamentals';
import { getAllProblems, readMarkdownFile } from '@/lib/dsa/content';
import { getSectionsForProblem } from '@/lib/dsa/journey';
import { getAllConceptSlugs, getConceptGuide, getSectionForConcept } from '@/lib/system-design/concepts';
import { getAllScenarioSlugsFromDisk, loadScenario } from '@/lib/system-design/content';
import { getAllFundamentalsSlugs as getAllSystemDesignFundamentalsSlugs, getAllPracticeSlugs, getFundamentalsGuide as getSystemDesignFundamentalsGuide, getFundamentalsPractice, getSectionForFundamentals as getSystemDesignSectionForFundamentals } from '@/lib/system-design/fundamentals';
import { getScenarioBySlug as getSystemDesignScenarioBySlug } from '@/lib/system-design/journey';

export interface SearchEntry {
  id: string;
  title: string;
  href: string;
  category: string;
  section?: string;
  description: string;
  keywords: string[];
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~]+/g, '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, length = 220): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

function extractHeadings(content: string): string[] {
  const matches = content.matchAll(/^##\s+(.+)$/gm);
  return Array.from(matches, (match) => match[1].trim());
}

function pushUniqueEntry(
  entries: SearchEntry[],
  href: string,
  title: string,
  category: string,
  description: string,
  keywords: string[],
  section?: string,
) {
  entries.push({
    id: href,
    href,
    title,
    category,
    section,
    description: truncate(description),
    keywords: Array.from(
      new Set(
        [...keywords, truncate(description, 500)]
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      ),
    ),
  });
}

export function getSearchEntries(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  pushUniqueEntry(
    entries,
    '/',
    'thinkdeep',
    'Home',
    'Structured learning across DSA, system design, and fullstack engineering.',
    ['home', 'landing', 'thinkdeep'],
  );
  pushUniqueEntry(
    entries,
    '/dsa',
    'DSA Home',
    'DSA',
    'Explore the DSA path and its mental-model-first problem sets.',
    ['dsa', 'data structures', 'algorithms'],
  );
  pushUniqueEntry(
    entries,
    '/dsa/path',
    'DSA Path',
    'DSA',
    'Browse the full DSA learning path by phase, fundamentals, and problems.',
    ['dsa', 'path', 'journey'],
  );
  pushUniqueEntry(
    entries,
    '/frontend',
    'Frontend Home',
    'Frontend',
    'Explore the frontend track for TypeScript and React mental models.',
    ['frontend', 'typescript', 'react'],
  );
  pushUniqueEntry(
    entries,
    '/frontend/path',
    'Frontend Path',
    'Frontend',
    'Browse the frontend path by phase and fundamentals guides.',
    ['frontend', 'typescript', 'react', 'path', 'journey'],
  );
  pushUniqueEntry(
    entries,
    '/system-design',
    'System Design Home',
    'System Design',
    'Explore system design fundamentals, concepts, and scenarios.',
    ['system design', 'distributed systems', 'architecture'],
  );
  pushUniqueEntry(
    entries,
    '/system-design/path',
    'System Design Path',
    'System Design',
    'Browse the system design path by phase, fundamentals, concepts, and scenarios.',
    ['system design', 'path', 'journey'],
  );
  pushUniqueEntry(
    entries,
    '/settings',
    'Settings',
    'Settings',
    'Manage general application settings.',
    ['settings', 'preferences'],
  );
  pushUniqueEntry(
    entries,
    '/system-design/settings',
    'System Design Settings',
    'Settings',
    'Manage system design-specific settings.',
    ['settings', 'system design', 'preferences'],
  );

  for (const guide of getAllDsaFundamentalsSlugs()) {
    const content = getDsaFundamentalsGuide(guide);
    const context = getDsaSectionForFundamentals(guide);
    if (!content) continue;

    pushUniqueEntry(
      entries,
      `/dsa/fundamentals/${guide}`,
      context?.section.label ?? content.title,
      'DSA Fundamentals',
      stripMarkdown(content.content),
      [guide, ...(content.sections ?? []), context?.section.label ?? '', context?.section.mentalModelHook ?? ''],
      context?.section.label,
    );
  }

  for (const problem of getAllProblems()) {
    const mentalModel = problem.files.mentalModel
      ? readMarkdownFile(problem.files.mentalModel).content
      : '';
    const sections = getSectionsForProblem(problem.id);
    const primarySection = sections[0];

    pushUniqueEntry(
      entries,
      `/dsa/problems/${problem.id}`,
      `${problem.id} · ${problem.title}`,
      'DSA Problem',
      stripMarkdown(mentalModel),
      [
        problem.id,
        problem.slug,
        problem.title,
        ...sections.map((section) => section.label),
        ...extractHeadings(mentalModel),
      ],
      primarySection?.label,
    );
  }

  for (const slug of getAllFrontendFundamentalsSlugs()) {
    const guide = getFrontendFundamentalsGuide(slug);
    const context = getFrontendSectionForFundamentals(slug);
    if (!guide) continue;

    pushUniqueEntry(
      entries,
      `/frontend/fundamentals/${slug}`,
      context?.section.label ?? guide.title,
      'Frontend Fundamentals',
      stripMarkdown(guide.content),
      [
        slug,
        guide.title,
        context?.section.label ?? '',
        context?.section.mentalModelHook ?? '',
        context?.section.fundamentalsBlurb ?? '',
        ...extractHeadings(guide.content),
      ],
      context?.section.label,
    );
  }

  for (const slug of getAllSystemDesignFundamentalsSlugs()) {
    const guide = getSystemDesignFundamentalsGuide(slug);
    const context = getSystemDesignSectionForFundamentals(slug);
    if (!guide) continue;

    pushUniqueEntry(
      entries,
      `/system-design/fundamentals/${slug}`,
      context?.section.label ?? guide.title,
      'System Design Fundamentals',
      stripMarkdown(guide.content),
      [slug, guide.title, context?.section.label ?? '', context?.section.mentalModelHook ?? '', context?.section.fundamentalsBlurb ?? '', ...extractHeadings(guide.content)],
      context?.section.label,
    );
  }

  for (const slug of getAllPracticeSlugs()) {
    const guide = getFundamentalsPractice(slug);
    const context = getSystemDesignSectionForFundamentals(slug);
    if (!guide) continue;

    pushUniqueEntry(
      entries,
      `/system-design/fundamentals/practice/${slug}`,
      `${context?.section.label ?? guide.title} Practice`,
      'System Design Practice',
      stripMarkdown(guide.content),
      [slug, guide.title, context?.section.label ?? '', ...extractHeadings(guide.content)],
      context?.section.label,
    );
  }

  for (const slug of getAllConceptSlugs()) {
    const guide = getConceptGuide(slug);
    const context = getSectionForConcept(slug);
    if (!guide) continue;

    pushUniqueEntry(
      entries,
      `/system-design/concepts/${slug}`,
      guide.title,
      'System Design Concept',
      stripMarkdown(guide.content),
      [slug, guide.title, context?.section.label ?? '', ...extractHeadings(guide.content)],
      context?.section.label,
    );
  }

  for (const slug of getAllScenarioSlugsFromDisk()) {
    const scenario = loadScenario(slug);
    const journeyMatch = getSystemDesignScenarioBySlug(slug);
    if (!scenario) continue;

    const briefText = stripMarkdown(scenario.brief);
    const walkthroughText = scenario.walkthrough
      ? stripMarkdown(scenario.walkthrough)
      : '';
    const sectionMatch = journeyMatch?.section.label;

    pushUniqueEntry(
      entries,
      `/system-design/scenarios/${slug}`,
      journeyMatch?.scenario.label ?? slug,
      'System Design Scenario',
      [briefText, walkthroughText].filter(Boolean).join(' '),
      [slug, sectionMatch ?? '', ...extractHeadings(scenario.brief), ...(scenario.walkthrough ? extractHeadings(scenario.walkthrough) : [])],
      sectionMatch,
    );
  }
  return entries.sort((left, right) => left.title.localeCompare(right.title));
}
