import type { InterviewPrepLesson, Phase } from './types';

const lessons: InterviewPrepLesson[] = [
  {
    id: 'modeling-the-api-contract',
    slug: 'modeling-the-api-contract',
    label: 'Modeling the API Contract',
    mentalModelHook:
      'TypeScript interfaces are the contract between what the API sends and what the UI can trust.',
    blurb:
      'Define the `Device`, `Tag`, and `Alarm` payloads before any fetch code exists so the rest of the project has a typed boundary.',
    conceptFocus: [
      'TypeScript interfaces',
      'Union types',
      'readonly',
      'Discriminated unions',
    ],
  },
  {
    id: 'writing-the-fetch-layer',
    slug: 'writing-the-fetch-layer',
    label: 'Writing the Fetch Layer',
    mentalModelHook:
      'The fetch boundary is where untyped JSON becomes trusted application data, so that boundary must stay explicit.',
    blurb:
      'Add a generic `apiFetch<T>()` wrapper and a typed `fetchDevices()` function that handles non-200 responses deliberately.',
    conceptFocus: [
      'fetch',
      'async/await',
      'Response.ok',
      'Typed return values',
      'Generic wrappers',
    ],
  },
  {
    id: 'async-state-in-react',
    slug: 'async-state-in-react',
    label: 'Async State in React',
    mentalModelHook:
      'Async UI is not just data plus spinner. It is a state machine with failure and cleanup paths that have to be modeled up front.',
    blurb:
      'Wrap `fetchDevices()` in a `useDevices` hook with loading, error, and success phases plus `AbortController` cleanup.',
    conceptFocus: [
      'useEffect',
      'useState',
      'Async state shape',
      'AbortController',
      'Cleanup',
    ],
  },
  {
    id: 'rendering-the-data',
    slug: 'rendering-the-data',
    label: 'Rendering the Data',
    mentalModelHook:
      'A component boundary earns its keep when it narrows responsibility, not when it just moves JSX around.',
    blurb:
      'Split the dashboard into `DeviceList`, `DeviceCard`, and `StatusBadge` so rendering logic stays typed and explainable.',
    conceptFocus: [
      'Component decomposition',
      'Props',
      'Conditional rendering',
      'Typed component props',
    ],
  },
  {
    id: 'css-layout',
    slug: 'css-layout',
    label: 'CSS Layout',
    mentalModelHook:
      'Grid handles page-level placement and Flex handles internals. Mixing those roles is where dashboard layouts start to drift.',
    blurb:
      'Add a responsive grid, card structure, and status color tokens using plain CSS that matches the project conventions.',
    conceptFocus: [
      'CSS Grid',
      'Flexbox',
      'Color tokens',
      'Responsive columns',
    ],
  },
  {
    id: 'interactivity',
    slug: 'interactivity',
    label: 'Interactivity',
    mentalModelHook:
      'Filtered data is usually a derivation, not a second source of truth, so it should be computed from state rather than synchronized into state.',
    blurb:
      'Add a controlled status filter and text search that narrow the device list client-side without mutating server data.',
    conceptFocus: [
      'Controlled inputs',
      'Derived state',
      'Filtering',
      'Event handler typing',
    ],
  },
  {
    id: 'extracting-the-hook',
    slug: 'extracting-the-hook',
    label: 'Extracting the Hook',
    mentalModelHook:
      'A custom hook should own one coherent slice of behavior. If it absorbs unrelated concerns, the refactor makes the code harder to reason about.',
    blurb:
      'Extract `useDeviceList()` so fetch state, filter state, and the derived device list live behind one deliberate hook boundary.',
    conceptFocus: [
      'Custom hooks',
      'Hook ownership',
      'Hook/component boundary',
      'Return shape design',
    ],
  },
  {
    id: 'polish-and-walkthrough',
    slug: 'polish-and-walkthrough',
    label: 'Polish and Walkthrough',
    mentalModelHook:
      'Polish is not decoration. It is the final pass where you prove which derivations are worth memoizing and which UI affordances need accessibility semantics.',
    blurb:
      'Add selective `useMemo`, ARIA roles, input labels, and the final project walkthrough the learner should be able to deliver in an interview.',
    conceptFocus: [
      'useMemo',
      'ARIA roles',
      'Keyboard accessibility',
      'Project walkthrough',
    ],
  },
];

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Plant Floor Monitor',
    emoji: '🏭',
    goal:
      'Build a typed React dashboard that consumes a REST API and leave with a project you can explain clearly in an interview.',
    lessons,
  },
];

export function getLessonBySlug(slug: string): InterviewPrepLesson | null {
  for (const phase of JOURNEY) {
    for (const lesson of phase.lessons) {
      if (lesson.slug === slug) return lesson;
    }
  }

  return null;
}

export function getLessonContext(
  slug: string,
): { phase: Phase; lesson: InterviewPrepLesson; index: number } | null {
  for (const phase of JOURNEY) {
    const index = phase.lessons.findIndex((lesson) => lesson.slug === slug);
    if (index >= 0) {
      return { phase, lesson: phase.lessons[index], index };
    }
  }

  return null;
}

export function getAdjacentLessons(slug: string): {
  previous: InterviewPrepLesson | null;
  next: InterviewPrepLesson | null;
} {
  const context = getLessonContext(slug);
  if (!context) {
    return { previous: null, next: null };
  }

  const { phase, index } = context;

  return {
    previous: phase.lessons[index - 1] ?? null,
    next: phase.lessons[index + 1] ?? null,
  };
}
