import type { FrontendJourneySection, Phase } from './types';

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Novice',
    emoji: '🌱',
    goal:
      'From JS fundamentals and snapshot state through typed async patterns and effect cleanup to component boundaries — the foundation every React decision builds on.',
    sections: [
      {
        id: 'javascript-refresh',
        label: 'JavaScript Refresh',
        mentalModelHook:
          'Most React bugs start one layer lower than React itself: shared references, accidental coercion, silent mutation, and queue ordering mistakes.',
        fundamentalsSlug: 'javascript-refresh',
        fundamentalsBlurb:
          'A senior-targeted refresher on value vs reference, shallow copy limits, missing vs falsy, coercion, mutating array methods, and promise vs timer ordering.',
        additionalFundamentals: [
          {
            slug: 'data-parsing',
            blurb:
              'Flat lookup, cross-reference, and filter-then-aggregate — the three data transformation patterns that appear in every frontend codebase.',
          },
        ],
        practice: [
          {
            id: '032',
            slug: '032-object-spread-and-falsy-traps',
            label: 'Object Spread and Falsy Traps',
          },
          {
            id: '033',
            slug: '033-scheduling-and-async-traps',
            label: 'Scheduling and Async Traps',
          },
          {
            id: '050',
            slug: '050-content-coverage-score',
            label: 'Content Coverage Score',
          },
        ],
        explorations: [],
      },
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
        explorations: [],
        scenarios: [
          {
            slug: 'app-shell',
            label: 'App Shell',
            blurb:
              'Build the first real `App.tsx` and `App.css` around an explicit loading, error, and data screen-state model with hardcoded mock devices.',
          },
        ],
      },
      {
        id: 'data-fetching',
        label: 'Data Fetching & Async State + Conditional Types',
        mentalModelHook:
          'Async state has four phases — and `infer` is the mechanism that extracts the resolved type from a promise so the hook can stay generic without losing the data shape.',
        fundamentalsSlug: 'data-fetching',
        fundamentalsBlurb:
          'Race condition cancellation, `Awaited<T>` and conditional types for typed async state, and when to extract a data-fetching hook.',
        practice: [
          {
            id: '027',
            slug: '027-promise-adoption-traps',
            label: 'Promise Adoption Traps',
          },
          {
            id: '034',
            slug: '034-use-query',
            label: 'useQuery',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'modeling-the-api-contract',
            label: 'Model the API Contract',
            blurb:
              'Define TypeScript types for the device, tag, and alarm responses returned by the Plant Floor Monitor mock REST API.',
          },
          {
            slug: 'writing-the-fetch-layer',
            label: 'Write the Fetch Layer',
            blurb:
              'Implement typed fetch functions that read from the static JSON mocks and expose the data to the rest of the application.',
          },
        ],
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
            id: '028',
            slug: '028-traffic-light',
            label: 'Traffic Light',
          },
          {
            id: '026',
            slug: '026-promise-vs-timeout',
            label: 'Promise vs setTimeout',
          },
        ],
        explorations: [
          {
            id: '030',
            slug: '030-window-dimensions',
            label: 'Window Dimensions',
          },
        ],
        scenarios: [
          {
            slug: 'async-state-in-react',
            label: 'Async State in React',
            blurb:
              'Wire the fetch layer into a custom hook that tracks loading, error, and data state and cancels in-flight requests on unmount.',
          },
        ],
      },
      {
        id: 'component-composition',
        label: 'Component Composition',
        mentalModelHook:
          'A compound component separates state ownership from visual structure — the parent holds the state, the children decide how to display it.',
        fundamentalsSlug: 'component-composition',
        fundamentalsBlurb:
          'Compound components, portal-based rendering, lifting state up, and recursive component trees.',
        practice: [
          {
            id: '029',
            slug: '029-modal-dialog',
            label: 'Modal Dialog',
          },
          {
            id: '031',
            slug: '031-carousel-navigation',
            label: 'Carousel Navigation',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'rendering-the-data',
            label: 'Render the Data',
            blurb:
              'Build DeviceCard and DeviceList components that display device status from the hook, including a status badge with CSS custom properties.',
          },
        ],
      },
    ],
  },
  {
    number: 2,
    label: 'Studied',
    emoji: '📚',
    goal:
      'Rich UI, collection state, timing, DOM events, and advanced hook architecture — the patterns that distinguish senior work in code review.',
    sections: [
      {
        id: 'rich-interactive-ui',
        label: 'Rich Interactive UI + CSS Layout',
        mentalModelHook:
          'Multi-concern UI separates navigation state, loading state, and animation state as independent dimensions that layer, not merge.',
        fundamentalsSlug: 'rich-interactive-ui',
        fundamentalsBlurb:
          'Multi-concern state modeling, CSS Grid and Flexbox for dashboard layout, the auto-fill + minmax pattern, and CSS custom properties for closed-set values.',
        practice: [
          {
            id: '035',
            slug: '035-image-carousel',
            label: 'Image Carousel',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'css-layout',
            label: 'CSS Layout',
            blurb:
              'Replace the flex placeholder layout with a CSS Grid dashboard: fixed sidebar, fluid main area, and a responsive device card grid using auto-fill and minmax.',
          },
        ],
      },
      {
        id: 'collection-hooks',
        label: 'Collection & State Shape Hooks + Generics',
        mentalModelHook:
          'Writing `useMap<K, V>` is where generic constraints stop being abstract — the shape of the collection forces you to constrain `K` and design the return type around `V`.',
        fundamentalsSlug: 'collection-hooks',
        fundamentalsBlurb:
          'Arrays, maps, and sets as state — immutable update patterns, stable references, and generic hook signatures with meaningful constraints.',
        practice: [
          {
            id: '036',
            slug: '036-use-array',
            label: 'useArray',
          },
          {
            id: '037',
            slug: '037-use-map',
            label: 'useMap',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'interactivity',
            label: 'Add Interactivity',
            blurb:
              'Build a horizontally scrollable featured-device rail that shows five fixed-width cards at a time and derives previous and next button visibility from the DOM scroll position.',
          },
        ],
      },
      {
        id: 'timing-hooks',
        label: 'Timing & Scheduling Hooks',
        mentalModelHook:
          'Debounce delays until quiet; throttle limits the rate — they solve different problems and are never interchangeable.',
        fundamentalsSlug: 'timing-hooks',
        fundamentalsBlurb:
          'The stale closure inside setInterval, useRef as the stable callback escape hatch, and countdown state without drift.',
        practice: [
          {
            id: '038',
            slug: '038-use-debounce',
            label: 'useDebounce',
          },
          {
            id: '039',
            slug: '039-use-countdown',
            label: 'useCountdown',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'debounced-search',
            label: 'Debounced Search',
            blurb:
              'Add a search input that debounces keystrokes so the device list filters only after the user pauses typing.',
          },
        ],
      },
      {
        id: 'dom-event-hooks',
        label: 'DOM, Events & Browser API Hooks + Template Literal Types',
        mentalModelHook:
          'DOM event names are template literal types in disguise — typing `useEventListener` so the handler narrows by event name is the concept made immediately concrete.',
        fundamentalsSlug: 'dom-event-hooks',
        fundamentalsBlurb:
          'useRef for DOM nodes, event listener lifecycle, SSR guards, and template literal types for typed event names and handler signatures.',
        practice: [
          {
            id: '040',
            slug: '040-use-event-listener',
            label: 'useEventListener',
          },
          {
            id: '041',
            slug: '041-use-hover',
            label: 'useHover',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'click-outside-filter',
            label: 'Click-Outside Filter Panel',
            blurb:
              'Extract the filter controls into a dropdown panel that closes when the user clicks outside it, using a DOM event listener with proper cleanup.',
          },
        ],
      },
      {
        id: 'advanced-hook-patterns',
        label: 'Advanced Hook Patterns + Variance',
        mentalModelHook:
          'The most complex hooks are small state machines — naming the valid states and their transitions is the design work; the code follows.',
        fundamentalsSlug: 'advanced-hook-patterns',
        fundamentalsBlurb:
          'Mediated state, useSyncExternalStore as the alternative to useState for external subscriptions, and how variance makes method shorthand signatures unsound.',
        practice: [
          {
            id: '042',
            slug: '042-use-mediated-state',
            label: 'useMediatedState',
          },
          {
            id: '043',
            slug: '043-use-idle',
            label: 'useIdle',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'extracting-the-hook',
            label: 'Extract the Hook',
            blurb:
              'Pull the device data, filter logic, and selection state out of App into a single useDevices hook that owns all the moving parts.',
          },
        ],
      },
    ],
  },
  {
    number: 3,
    label: 'Advanced',
    emoji: '🎯',
    goal:
      'Complex state machines, performance tradeoffs, accessibility requirements, and full-feature system design — the senior-to-staff gap in practice.',
    sections: [
      {
        id: 'complex-state-reducers',
        label: 'Complex State & Reducers + Mapped Types',
        mentalModelHook:
          'A reducer makes state transitions explicit and impossible states unrepresentable — the shape of valid actions is as important as the shape of state.',
        fundamentalsSlug: 'complex-state-reducers',
        fundamentalsBlurb:
          'Finite state modeling, discriminated union actions, undo/redo as past/present/future, and mapped types for deriving variant shapes from a single source of truth.',
        practice: [
          {
            id: '044',
            slug: '044-undoable-counter',
            label: 'Undoable Counter',
          },
          {
            id: '045',
            slug: '045-tic-tac-toe',
            label: 'Tic-Tac-Toe',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'reducer-for-app-state',
            label: 'Reducer for App State',
            blurb:
              'Replace the scattered useState calls in useDevices with a single useReducer that makes every state transition explicit and impossible states unrepresentable.',
          },
        ],
      },
      {
        id: 'performance-optimization',
        label: 'Performance & Render Optimization',
        mentalModelHook:
          'Memoization only helps when the input is stable — an unstable input makes it a tax, not a savings.',
        fundamentalsSlug: 'performance-optimization',
        fundamentalsBlurb:
          'Why most re-renders are free, the prerequisite of stable references for useMemo and useCallback, and measuring before optimizing.',
        practice: [
          {
            id: '046',
            slug: '046-selectable-cells',
            label: 'Selectable Cells',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'memoizing-the-filter',
            label: 'Memoize the Filter',
            blurb:
              'Profile the filter computation and stabilize references so useMemo and useCallback only run when inputs actually change.',
          },
        ],
      },
      {
        id: 'accessibility',
        label: 'Accessibility & Keyboard Interaction + Branded Types',
        mentalModelHook:
          'ARIA roles describe what something is; keyboard handlers describe how to use it — both are required for a component to be accessible.',
        fundamentalsSlug: 'accessibility',
        fundamentalsBlurb:
          'ARIA roles and properties, focus trap mechanics, keyboard navigation per the ARIA spec, branded types for preventing accidental ARIA ID substitution.',
        practice: [
          {
            id: '047',
            slug: '047-modal-dialog-ii-iii',
            label: 'Modal Dialog II & III',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'accessibility',
            label: 'Accessibility Pass',
            blurb:
              'Audit the dashboard for keyboard operability and screen reader correctness: focus trap for the filter panel, ARIA roles for the status badge, and focus-visible styles.',
          },
        ],
      },
      {
        id: 'full-feature-applications',
        label: 'Full-Feature Applications',
        mentalModelHook:
          'A full-feature component is a system design problem: what state is shared, what is local, and what triggers re-renders across the tree.',
        fundamentalsSlug: 'full-feature-applications',
        fundamentalsBlurb:
          'Combining reducers, async, accessibility, and performance — and deciding which problems belong in local state vs a reducer vs an external store.',
        practice: [
          {
            id: '048',
            slug: '048-users-database',
            label: 'Users Database',
          },
          {
            id: '049',
            slug: '049-wordle',
            label: 'Wordle',
          },
        ],
        explorations: [],
        scenarios: [
          {
            slug: 'polish-and-walkthrough',
            label: 'Polish and Walkthrough',
            blurb:
              'Final polish pass: consistent spacing, loading skeletons, and a complete walkthrough of the finished Plant Floor Monitor as a senior engineer would present it.',
          },
        ],
      },
    ],
  },
];

export function getSectionByFundamentalsSlug(
  slug: string,
): FrontendJourneySection | undefined {
  for (const phase of JOURNEY) {
    const section = phase.sections.find(
      (entry) =>
        entry.fundamentalsSlug === slug ||
        entry.additionalFundamentals?.some((f) => f.slug === slug),
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
