Complete Interview Prep Path: Plant Floor Monitor

---

## Philosophy

This path is a single project-progressive curriculum. Eight lessons build one application from scratch — a Plant Floor Monitor dashboard that fetches device and tag status from a mock REST API. The domain matches the kind of frontend work an automations company will test: status dashboards, device lists, alarm indicators, real-time-ish data.

The learner exits with a working project and the vocabulary to walk through every decision under interview pressure.

### How It Works

Each lesson has two assets:

- **Fundamentals** — A conceptual guide that installs the mental model before you write the code. Build with `/fer-fundamentals`. Read before touching the lesson.
- **Scenario** — A Socratic evaluation that tests whether the model held. Build with `/fer-scenario`. Do after the lesson code is written.

The project code is embedded in the lesson files. Each lesson adds to the same codebase — do not skip ahead.

---

## Phase 1: Plant Floor Monitor

**Goal**: Build a typed React dashboard that consumes a REST API. Exit with code you can walk through in an interview.

---

### Lesson 1: Modeling the API Contract

**What You Learn**:

- Why TypeScript interfaces are the contract between the API and the UI
- How `status: 'online' | 'offline' | 'alarm'` prevents a category of bugs that `status: string` quietly allows
- When a discriminated union is more expressive than a flat interface
- What `readonly` costs at the type level versus what it prevents at the value level

**Practice** _(do these now)_:

- [ ] **TypeScript Interfaces & Union Types for API Contracts** _(Fundamentals)_ — The decision model for structuring API payloads as TypeScript types: literal unions vs string, readonly arrays vs mutable, discriminated unions for payloads that share a shape but branch on a field.
- [ ] **Modeling the API Contract** _(Scenario)_ — Given a device API payload, define `Device`, `Tag`, and `Alarm` interfaces. Defend each type decision: why `readonly`, what the union buys, when a discriminated union becomes necessary.

**Why First**: An interview grader notices immediately whether you typed the API response before writing a single fetch call. This lesson establishes the vocabulary every subsequent lesson builds on.

---

### Lesson 2: Writing the Fetch Layer

**What You Learn**:

- Why `Response.ok` must be checked before calling `.json()` — and what error `.json()` silently swallows
- How a generic `apiFetch<T>` wrapper removes the cast-at-call-site pattern and where it would fail
- Why the fetch layer belongs in its own module, not inline in a component
- What typed return values give you versus what they cost

**Practice** _(do these now)_:

- [ ] **The Generic Fetch Wrapper Pattern** _(Fundamentals)_ — The anatomy of a typed API client: `Response.ok` semantics, generic return typing, error boundary placement, and why the wrapper exists as a separate layer from the component.
- [ ] **Writing the Fetch Layer** _(Scenario)_ — Build `apiFetch<T>` and `fetchDevices()`. Explain why the generic is on the wrapper, not cast at the call site, and what happens to a non-200 response before `.json()` is called.

**Revisit** _(return to after Lesson 3)_:

- [ ] What changes if `fetchDevices` is called from two components simultaneously — before `AbortController` exists?

**Why Now**: Most candidates write fetch inline in a component. Separating the fetch layer and typing the response at the boundary is one of the clearest signals in a React interview.

---

### Lesson 3: Async State in React

**What You Learn**:

- The four phases of async state: idle, loading, success, error — and what missing one looks like in the UI
- What a race condition is in this context and why it appears at all in `useEffect`
- How `AbortController` cancels in-flight requests and why the signal goes into fetch options, not the state setter
- Why the cleanup function runs on unmount and before the next effect, not after

**Practice** _(do these now)_:

- [ ] **The Four-Phase Async State Model** _(Fundamentals)_ — How to model loading, error, and success as explicit state, not booleans inferred from data. The race condition anatomy: two requests, one state, wrong order. `AbortController` as the correction, not a performance trick.
- [ ] **Async State in React** _(Scenario)_ — Build `useDevices` with `AbortController` cleanup. Explain what happens if the component unmounts mid-fetch without cleanup, and why the abort signal goes into `fetch()` rather than the `setState` guard.

**Why Now**: Race conditions and missing cleanup are the two most common async bugs in React. Both appear before the UI grows complex enough to hide them — install the patterns now.

---

### Lesson 4: Rendering the Data

**What You Learn**:

- When a JSX expression earns its own component — the signal is repeated structure or independent reuse, not length
- How `DeviceCard` stays decoupled from the fetch layer even though it renders fetch data
- Why typed props enforce the contract between a component and its callers at compile time
- What empty state, loading state, and error state look like as explicit render branches

**Practice** _(do these now)_:

- [ ] **Component Decomposition for Typed Props** _(Fundamentals)_ — The decision model for splitting JSX into components: what each component should own, why typed props replace runtime shape checks, and how conditional rendering for loading/error/empty is structured as explicit branches rather than boolean guards.
- [ ] **Rendering the Data** _(Scenario)_ — Given `useDevices` output, decompose into `DeviceList`, `DeviceCard`, and `StatusBadge`. Defend why `StatusBadge` is its own component, what it would cost to inline it, and how `DeviceCard` avoids coupling to the fetch layer.

**Revisit** _(return to after Lesson 7)_:

- [ ] If `DeviceCard` needed to trigger a re-fetch, where would that state live?

**Why Now**: Component decomposition is evaluated in interviews both by reading the structure and by asking the candidate to defend it. This lesson forces the decision, not just the implementation.

---

### Lesson 5: CSS Layout

**What You Learn**:

- Why `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` produces a responsive layout without a media query
- When a layout calls for Grid versus Flex — and the answer that makes an interviewer nod
- How CSS custom properties replace magic numbers for status color tokens
- What `auto-fill` vs `auto-fit` does when the container has fewer items than columns

**Practice** _(do these now)_:

- [ ] **CSS Grid vs Flexbox for Dashboard Layout** _(Fundamentals)_ — The decision model: Grid for two-dimensional layout, Flex for one-dimensional arrangement within a cell. The `minmax()` + `auto-fill` pattern explained mechanically. Color tokens as custom properties for three-state indicators.
- [ ] **CSS Layout** _(Scenario)_ — Add the grid, card, and badge styles. Explain why `auto-fill` with `minmax` eliminates the need for breakpoint media queries, and what breaks if `minmax(0, 1fr)` is used instead.

**Why Now**: Many senior engineers can write the JavaScript for this project but reach for a component library the moment layout is needed. This lesson tests whether the CSS model is actually solid.

---

### Lesson 6: Interactivity

**What You Learn**:

- What derived state is and why it belongs in the render, not in a `useState` or `useEffect`
- Why putting the filtered list into `useState` creates a sync problem — and why `useEffect` to fix it makes it worse
- The boundary between server state (what `useDevices` owns) and UI state (filter inputs the component owns)
- How event handler types are inferred in React and where explicit annotation is actually needed

**Practice** _(do these now)_:

- [ ] **Derived State vs Managed State** _(Fundamentals)_ — The rule: if a value can be computed from existing state or props, it is derived — do not store it. The antipattern: `useEffect` syncing one `useState` into another. What the correct form looks like and why the render path is the right place for derivation.
- [ ] **Interactivity** _(Scenario)_ — Add the status filter and name search. Explain why the filtered list is computed inline rather than stored in `useState`, and what a reviewer would say about a `useEffect` that syncs filter results.

**Revisit** _(return to after Lesson 7)_:

- [ ] What happens to the filter state when `useDevices` refetches?

**Why Now**: The `useEffect` for derived state is the most common mistake at this level. The interviewer is watching for it. Install the correct instinct before it becomes a habit.

---

### Lesson 7: Extracting the Hook

**What You Learn**:

- What a custom hook should own and what it should delegate — the rule is logic, not lines of code
- Why `useDeviceList` calling `useDevices` is better than a single hook that does both
- What the return shape of a hook says about the contract it's offering to the component
- How to narrate a hook extraction decision in an interview without sounding like you're justifying a refactor

**Practice** _(do these now)_:

- [ ] **Custom Hook Extraction — When and What to Own** _(Fundamentals)_ — The extraction decision model: a hook earns extraction when logic is reusable, when it hides complexity the component shouldn't see, or when the component's render function becomes about wiring instead of rendering. What a hook's return shape signals. When a single composite hook is a warning sign.
- [ ] **Extracting the Hook** _(Scenario)_ — Extract `useDeviceList` from `App.tsx`. Explain what the hook owns versus what it delegates, why merging `useDevices` and `useDeviceList` into one hook would be a mistake, and how the return shape was designed.

**Why Now**: Custom hook extraction is the highest-signal refactor in a React interview. The question is not whether you can extract a hook — it's whether you know when to and what it should own.

---

### Lesson 8: Polish and Walkthrough

**What You Learn**:

- When a derived computation earns a `useMemo` — expensive means measurably slow, not theoretically slow
- What ARIA roles make a visually styled grid legible to a screen reader
- What `aria-label` on a filter control communicates to assistive technology
- How to narrate the full project to an interviewer in under three minutes

**Practice** _(do these now)_:

- [ ] **useMemo for Expensive Derivations & ARIA List Roles** _(Fundamentals)_ — The `useMemo` decision rule: wrap derivations that are genuinely expensive, not ones that feel like they should be. The cost is complexity and a stale-closure risk, not free performance. `role="list"` and `role="listitem"` for custom-styled grids, `aria-label` on form controls.
- [ ] **Polish and Walkthrough** _(Scenario)_ — Add `useMemo`, ARIA roles, and input labels. Walk through the full project verbally: what it does, the data contract, the fetch layer, the state model, the component tree, the interactivity, and one tradeoff made deliberately.

**Why This Last**: `useMemo` is widely misused. Saving it for the final lesson means the learner has seen the derivation pattern without it first — so the `useMemo` decision is genuinely informed, not reflexive.

---

## Capstone: The 3-Minute Walkthrough

After Lesson 8, the learner should be able to narrate the full project without notes. The walkthrough covers:

1. **What it does** — one sentence, user-facing
2. **The data contract** — `Device`, `Tag`, `Alarm` and why they're typed before the fetch
3. **The fetch layer** — `apiFetch<T>`, `Response.ok`, where errors are thrown
4. **The state model** — `useDevices`, four phases, `AbortController`, cleanup
5. **The component tree** — `DeviceList`, `DeviceCard`, `StatusBadge`, props contract
6. **The interactivity** — `useDeviceList`, filter state, derived list, why no `useEffect`
7. **One deliberate tradeoff** — pick one: discriminated union over string, derived over stored, hook extraction boundary

Time limit: three minutes. No notes.
