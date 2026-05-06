Complete Frontend Build Path

---

## Generating Content

Run in the `thinkdeep-agents` working directory. Always generate scenarios in step order — each walkthrough reads the ones before it.

- **Learn:** `/fe-fundamentals state-driven-ui`
- **Build:** `/fe-scenario app-shell`
- **Reinforce:** `/fe-problem 024`

---

## Philosophy

This path is for senior engineers who use React daily but want to defend every decision under interview pressure.

Every step (except Step 0) follows the same three-phase sequence:

**1. Learn** — A fundamentals guide with embedded exercises and tests. The exercises live inside the guide and test the concept in the abstract before any real code is written. No project, no application context — just the mental model made concrete through progressive exercises.

**2. Build** — A scenario that applies what you just learned to the Plant Floor Monitor. This is a thinking guide, not an exercise guide. The brief tells you what to produce. The walkthrough directs your reasoning. The evaluator checks your real local directory. You write production code in a real project — no `step1-exercise1` files.

**3. Reinforce** — Isolated problems in a completely unrelated context. Each problem is self-contained with its own steps and exercises. The Like Button is not a device dashboard — it just forces the same mental model from a different angle. These exist because one application of a concept is not enough to own it under pressure.

**The exception**: JavaScript Refresh (Step 0) has no Build step. It confirms the foundational runtime and data-handling knowledge before the project starts. Learn and Reinforce only.

---

## The Build Project: Plant Floor Monitor

A typed React dashboard that reads device and tag status from a mock REST API. Each Build step adds one real layer to the same codebase. The build sequence is:

| Build Step | What Gets Added                                                     | Section                   |
| ---------- | ------------------------------------------------------------------- | ------------------------- |
| 1          | App shell — static device list, loading flag, error state           | State-Driven UI           |
| 2          | API contract — `Device`, `Tag`, `Alarm` interfaces                  | Data Fetching             |
| 3          | Fetch layer — `apiFetch<T>` and `fetchDevices()`                    | Data Fetching             |
| 4          | Async state hook — `useDevices` with `AbortController` cleanup      | Effects & Cleanup         |
| 5          | Component decomposition — `DeviceList`, `DeviceCard`, `StatusBadge` | Component Composition     |
| 6          | CSS layout — grid, card, badge styles                               | Rich Interactive UI       |
| 7          | Interactivity — status filter and name search                       | Collection Hooks          |
| 8          | Debounced search — replace immediate filter with debounced input    | Timing Hooks              |
| 9          | Click-outside filter — status filter as a dismissable dropdown      | DOM & Events              |
| 10         | Hook extraction — `useDeviceList` separated from `App.tsx`          | Advanced Hook Patterns    |
| 11         | Reducer for app state — filter, search, and view state as a reducer | Complex State             |
| 12         | Memoizing the filter — `useMemo` where the cost is measurable       | Performance               |
| 13         | Accessibility — ARIA roles, keyboard nav, focus management          | Accessibility             |
| 14         | Polish and walkthrough — final pass, then narrate the full project  | Full-Feature Applications |

Data Fetching has two Build steps (2 and 3). `FrontendJourneySection` supports `scenarios?: ScenarioRef[]` to accommodate both.

---

## Step 0: JavaScript Refresh

_No Build step. Learn and Reinforce only._

**Learn**

Fundamentals:

- Name: JavaScript Refresh
- Slug: `javascript-refresh`
- Description: The six runtime rules React quietly depends on — value vs reference, assignment vs shallow copy, missing vs falsy, equality vs coercion, mutation vs non-mutation, microtasks vs macrotasks. Exercises make each rule a prediction problem: given this code, what happens and why.

- Name: Data Parsing
- Slug: `data-parsing`
- Description: Flat lookup, cross-reference, and filter-then-aggregate — the three data transformation patterns that appear in every frontend codebase. Indexing one dataset before iterating the other is the core move that separates O(n²) from O(n).

**Reinforce**

Problems:

- Name: Object Spread and Falsy Traps
  Description: Predict the difference between `obj2 = obj` and `obj2 = { ...obj }`, trace shared nested references, and identify which falsy value `||` handles differently from `??`. The two most common runtime mistakes in React state updates — in an unrelated context.

- Name: Scheduling and Async Traps
  Description: Predict log order across promises and `setTimeout`, fix a missing `return` in a promise chain, and trace a loop-closure bug caused by `var`. The ordering model in an unrelated context.

---

## Step 1: State-Driven UI

**Learn**

Fundamentals:

- Name: State-Driven UI
- Description: State is a snapshot — the value you read in a handler belongs to the render where it was created, not the render where it runs. Batching, multiple interacting pieces of state, and when a single state object is cleaner than several `useState` calls. Exercises test prediction: given this handler and this state, what does the user see after the click?

**Build** (Build Step 1: App Shell)

Scenario:

- Name: App Shell
- Description: Build the initial `App.tsx` for Plant Floor Monitor using hardcoded mock data. Model the three UI branches — loading, error, and data — as explicit state, not inferred from the presence of data. Defend the state shape before any real fetch exists.

**Reinforce**

Problems:

- Name: Like Button
  Description: Build a Like button that toggles liked state and shows a count. One piece of state, one interaction, one render consequence — the snapshot model at its simplest.

- Name: Star Rating
  Description: Build a star rating component with hover state and selected state that interact. Two distinct pieces of state that affect each other's rendering without sharing a value.

---

## Step 2 & 3: Data Fetching & Async State + Conditional Types

_Two Build steps in one learning section. Do Build Step 2 immediately after the fundamentals, then Build Step 3._

**Learn**

Fundamentals:

- Name: Data Fetching & Async State + Conditional Types
- Description: The four phases of async state — idle, loading, success, error — and what missing one looks like in the UI. `Awaited<T>` and `infer` as the TypeScript mechanism that extracts the resolved type from a promise so a hook can stay generic without losing the data shape. Exercises move from hand-writing `Awaited<T>` to typing a discriminated union over the four async phases.

**Build** (Build Step 2: Modeling the API Contract)

Scenario:

- Name: Modeling the API Contract
- Description: Given the Plant Floor Monitor device payload, define `Device`, `Tag`, and `Alarm` interfaces. Defend each type decision — why `readonly`, what the literal union buys over `string`, when a discriminated union becomes necessary instead of a plain interface.

**Build** (Build Step 3: Writing the Fetch Layer)

Scenario:

- Name: Writing the Fetch Layer
- Description: Build `apiFetch<T>` and `fetchDevices()`. Explain why the generic is on the wrapper rather than cast at the call site, what happens to a non-200 response before `.json()` is called, and why the fetch layer belongs in its own module.

**Reinforce**

Problems:

- Name: Promise Adoption Traps
  Description: Fix a series of fetch effects where the second request resolves before the first. The race condition written down and then corrected — in a context unrelated to device dashboards.

- Name: useQuery
  Description: Implement a hook that manages any promise resolution, typed with a discriminated union over the four async states. Race condition handling and AbortController cleanup required.

---

## Step 4: Effects, Timers & Cleanup

**Learn**

Fundamentals:

- Name: Effects, Timers & Cleanup
- Description: The effect lifecycle — setup runs after paint, cleanup runs before the next effect and on unmount. Why `setInterval` without cleanup leaks and silently misbehaves under StrictMode. How interval drift happens and why syncing to a real clock needs a different approach. `AbortController` as the cleanup mechanism for fetch cancellation. Exercises produce the bug first, then fix it.

**Build** (Build Step 4: Async State Hook)

Scenario:

- Name: Async State in React
- Description: Build `useDevices` with `AbortController` cleanup. Explain what happens if the component unmounts mid-fetch without cleanup, why the abort signal goes into `fetch()` rather than a `setState` guard, and how StrictMode would expose a missing cleanup.

**Reinforce**

Problems:

- Name: Traffic Light
  Description: Build a traffic light that cycles green → yellow → red indefinitely. Interval cleanup when the component unmounts mid-cycle — in a context where nothing is being fetched.

- Name: Promise vs setTimeout
  Description: Predict and then verify the execution order of promises and timers in a mixed async sequence. The microtask queue model made concrete through a self-contained exercise.

---

## Step 5: Component Composition

**Learn**

Fundamentals:

- Name: Component Composition
- Description: A compound component separates state ownership from visual structure — the parent holds the state, the children decide how to display it. Portal-based rendering, lifting state up, and the signal that a component boundary is earning its keep versus just moving JSX around. Exercises ask: given this JSX block, where should the split happen and why?

**Build** (Build Step 5: Rendering the Data)

Scenario:

- Name: Rendering the Data
- Description: Decompose the device list into `DeviceList`, `DeviceCard`, and `StatusBadge`. Defend why `StatusBadge` earns its own component, what it would cost to inline it, and how `DeviceCard` stays decoupled from the fetch layer even though it renders fetch data.

**Reinforce**

Problems:

- Name: Modal Dialog
  Description: Build a reusable modal that renders outside the current DOM subtree via a portal. The compound component pattern applied to a component that must escape its DOM context — nothing to do with device dashboards.

- Name: Carousel Navigation
  Description: Build an image carousel with navigation controls. Navigation index and image loading lifecycle as separate, non-interfering pieces of state.

---

## Step 6: Rich Interactive UI

**Learn**

Fundamentals:

- Name: Rich Interactive UI + CSS Layout
- Description: Multi-concern UI separates navigation state, loading state, and animation state as independent dimensions. CSS for dashboard layout — Grid for two-dimensional placement, Flexbox for one-dimensional alignment within a cell. The `minmax()` + `auto-fill` pattern, when `auto-fill` and `auto-fit` differ, and CSS custom properties for closed-set status colors. Exercises include both state modeling and CSS prediction problems.

**Build** (Build Step 6: CSS Layout)

Scenario:

- Name: CSS Layout
- Description: Add the grid, card, and badge styles to the Plant Floor Monitor. Explain why `repeat(auto-fill, minmax(280px, 1fr))` produces a responsive layout without a media query, what breaks if `minmax(0, 1fr)` is used instead, and how CSS custom properties replace magic numbers for the three device status states.

**Reinforce**

Problems:

- Name: Image Carousel
  Description: Build an image carousel with navigation and smooth transitions. Animation state layered on top of navigation state without coupling them — in a context where no CSS grid or status colors are involved.

---

## Step 7: Collection Hooks + Generics

**Learn**

Fundamentals:

- Name: Collection & State Shape Hooks + Generics
- Description: Arrays, maps, and sets as first-class state. Immutable update patterns and why React cannot always catch in-place mutation. Stable references and why a new array from `useState` triggers downstream effects even when contents are identical. Generics: constraining type parameters with `extends`, when to add a type parameter vs let inference handle it. Exercises move from writing `pick<T, K>` by hand to typing a generic hook return shape.

**Build** (Build Step 7: Interactivity)

Scenario:

- Name: Interactivity
- Description: Add a status filter and name search to the device list. Explain why the filtered list is computed inline rather than stored in `useState`, what a reviewer would say about a `useEffect` that syncs filter results into a second state variable, and where the filter state lives relative to the fetch state.

**Reinforce**

Problems:

- Name: useArray
  Description: Implement a hook that manages an array with push, remove, and clear operations. Immutable update discipline in isolation — no dashboard context.

- Name: useMap
  Description: Implement a hook that manages a JavaScript Map with typed key-value semantics. Generic constraint design and stable reference semantics.

---

## Step 8: Timing & Scheduling Hooks

**Learn**

Fundamentals:

- Name: Timing & Scheduling Hooks
- Description: Debounce delays until quiet — throttle limits the rate. They solve different problems and are never interchangeable. The stale closure inside `setInterval` and why `useRef` is the escape hatch for a stable callback reference that reads current state without re-subscribing. Exercises reproduce the stale closure first, then fix it.

**Build** (Build Step 8: Debounced Search)

Scenario:

- Name: Debounced Search
- Description: Replace the immediate name search with a debounced input. Explain the difference between debouncing the value and debouncing the handler, why the cleanup must cancel pending timeouts when the value changes mid-debounce, and what the user experience difference is between the two approaches.

**Reinforce**

Problems:

- Name: useDebounce
  Description: Implement a hook that debounces any value with configurable delay. Cleanup on value change mid-debounce — in a context with no search input.

- Name: useCountdown
  Description: Implement a countdown hook with start, pause, and reset. Tick management without drift, stop condition without an effect loop.

---

## Step 9: DOM, Events & Browser API Hooks + Template Literal Types

**Learn**

Fundamentals:

- Name: DOM, Events & Browser API Hooks + Template Literal Types
- Description: `useRef` for DOM nodes — attach in JSX, read in effects and handlers, never during render. Event listener lifecycle: add in setup, remove in cleanup. SSR guards for browser APIs. Template literal types at the type level: why `keyof HTMLElementEventMap` is the typed version of any DOM event name, and how to narrow handler types automatically by event name string. Exercises type `useEventListener` so `'click'` gives `MouseEvent` and `'keydown'` gives `KeyboardEvent`.

**Build** (Build Step 9: Click-Outside Filter)

Scenario:

- Name: Click-Outside Filter
- Description: Wrap the status filter in a dropdown panel that closes when the user clicks outside it. Implement `useClickOutside` as the abstraction, explain how the ref attaches to the panel DOM node, and explain why the event listener goes on `document` rather than the panel itself.

**Reinforce**

Problems:

- Name: useEventListener
  Description: Implement a hook that subscribes to any browser event with automatically narrowed handler types. The attach/cleanup pattern in a context unrelated to dropdowns.

- Name: useHover
  Description: Implement a hook that tracks whether an element is hovered. Two event listeners, one ref, one boolean state — the pattern condensed to its minimum.

---

## Step 10: Advanced Hook Patterns + Variance

**Learn**

Fundamentals:

- Name: Advanced Hook Patterns + Variance
- Description: The most complex hooks are small state machines — naming valid states and their transitions is the design work, the code follows. Mediated state: updates pass through a processing function before storage. `useSyncExternalStore` as the alternative to `useState` for subscribing to external state without tearing. Variance in TypeScript: return types are covariant, parameter types are contravariant, and method shorthand syntax quietly introduces unsoundness. Exercises expose the variance hole before explaining why it exists.

**Build** (Build Step 10: Extracting the Hook)

Scenario:

- Name: Extracting the Hook
- Description: Extract `useDeviceList` from `App.tsx`. Explain what the hook owns versus what it delegates, why merging `useDevices` and `useDeviceList` into one hook would be a mistake, and how the return shape was designed — tuple vs object, and why one is correct here.

**Reinforce**

Problems:

- Name: useMediatedState
  Description: Implement a hook similar to `useState` that applies a mediation function before storing the value. The foundation of controlled input formatting — in a context with no device data.

- Name: useIdle
  Description: Implement a hook that detects user inactivity after a configurable timeout. Multiple event sources resetting a single countdown — a non-trivial cleanup story unrelated to the dashboard.

---

## Step 11: Complex State & Reducers + Mapped Types

**Learn**

Fundamentals:

- Name: Complex State & Reducers + Mapped Types
- Description: A reducer makes state transitions explicit and impossible states unrepresentable — the shape of valid actions is as important as the shape of state. Discriminated union actions for type-safe dispatch. Undo/redo as past/present/future state fields. Mapped types: key remapping with `as` clauses, modifier syntax (`-readonly`, `-?`), and deriving `Partial`, `Readonly`, and `Required` from one source-of-truth state shape without repeating it. Exercises model a reducer from scratch, then derive its variant types.

**Build** (Build Step 11: Reducer for App State)

Scenario:

- Name: Reducer for App State
- Description: The Plant Floor Monitor now has filter status, search text, and view preferences as separate `useState` calls in `App.tsx`. Convert them to a reducer. Define the valid action types as a discriminated union, explain which impossible state the reducer prevents, and defend the transition from `useState` calls to `dispatch` at the component level.

**Reinforce**

Problems:

- Name: Undoable Counter
  Description: Build a counter with full undo/redo support using a reducer. Past/present/future as explicit state fields — in a context where no filtering or devices are involved.

- Name: Tic-Tac-Toe
  Description: Build a two-player tic-tac-toe game using a reducer. Turn state, win detection, and board state where impossible transitions are unrepresentable by the action union.

---

## Step 12: Performance & Render Optimization

**Learn**

Fundamentals:

- Name: Performance & Render Optimization
- Description: Most re-renders are free — premature optimization is the actual performance problem. `useMemo` and `useCallback` only help when the input is stable: an unstable reference makes them a tax rather than a saving. The prerequisite for memoization is proving the computation is expensive. Exercises measure before and after, not just add `useMemo` and assume it helped.

**Build** (Build Step 12: Memoizing the Filter)

Scenario:

- Name: Memoizing the Filter
- Description: The device list now filters by status and name against a large mock dataset. Profile the filter computation, identify whether it qualifies for `useMemo`, and wrap it only if the cost is measurable. Explain the two places you considered `useMemo` and decided against it, and why the unstable reference in one of them would have made the memo a no-op.

**Reinforce**

Problems:

- Name: Selectable Cells
  Description: Build a grid where users can drag to select multiple cells. High-frequency pointer events against a fixed render budget — the case where memoization is genuinely earned, not assumed.

---

## Step 13: Accessibility & Keyboard Interaction + Branded Types

**Learn**

Fundamentals:

- Name: Accessibility & Keyboard Interaction + Branded Types
- Description: ARIA roles describe what something is — keyboard handlers describe how to use it. Both are required. Focus trap mechanics, keyboard navigation per the ARIA authoring spec, and the difference between screen reader correctness and keyboard operability. Branded types: why structural typing causes accidental substitution in ARIA ID wiring, and how a nominal signal with no runtime cost prevents it. Exercises add ARIA and keyboard support to a component that renders correctly but is inaccessible.

**Build** (Build Step 13: Accessibility)

Scenario:

- Name: Accessibility
- Description: Add ARIA roles, `aria-label` on filter controls, `role="list"` on the device grid, and keyboard navigation to the status filter dropdown. Explain what `role="list"` communicates to assistive technology for a custom-styled grid, why `focus-visible` is the right pseudo-class for keyboard focus styles rather than `:focus`, and what happens to focus when the filter dropdown closes.

**Reinforce**

Problems:

- Name: Modal Dialog II & III
  Description: Add correct ARIA roles and full keyboard support to the modal — `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap on Tab and Shift+Tab, Escape to close. Screen reader correctness first, keyboard operability second, in a context unrelated to the dashboard.

---

## Step 14: Full-Feature Applications

**Learn**

Fundamentals:

- Name: Full-Feature Applications
- Description: A full-feature component is a system design problem — what state is shared, what is local, and what triggers re-renders across the tree. Combining reducers, async state, accessibility, and performance, and deciding which problems belong in local state versus a reducer versus an external store. The 3-minute verbal walkthrough as a practiced skill, not an improvised summary.

**Build** (Build Step 14: Polish and Walkthrough)

Scenario:

- Name: Polish and Walkthrough
- Description: Final pass on the Plant Floor Monitor. Review every `useMemo` decision and remove the ones that aren't earned. Verify ARIA is complete. Add `focus-visible` styles where they are missing. Then walk through the full project without notes in under three minutes: what it does, the data contract, the fetch layer, the state model, the component tree, the interactivity, and one deliberate tradeoff.

**Reinforce**

Problems:

- Name: Users Database
  Description: Build a UI to filter, sort, create, update, and delete users. Full CRUD with optimistic updates — state consistency under async mutations in a context entirely unrelated to device dashboards.

- Name: Wordle
  Description: Build Wordle. Six guesses, per-position letter state, keyboard input, win condition. Every pattern from this path applied simultaneously under a tight state budget.

