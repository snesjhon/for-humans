import type { FrontendJourneySection, Phase } from './types';

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Novice',
    emoji: '🌱',
    goal:
      'Confirm that the mental models senior engineers think they have are actually solid. State-as-snapshot, effect cleanup, and the closure trap are the root cause of the majority of Phase 2 and 3 bugs.',
    sections: [
      {
        id: 'state-driven-ui',
        label: 'State-Driven UI',
        mentalModelHook:
          'State is a snapshot of what React rendered — the value you read in a handler belongs to the render where it was created, not the render where it runs.',
        fundamentalsSlug: 'state-driven-ui',
        fundamentalsBlurb:
          'The snapshot model, batching, and how multiple pieces of interacting state stay decoupled.',
        practice: [
          {
            id: '024',
            slug: '024-like-button',
            label: 'Like Button',
          },
          {
            id: '025',
            slug: '025-star-rating',
            label: 'Star Rating',
          },
        ],
        advanced: [],
      },
      {
        id: 'effects-timers-cleanup',
        label: 'Effects, Timers & Cleanup',
        mentalModelHook:
          'An effect is a synchronization step with a setup and a required cleanup — the pair is the contract, not just the setup.',
        fundamentalsSlug: 'effects-timers-cleanup',
        fundamentalsBlurb:
          'Lifecycle timing, interval drift, AbortController for fetch cancellation, and how StrictMode surfaces missing cleanup.',
        practice: [
          {
            id: '026',
            slug: '026-promise-vs-timeout',
            label: 'Promise vs setTimeout',
          },
        ],
        advanced: [],
      },
    ],
  },
  {
    number: 2,
    label: 'Studied',
    emoji: '📚',
    goal:
      'Handle the patterns that distinguish senior engineers. Every section here introduces something that looks fine on first pass and breaks under a real constraint.',
    sections: [
      {
        id: 'component-composition',
        label: 'Component Composition',
        mentalModelHook:
          'A compound component separates state ownership from visual structure — the parent holds the state, the children decide how to display it.',
        fundamentalsSlug: 'component-composition',
        fundamentalsBlurb:
          'Compound components, portal-based rendering, lifting state up, and recursive component trees.',
        practice: [],
        advanced: [],
      },
      {
        id: 'data-fetching',
        label: 'Data Fetching & Async State + Conditional Types',
        mentalModelHook:
          'Async state has four phases — and `infer` is the mechanism that extracts the resolved type from a promise so the hook can stay generic without losing the data shape.',
        fundamentalsSlug: 'data-fetching',
        fundamentalsBlurb:
          'Race condition cancellation, `Awaited<T>` and conditional types for typed async state, and when to extract a data-fetching hook.',
        practice: [],
        advanced: [],
      },
      {
        id: 'collection-hooks',
        label: 'Collection & State Shape Hooks + Generics',
        mentalModelHook:
          'Writing `useMap<K, V>` is where generic constraints stop being abstract — the shape of the collection forces you to constrain `K` and design the return type around `V`.',
        fundamentalsSlug: 'collection-hooks',
        fundamentalsBlurb:
          'Arrays, maps, and sets as state — immutable update patterns, stable references, and generic hook signatures with meaningful constraints.',
        practice: [],
        advanced: [],
      },
      {
        id: 'dom-event-hooks',
        label: 'DOM, Events & Browser API Hooks + Template Literal Types',
        mentalModelHook:
          'DOM event names are template literal types in disguise — typing `useEventListener` so the handler narrows by event name is the concept made immediately concrete.',
        fundamentalsSlug: 'dom-event-hooks',
        fundamentalsBlurb:
          'useRef for DOM nodes, event listener lifecycle, SSR guards, and template literal types for typed event names and handler signatures.',
        practice: [],
        advanced: [],
      },
      {
        id: 'timing-hooks',
        label: 'Timing & Scheduling Hooks',
        mentalModelHook:
          'Debounce delays until quiet; throttle limits the rate — they solve different problems and are never interchangeable.',
        fundamentalsSlug: 'timing-hooks',
        fundamentalsBlurb:
          'The stale closure inside setInterval, useRef as the stable callback escape hatch, and countdown state without drift.',
        practice: [],
        advanced: [],
      },
      {
        id: 'rich-interactive-ui',
        label: 'Rich Interactive UI',
        mentalModelHook:
          'Multi-concern UI separates navigation state, loading state, and animation state as independent dimensions that layer, not merge.',
        fundamentalsSlug: 'rich-interactive-ui',
        fundamentalsBlurb:
          'Image loading lifecycle, transition state layered on selection state, and input control as a dirty/touched state machine.',
        practice: [],
        advanced: [],
      },
    ],
  },
  {
    number: 3,
    label: 'Advanced',
    emoji: '🎯',
    goal:
      'Accessibility, complex state, and performance — the patterns that separate senior from staff-level in code reviews and design discussions.',
    sections: [
      {
        id: 'accessibility',
        label: 'Accessibility & Keyboard Interaction',
        mentalModelHook:
          'ARIA roles describe what something is; keyboard handlers describe how to use it — both are required for a component to be accessible.',
        fundamentalsSlug: 'accessibility',
        fundamentalsBlurb:
          'ARIA roles and properties, focus trap mechanics, keyboard navigation per the ARIA spec, and the difference between screen reader correctness and keyboard operability.',
        practice: [],
        advanced: [],
      },
      {
        id: 'complex-state-reducers',
        label: 'Complex State & Reducers',
        mentalModelHook:
          'A reducer makes state transitions explicit and impossible states unrepresentable — the shape of valid actions is as important as the shape of state.',
        fundamentalsSlug: 'complex-state-reducers',
        fundamentalsBlurb:
          'Finite state modeling, discriminated union actions, undo/redo as past/present/future, and when useReducer wins over scattered useState calls.',
        practice: [],
        advanced: [],
      },
      {
        id: 'performance-optimization',
        label: 'Performance & Render Optimization',
        mentalModelHook:
          'Memoization only helps when the input is stable — an unstable input makes it a tax, not a savings.',
        fundamentalsSlug: 'performance-optimization',
        fundamentalsBlurb:
          'Why most re-renders are free, the prerequisite of stable references for useMemo and useCallback, and minimal DOM footprint patterns.',
        practice: [],
        advanced: [],
      },
      {
        id: 'advanced-hook-patterns',
        label: 'Advanced Hook Patterns',
        mentalModelHook:
          'The most complex hooks are small state machines — naming the valid states and their transitions is the design work; the code follows.',
        fundamentalsSlug: 'advanced-hook-patterns',
        fundamentalsBlurb:
          'Mediated state, the dirty/touched state machine in useInputControl, and when useSyncExternalStore replaces useState.',
        practice: [],
        advanced: [],
      },
      {
        id: 'full-feature-applications',
        label: 'Full-Feature Applications',
        mentalModelHook:
          'A full-feature component is a system design problem: what state is shared, what is local, and what triggers re-renders across the tree.',
        fundamentalsSlug: 'full-feature-applications',
        fundamentalsBlurb:
          'Combining reducers, async, accessibility, and performance — and deciding which problems belong in local state vs a reducer vs an external store.',
        practice: [],
        advanced: [],
      },
    ],
  },
];

export function getSectionByFundamentalsSlug(
  slug: string,
): FrontendJourneySection | undefined {
  for (const phase of JOURNEY) {
    const section = phase.sections.find(
      (entry) => entry.fundamentalsSlug === slug,
    );
    if (section) return section;
  }

  return undefined;
}

export function getPhaseForSection(sectionId: string): Phase | undefined {
  return JOURNEY.find((phase) =>
    phase.sections.some((section) => section.id === sectionId),
  );
}
