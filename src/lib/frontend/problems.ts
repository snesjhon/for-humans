import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type FrontendProblemTier = 'practice' | 'advanced';
export type FrontendProblemKind = 'typescript' | 'react' | 'mixed';
export type FrontendProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface FrontendProblem {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  sectionId: string;
  tier: FrontendProblemTier;
  kind: FrontendProblemKind;
  difficulty: FrontendProblemDifficulty;
  files: {
    mentalModel?: string;
  };
}

const FRONTEND_PROBLEMS_DIR = path.join(
  process.cwd(),
  'src',
  'app',
  'frontend',
  'problems',
);

const FRONTEND_PROBLEM_METADATA: Record<
  string,
  Omit<FrontendProblem, 'id' | 'slug' | 'files'>
> = {
  '024': {
    title: 'Like Button',
    prompt:
      'Build a Like button that changes appearance based on its state. Focus on the state shape, not the styling.',
    sectionId: 'state-driven-ui',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '025': {
    title: 'Star Rating',
    prompt:
      'Build a star rating component that shows a row of star icons for users to select the number of filled stars corresponding to the rating. Focus on how hover preview and selected state interact.',
    sectionId: 'state-driven-ui',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '026': {
    title: 'Promise vs setTimeout',
    prompt:
      'Predict the execution order when promises and setTimeout appear together, then implement a correctly awaitable delay. The core question is which queue each callback lands in.',
    sectionId: 'effects-timers-cleanup',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
  },
  '027': {
    title: 'Promise Adoption Traps',
    prompt:
      'Wrap callback work in a promise, return nested promise branches correctly, and retry without breaking the chain. The core question is what the outer promise is actually waiting for.',
    sectionId: 'data-fetching',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
  },
  '028': {
    title: 'Traffic Light',
    prompt:
      'Build a traffic light where green, yellow, and red switch after fixed delays and loop forever. The core question is how the timer lifecycle stays tied to the component, especially when it unmounts mid-cycle.',
    sectionId: 'effects-timers-cleanup',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '029': {
    title: 'Modal Dialog',
    prompt:
      'Build a reusable modal dialog component that can be opened and closed. The core question is how a portal lets a component stay in the React tree while its DOM output escapes to document.body.',
    sectionId: 'component-composition',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '030': {
    title: 'Window Dimensions',
    prompt:
      'Write a custom hook that returns the current window width, height, and orientation. The orientation is "landscape" when width exceeds height and "portrait" otherwise. The hook must stay current as the window is resized.',
    sectionId: 'effects-timers-cleanup',
    tier: 'practice',
    kind: 'react',
    difficulty: 'easy',
  },
};

let _problems: FrontendProblem[] | null = null;

function extractIdFromSlug(slug: string): string | null {
  const match = slug.match(/^(\d+)-/);
  return match ? match[1].padStart(3, '0') : null;
}

export function getAllFrontendProblems(): FrontendProblem[] {
  if (_problems) return _problems;
  if (!fs.existsSync(FRONTEND_PROBLEMS_DIR)) return [];

  const problems: FrontendProblem[] = [];
  const entries = fs.readdirSync(FRONTEND_PROBLEMS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '[id]') continue;

    const id = extractIdFromSlug(entry.name);
    if (!id) continue;

    const metadata = FRONTEND_PROBLEM_METADATA[id];
    if (!metadata) continue;

    const dirPath = path.join(FRONTEND_PROBLEMS_DIR, entry.name);
    const mentalModelPath = path.join(dirPath, 'mental-model.md');

    problems.push({
      id,
      slug: entry.name,
      ...metadata,
      files: {
        mentalModel: fs.existsSync(mentalModelPath) ? mentalModelPath : undefined,
      },
    });
  }

  problems.sort((left, right) => parseInt(left.id, 10) - parseInt(right.id, 10));
  _problems = problems;
  return problems;
}

export function getFrontendProblemById(id: string): FrontendProblem | undefined {
  return getAllFrontendProblems().find((problem) => problem.id === id);
}

export function readFrontendMarkdownFile(filePath: string): {
  content: string;
  data: Record<string, unknown>;
} {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(raw);

  return { content, data };
}
