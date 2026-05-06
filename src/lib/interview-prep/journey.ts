import type { InterviewPrepItem, Phase } from './types';

const items: InterviewPrepItem[] = [
  {
    id: 'modeling-the-api-contract',
    label: 'Modeling the API Contract',
    mentalModelHook:
      'TypeScript interfaces are the contract between what the API sends and what the UI can trust.',
    fundamentalsSlug: 'typescript-interfaces-and-unions',
    fundamentalsLabel: 'TypeScript Interfaces & Union Types for API Contracts',
    fundamentalsBlurb:
      'Build the TypeScript modeling skills behind the API contract: interfaces, readonly fields, optional properties, string literal unions, and discriminated unions for event payloads.',
    scenarioSlug: 'modeling-the-api-contract',
    scenarioLabel: 'Modeling the API Contract',
    scenarioBlurb:
      'Given a device API payload, define `Device`, `Tag`, and `Alarm` interfaces. Defend each type decision: why `readonly`, what the union buys, when a discriminated union becomes necessary.',
  },
  {
    id: 'writing-the-fetch-layer',
    label: 'Writing the Fetch Layer',
    mentalModelHook:
      'The fetch boundary is where untyped JSON becomes trusted application data, so that boundary must stay explicit.',
    scenarioSlug: 'writing-the-fetch-layer',
    scenarioLabel: 'Writing the Fetch Layer',
    scenarioBlurb:
      'Build `apiFetch<T>` and `fetchDevices()`. Explain why the generic is on the wrapper, not cast at the call site, and what happens to a non-200 response before `.json()` is called.',
  },
  {
    id: 'async-state-in-react',
    label: 'Async State in React',
    mentalModelHook:
      'Async UI is not just data plus spinner. It is a state machine with failure and cleanup paths that have to be modeled up front.',
    scenarioSlug: 'async-state-in-react',
    scenarioLabel: 'Async State in React',
    scenarioBlurb:
      'Build `useDevices` with `AbortController` cleanup. Explain what happens if the component unmounts mid-fetch without cleanup, and why the abort signal goes into `fetch()` rather than the `setState` guard.',
  },
  {
    id: 'rendering-the-data',
    label: 'Rendering the Data',
    mentalModelHook:
      'A component boundary earns its keep when it narrows responsibility, not when it just moves JSX around.',
    scenarioSlug: 'rendering-the-data',
    scenarioLabel: 'Rendering the Data',
    scenarioBlurb:
      'Given `useDevices` output, decompose into `DeviceList`, `DeviceCard`, and `StatusBadge`. Defend why `StatusBadge` is its own component and how `DeviceCard` avoids coupling to the fetch layer.',
  },
  {
    id: 'css-layout',
    label: 'CSS Layout',
    mentalModelHook:
      'Grid handles page-level placement and Flex handles internals. Mixing those roles is where dashboard layouts start to drift.',
    scenarioSlug: 'css-layout',
    scenarioLabel: 'CSS Layout',
    scenarioBlurb:
      'Add the grid, card, and badge styles. Explain why `auto-fill` with `minmax` eliminates the need for breakpoint media queries, and what breaks if `minmax(0, 1fr)` is used instead.',
  },
  {
    id: 'interactivity',
    label: 'Interactivity',
    mentalModelHook:
      'Filtered data is usually a derivation, not a second source of truth, so it should be computed from state rather than synchronized into state.',
    scenarioSlug: 'interactivity',
    scenarioLabel: 'Interactivity',
    scenarioBlurb:
      'Add the status filter and name search. Explain why the filtered list is computed inline rather than stored in `useState`, and what a reviewer would say about a `useEffect` that syncs filter results.',
  },
  {
    id: 'extracting-the-hook',
    label: 'Extracting the Hook',
    mentalModelHook:
      'A custom hook should own one coherent slice of behavior. If it absorbs unrelated concerns, the refactor makes the code harder to reason about.',
    scenarioSlug: 'extracting-the-hook',
    scenarioLabel: 'Extracting the Hook',
    scenarioBlurb:
      'Extract `useDeviceList` from `App.tsx`. Explain what the hook owns versus what it delegates, why merging `useDevices` and `useDeviceList` into one hook would be a mistake, and how the return shape was designed.',
  },
  {
    id: 'polish-and-walkthrough',
    label: 'Polish and Walkthrough',
    mentalModelHook:
      'Polish is not decoration. It is the final pass where you prove which derivations are worth memoizing and which UI affordances need accessibility semantics.',
    scenarioSlug: 'polish-and-walkthrough',
    scenarioLabel: 'Polish and Walkthrough',
    scenarioBlurb:
      'Add `useMemo`, ARIA roles, and input labels. Walk through the full project verbally: what it does, the data contract, the fetch layer, the state model, the component tree, the interactivity, and one tradeoff made deliberately.',
  },
];

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Plant Floor Monitor',
    emoji: '🏭',
    goal:
      'Build a typed React dashboard that consumes a REST API and leave with a project you can explain clearly in an interview.',
    items,
  },
];

export function getItemByScenarioSlug(slug: string): InterviewPrepItem | null {
  for (const phase of JOURNEY) {
    for (const item of phase.items) {
      if (item.scenarioSlug === slug) return item;
    }
  }
  return null;
}

export function getItemByFundamentalsSlug(slug: string): InterviewPrepItem | null {
  for (const phase of JOURNEY) {
    for (const item of phase.items) {
      if (item.fundamentalsSlug === slug) return item;
    }
  }
  return null;
}
