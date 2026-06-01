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
  '031': {
    title: 'Carousel Navigation',
    prompt:
      'Build a horizontal carousel that shows five of ten covers at a time, with left and right navigation arrows. The core question is whether the arrow visibility flags should be stored in state or derived from the current scroll position.',
    sectionId: 'component-composition',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '032': {
    title: 'Object Spread and Falsy Traps',
    prompt:
      'Predict what spread copies, plain assignment shares, and fallback operators replace, then implement fixes that avoid nested mutation leaks and accidental defaulting.',
    sectionId: 'javascript-refresh',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
  },
  '033': {
    title: 'Scheduling and Async Traps',
    prompt:
      'Predict log order across promises and setTimeout, fix a missing return in a promise chain, and trace a loop-closure bug caused by var. The core question is which queue each callback lands in.',
    sectionId: 'javascript-refresh',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
  },
  '034': {
    title: 'useQuery',
    prompt:
      'Implement a hook that manages any promise resolution, typed with a discriminated union over the four async states. Race condition handling and AbortController cleanup required.',
    sectionId: 'data-fetching',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '035': {
    title: 'Image Carousel',
    prompt:
      'Build an image carousel with navigation and smooth transitions. The core question is how animation state layers on top of navigation state without coupling them.',
    sectionId: 'rich-interactive-ui',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '036': {
    title: 'useArray',
    prompt:
      'Implement a hook that manages an array with push, remove, and clear operations. The core question is how to guarantee immutable updates so React always sees a new reference.',
    sectionId: 'collection-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'easy',
  },
  '037': {
    title: 'useMap',
    prompt:
      'Implement a hook that manages a JavaScript Map with typed key-value semantics. The core question is how to constrain K and design the return type around V without losing type inference.',
    sectionId: 'collection-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '038': {
    title: 'useDebounce',
    prompt:
      'Implement a hook that debounces any value with a configurable delay. The core question is what cleanup must cancel when the value changes mid-debounce.',
    sectionId: 'timing-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '039': {
    title: 'useCountdown',
    prompt:
      'Implement a countdown hook with start, pause, and reset. The core question is how to manage tick state without drift and stop the interval when the count reaches zero.',
    sectionId: 'timing-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '040': {
    title: 'useEventListener',
    prompt:
      'Implement a hook that subscribes to any browser event with automatically narrowed handler types. The core question is how template literal types tie the event name string to the correct handler signature.',
    sectionId: 'dom-event-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '041': {
    title: 'useHover',
    prompt:
      'Implement a hook that tracks whether an element is hovered using two event listeners and one ref. The core question is the minimum state needed to represent a two-event interaction.',
    sectionId: 'dom-event-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'easy',
  },
  '042': {
    title: 'useMediatedState',
    prompt:
      'Implement a hook similar to useState that applies a mediation function before storing the value. The core question is how the mediation function intercepts every update without breaking the useState contract.',
    sectionId: 'advanced-hook-patterns',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '043': {
    title: 'useIdle',
    prompt:
      'Implement a hook that detects user inactivity after a configurable timeout. The core question is how multiple event sources all reset the same countdown without leaking listeners.',
    sectionId: 'advanced-hook-patterns',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '044': {
    title: 'Undoable Counter',
    prompt:
      'Build a counter with full undo/redo support using a reducer. The core question is how past/present/future as explicit state fields make time-travel a pure state transition.',
    sectionId: 'complex-state-reducers',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '045': {
    title: 'Tic-Tac-Toe',
    prompt:
      'Build a two-player tic-tac-toe game using a reducer. The core question is how the action union prevents impossible transitions like moving on an occupied square or playing after the game ends.',
    sectionId: 'complex-state-reducers',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '046': {
    title: 'Selectable Cells',
    prompt:
      'Build a grid where users can drag to select multiple cells. The core question is how to keep pointer-event handlers from triggering unnecessary re-renders on every cell during a drag.',
    sectionId: 'performance-optimization',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '047': {
    title: 'Modal Dialog II & III',
    prompt:
      'Add correct ARIA roles and full keyboard support to a modal dialog: role="dialog", aria-modal, aria-labelledby, focus trap on Tab and Shift+Tab, and Escape to close. Screen reader correctness first, keyboard operability second.',
    sectionId: 'accessibility',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '048': {
    title: 'Users Database',
    prompt:
      'Build a UI to filter, sort, create, update, and delete users. The core question is how optimistic updates keep state consistent when an async mutation can fail after the UI has already changed.',
    sectionId: 'full-feature-applications',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '049': {
    title: 'Wordle',
    prompt:
      'Build Wordle: six guesses, per-position letter state, keyboard input, and win condition. The core question is how to model the board as a reducer where every guess transition is explicit and impossible states are unrepresentable.',
    sectionId: 'full-feature-applications',
    tier: 'practice',
    kind: 'react',
    difficulty: 'hard',
  },
  '050': {
    title: 'Content Coverage Score',
    prompt:
      'Given a publication plan and a list of content packages, return the total production cost of packages that cover at least one required category, and the percentage of required categories covered. The core question is how to separate the relevance check from the accumulation and why coverage needs a Set instead of a counter.',
    sectionId: 'javascript-refresh',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
  },
  '051': {
    title: 'Search and Filter Bar',
    prompt:
      'Given a list of items, implement a search input and a filter control that update the visible results in real time. The core question is which values belong in state and which should be derived from the current query and selected filter.',
    sectionId: 'collection-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '052': {
    title: 'Debounced Search Hook',
    prompt:
      'Extend a search hook so the visible list only recomputes after the user pauses typing. The core question is how to separate the live query the input reads from the settled query the filter uses, and what timer cleanup must happen when a new value arrives mid-debounce.',
    sectionId: 'timing-hooks',
    tier: 'practice',
    kind: 'react',
    difficulty: 'medium',
  },
  '053': {
    title: 'Implement Promise.all',
    prompt:
      'Implement a promiseAll utility that preserves input order, waits for every branch to fulfill, resolves immediately for an empty array, and rejects on the first failure. The core question is why completion timing cannot decide output order, and how one shared remaining-count model controls batch settlement.',
    sectionId: 'data-fetching',
    tier: 'practice',
    kind: 'typescript',
    difficulty: 'medium',
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
