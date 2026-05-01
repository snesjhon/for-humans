Complete React Interview Path

---

## Philosophy

This path is for senior engineers who use React daily but want to defend every decision under interview pressure. TypeScript is not treated as a separate track — six of the thirteen steps pair a TypeScript concept directly with the React problem it solves. The TS concept is introduced at the moment the React code makes it feel necessary, not as an abstract prerequisite.

All React questions are Medium or Hard, sourced from the [Great Frontend React Interview Playbook](https://www.greatfrontend.com/questions/react-interview-questions). They are grouped by concept, not difficulty.

### How It Works

- **What You Learn** — The concept being tested. Solidify the model before writing code.
- **Practice** — Questions that apply the concept directly. Do these before moving on.
- **Revisit** — Return after 1–2 more steps. These expose edges you won't see the first time.

---

## 🌱 Phase 1: Novice

**Goal**: Confirm that the mental models senior engineers think they have are actually solid. State-as-snapshot, effect cleanup, and the closure trap are the root cause of the majority of Phase 2 and 3 bugs.

---

### Step 1: State-Driven UI

**What You Learn**:

- `useState` as a snapshot — the state value you read in a handler is the value from that render, period
- Why batching means multiple `setState` calls don't mean multiple re-renders
- Hover state + selection state as two distinct, interacting pieces of state
- When a single state object is cleaner than multiple `useState` calls

**Practice** _(do these now)_:

- [ ] **Like Button** _(Medium)_ — Build a Like button that changes appearance based on its state. Focus on the state shape, not the styling.
- [ ] **Star Rating** _(Medium)_ — Build a star rating component that shows a row of star icons for users to select the number of filled stars corresponding to the rating. Hover and selected state that interact.
- [ ] **Todo List** _(Medium)_ — Build a Todo list that lets users add new tasks and delete existing tasks. Key assignment and immutable list updates.

**Revisit** _(return to after Step 2)_:

- [ ] **Stopwatch** _(Medium)_ — Build a stopwatch widget that can measure how much time has passed. The timer version of the snapshot problem — state doesn't subscribe to time, you have to.

**Why First**: The snapshot model is the lens everything else is read through. If state feels like a live variable, effects and closures will never make sense.

---

### Step 2: Effects, Timers & Cleanup

**What You Learn**:

- The effect lifecycle: setup runs after paint, cleanup runs before the next effect and on unmount
- Why `setInterval` inside an effect without cleanup leaks and silently breaks in StrictMode
- How interval drift happens and why syncing to a real clock requires a different approach
- `AbortController` for cancelling fetch on unmount or dependency change

**Practice** _(do these now)_:

- [ ] **Traffic Light** _(Medium)_ — Build a traffic light where the lights switch from green to yellow to red after predetermined intervals and loop indefinitely. What happens when the component unmounts mid-cycle?
- [ ] **Digital Clock** _(Medium)_ — Build a 7-segment digital clock that shows the current time. Interval drift is the gotcha.
- [ ] **Stopwatch** _(Medium)_ — Build a stopwatch widget that can measure how much time has passed. Start/stop/reset with intervals forces explicit cleanup across user interactions.

**Why Now**: Cleanup is where most engineers write wrong code in production. StrictMode double-fires effects specifically to expose these bugs — if your code survives StrictMode, it's probably correct.

---

## 🎓 Checkpoint: Novice → Studied

**You should now be able to**:

- Explain the snapshot model and reproduce a stale state bug on demand
- Write effects with correct cleanup for timers and fetch cancellation
- Identify when StrictMode is surfacing a real bug vs being annoying

---

## 📚 Phase 2: Studied

**Goal**: The patterns that distinguish senior engineers. Every step here introduces something that looks fine on first pass and breaks under a real constraint.

---

### Step 3: Component Composition

**What You Learn**:

- Compound components: parent owns state, children consume it through context or explicit props
- Lifting state up — and when the resulting coupling is a design smell, not a solution
- Portal-based components: rendering outside the current DOM subtree while keeping React tree context
- Recursive components: when a component must render itself

**Practice** _(do these now)_:

- [ ] **Tabs** _(Medium)_ — Build a tabs component that displays a list of tab elements and one associated panel of content at a time. The compound component pattern at its clearest.
- [ ] **Modal Dialog** _(Medium)_ — Build a reusable modal dialog component that can be opened and closed. Composition that escapes the DOM tree via a portal.

**Revisit** _(return to after Step 7)_:

- [ ] **File Explorer** _(Medium)_ — Build a file explorer component to navigate files and directories in a tree-like hierarchical viewer. A component that renders a tree by rendering itself.

---

### Step 4: Data Fetching & Async State + Conditional Types _(TypeScript)_

**TypeScript — Conditional Types & `infer`**:

- The `T extends U ? X : Y` structure and how TypeScript distributes it over unions
- `infer` for extracting nested types — the mechanism behind `ReturnType<T>`, `Awaited<T>`, and every utility type that "unwraps" a wrapper
- Why `Awaited<Promise<Promise<string>>>` resolves to `string`, not `Promise<string>`
- Non-distributive conditional types: wrapping in a tuple to suppress distribution when you need it

**React — Data Fetching & Async State**:

- The four states of async: idle, loading, success, error — and why missing one breaks the UI
- Race conditions in effects: the second request resolving before the first
- Why `useEffect` + `useState` for data fetching produces repetitive boilerplate — and what the abstraction looks like
- Client-side vs server-side pagination as a state design question

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Write `Awaited<T>` from scratch using `infer` — verify it unwraps nested promises correctly
- [ ] Write `ReturnType<T>` from scratch — then write `AsyncReturnType<T>` that combines both
- [ ] Type the four async states as a discriminated union: `AsyncState<T>` where each `status` branch carries different data

_React:_

- [ ] **useQuery** _(Medium)_ — Implement a hook that manages a promise resolution. Type it with `AsyncState<T>` — race condition handling is required.
- [ ] **Job Board** _(Medium)_ — Build a job board that displays the latest job postings from Hacker News. Loading and error states, re-fetch on page change.
- [ ] **Data Table** _(Medium)_ — Build a users data table with pagination features. Where does the page state live?

**Revisit** _(return to after Step 8)_:

- [ ] **Data Table II** _(Medium)_ — Build a users data table with sorting features. How does sort state interact with page state?
- [ ] Write `IsUnion<T>` that returns `true` for union types — where does naive `T extends T` break?

---

### Step 5: Collection & State Shape Hooks + Generics _(TypeScript)_

**TypeScript — Generics in Depth**:

- How TypeScript infers generic parameters from call-site context — you rarely need to annotate
- Constraining type parameters with `extends`: `useMap<K extends string, V>` vs an unconstrained `K`
- When to add a type parameter vs when inference handles it — the over-generic hook is its own problem
- Generic functions that return different shapes based on input: the hook's return type depends on `T`

**React — Collection & State Shape Hooks**:

- When primitive `useState` isn't enough: arrays, maps, sets as first-class state
- Immutable update patterns — why you cannot mutate state and why React can't always catch it when you do
- Stable references: why a new array from `useState` triggers downstream effects even when contents haven't changed
- Return shape design: tuple vs object, and when one is strictly better

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Write `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` without using the built-in `Pick`
- [ ] Write `groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]>` — why does `K` need the `keyof T` constraint?
- [ ] Write `mapValues<T, U>(obj: T, fn: (val: T[keyof T]) => U): Record<keyof T, U>` — what does the return type preserve?

_React:_

- [ ] **useArray** _(Medium)_ — Implement a hook that manages an array of items. Tests immutable update discipline.
- [ ] **useSet** _(Medium)_ — Implement a hook that manages a JavaScript set. Membership toggling and stable reference semantics.
- [ ] **useMap** _(Medium)_ — Implement a hook that manages a JavaScript map. Key-value state with typed access patterns.
- [ ] **useObject** _(Medium)_ — Implement a hook that manages an object value. The `setState` spread pattern and its limits.
- [ ] **useStep** _(Medium)_ — Implement a hook that manages a step counter for a multi-step process. A state invariant enforced by the hook, not the caller.

**Revisit** _(return to after Step 10)_:

- [ ] **Transfer List** _(Medium)_ — Build a component that allows transferring items between two lists. The state shape is the entire problem.
- [ ] Write a generic `useLocalStorage<T>(key: string, initial: T)` signature — why does `T` need a constraint for serialization?

---

### Step 6: DOM, Events & Browser API Hooks + Template Literal Types _(TypeScript)_

**TypeScript — Template Literal Types**:

- String manipulation at the type level: `type OnEvent<T extends string> = \`on${Capitalize<T>}\``
- Why `keyof HTMLElementEventMap` is the typed version of "any DOM event name"
- Combining template literals with mapped types to generate typed event handler shapes
- When template literal types are expressive vs when they become unmaintainable string puzzles

**React — DOM, Events & Browser API Hooks**:

- `useRef` for DOM nodes: attach in JSX, read in effects and handlers, never during render
- Event listener lifecycle: attach in effect setup, remove in cleanup — the same pattern every time
- Why browser APIs like `matchMedia`, `ResizeObserver`, and `getBoundingClientRect` need SSR guards
- Composing multiple DOM hooks: when a hook takes a ref vs creates one internally

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Write `EventNames<T extends string>` that prefixes each union member with `"on"` — `EventNames<'click' | 'focus'>` → `'onClick' | 'onFocus'`
- [ ] Type `useEventListener` so the `handler` parameter is automatically narrowed based on the event name — `'click'` gets `MouseEvent`, `'keydown'` gets `KeyboardEvent`
- [ ] Write `Split<S extends string, D extends string>` that splits a string type into a tuple of its parts

_React:_

- [ ] **useClickOutside** _(Medium)_ — Implement a hook that detects clicks outside of a specified element. The pattern behind every dropdown and popover dismiss.
- [ ] **useEventListener** _(Medium)_ — Implement a hook that subscribes to browser events. Abstracts the attach/cleanup pattern into one hook.
- [ ] **useHover** _(Medium)_ — Implement a hook that tracks whether an element is being hovered. Combines ref + two event listeners.
- [ ] **useWindowSize** _(Medium)_ — Implement a hook that returns the current height and width of the window. SSR safety and resize debounce.
- [ ] **useMediaQuery** _(Medium)_ — Implement a hook that subscribes and responds to media query changes (e.g. screen size, resolution, orientation, etc.). Subscribing to a browser API without polling.
- [ ] **useBreakpoint** _(Medium)_ — Implement a hook that returns the current breakpoint name based on the current window width. Composition on top of `useWindowSize`.

**Revisit** _(return to after Step 10)_:

- [ ] **useKeyPress** _(Medium)_ — Implement a hook that subscribes to keyboard events. Modifier key combinations and cleanup.
- [ ] **useIdle** _(Medium)_ — Implement a hook that detects user inactivity. Multiple event sources resetting a single timer.

---

### Step 7: Timing & Scheduling Hooks

**What You Learn**:

- Debounce vs throttle: delay until quiet vs allow at most once per interval — not interchangeable
- The stale closure problem in `setInterval`: why the callback captures the value from when it was created
- `useRef` as the escape hatch for a stable reference to a changing callback
- Countdown state: tick management without drift, stop condition without an effect loop

**Practice** _(do these now)_:

- [ ] **useTimeout** _(Medium)_ — Implement a hook that invokes a callback function after a specified delay. Tests cleanup when delay or callback changes between renders.
- [ ] **useInterval** _(Medium)_ — Implement a hook that creates an interval that invokes a callback function at a specified delay. The stale closure is the problem to solve.
- [ ] **useDebounce** _(Medium)_ — Implement a hook that debounces a value. Cleanup must cancel the pending timeout when the value changes.
- [ ] **useThrottle** _(Medium)_ — Implement a hook that throttles a value. Leading vs trailing edge as an explicit design choice.
- [ ] **useCountdown** _(Medium)_ — Implement a hook that manages a countdown. Combines interval, state, and a stop condition cleanly.

---

### Step 8: Rich Interactive UI

**What You Learn**:

- Multi-image state: navigation index, loading lifecycle, transition state as separate concerns
- Animation state: how to layer transition state on top of selection state without coupling them
- Input control beyond `value`/`onChange`: dirty, touched, and when validation fires as a small state machine
- When a revisit of an earlier component reveals what you actually understand now vs then

**Practice** _(do these now)_:

- [ ] **Image Carousel** _(Medium)_ — Build an image carousel that displays a sequence of images. Navigation index and image loading states as distinct state.
- [ ] **Image Carousel II** _(Medium)_ — Build an image carousel that smoothly transitions between images. Animation state layered on top of the base.
- [ ] **useInputControl** _(Medium)_ — Implement a hook that manages a controlled input value and tracks its dirty & touched state. The core of any form library.

**Revisit** _(return to after Step 11)_:

- [ ] **Undoable Counter** _(Medium)_ — Build a counter with a history of the values and ability to undo/redo actions. The `useReducer` pattern starts to feel necessary here.

---

## 🎓 Checkpoint: Studied → Advanced

**You should now be able to**:

- Implement any standard custom hook (debounce, throttle, event listener, DOM ref) from scratch
- Type a generic hook correctly — constrain `T`, design the return shape, avoid over-annotation
- Write `Awaited<T>` and `ReturnType<T>` from scratch and explain how `infer` works
- Type `useEventListener` so handler types narrow automatically based on the event name
- Design the state shape for a compound component before writing a line of code
- Handle async state with all four states and correct race condition cancellation

---

## 🎯 Phase 3: Advanced

**Goal**: Accessibility, complex state, and performance — the patterns that separate senior from staff-level in code reviews and design discussions.

---

### Step 9: Accessibility & Keyboard Interaction + Branded Types _(TypeScript)_

**TypeScript — Branded & Opaque Types**:

- Why structural typing causes accidental substitution: two `string` values that must refer to the same DOM element look identical to TypeScript
- The branded type pattern — adding a nominal signal with no runtime cost: `type AriaId = string & { readonly _brand: 'AriaId' }`
- Using `declare const _brand: unique symbol` for stronger brands that can't be spoofed
- `satisfies` vs type assertion vs annotation — what each one actually permits and what it silently allows

**React — Accessibility & Keyboard Interaction**:

- ARIA roles, states, and properties: what the browser and assistive technology actually do with them
- The difference between "announces correctly to a screen reader" and "works without a mouse" — both are required
- Focus management: trapping focus inside a dialog, restoring it to the trigger on close
- Keyboard navigation patterns per the ARIA spec: arrow keys for widget navigation, Tab for page navigation, Escape for dismissal

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Create `ElementId`, `LabelId`, and `DescriptionId` brands — model the constraint that `aria-labelledby` must reference a real element ID
- [ ] Write a `createId(prefix: string): ElementId` factory — reproduce the bug it prevents: passing a raw `string` where an `ElementId` is required
- [ ] Write `Validated<T>` — a brand that marks a value as having passed runtime validation. Where does `satisfies` help here and where does it not?

_React:_

- [ ] **Tabs II** _(Medium)_ — Build a semi-accessible tabs component that has the right ARIA roles, states, and properties. `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`.
- [ ] **Accordion II** _(Medium)_ — Build an accessible accordion component that has the right ARIA roles, states, and properties. `aria-expanded`, `aria-controls`, `aria-labelledby`.
- [ ] **Modal Dialog II** _(Medium)_ — Build a semi-accessible modal dialog component that has the right ARIA roles, states, and properties. `role="dialog"`, `aria-modal`, `aria-labelledby`.
- [ ] **Modal Dialog III** _(Medium)_ — Build a moderately-accessible modal dialog component that supports common ways to close the dialog. Escape key, backdrop click, close button — all three are required.
- [ ] **Tabs III** _(Medium)_ — Build a fully accessible tabs component that has keyboard support according to ARIA specifications. Arrow keys navigate tabs; Tab moves to the panel.
- [ ] **Accordion III** _(Medium)_ — Build a fully accessible accordion component that has keyboard support according to ARIA specifications. Arrow key navigation between headers per the spec.
- [ ] **Modal Dialog IV** _(Hard)_ — Build a fully-accessible modal dialog component that supports all required keyboard interactions. Focus trap: Tab and Shift+Tab cycle within the dialog only.

**Why Now**: Accessibility is increasingly a pass/fail signal in senior interviews. The component composition model from Step 3 has to be solid first — ARIA roles map directly onto the compound component structure.

---

### Step 10: Complex State & Reducers + Mapped Types _(TypeScript)_

**TypeScript — Mapped Types & Modifiers**:

- Key remapping with `as` clauses: derive new property names from existing ones
- Modifier syntax: `-readonly` removes immutability, `-?` removes optionality — both can be added with `+` or by default
- Homomorphic vs non-homomorphic mapped types: homomorphic ones preserve modifiers, non-homomorphic ones don't
- Modeling reducer state: write `State` once, derive `Partial<State>` for patch actions, `Readonly<State>` for the store interface, `Required<State>` for validation — all from one source-of-truth type

**React — Complex State & Reducers**:

- When `useReducer` produces clearer code than multiple `useState` calls — and when it doesn't
- Modeling UI as a finite set of valid states: impossible states become unrepresentable
- Discriminated union actions: the action type narrows the payload automatically
- Undo/redo as a reducer pattern: past, present, and future as explicit state fields

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Write `Mutable<T>` — removes `readonly` from every property. Then write `DeepMutable<T>`.
- [ ] Write `RequiredDeep<T>` — removes optionality recursively. Where does a naive version break on union types?
- [ ] Model a reducer: write `State` once, then derive `PatchAction` (uses `Partial<State>`), `StoreContract` (uses `Readonly<State>`), and `ValidationInput` (uses `Required<State>`) without repeating the shape

_React:_

- [ ] **Undoable Counter** _(Medium)_ — Build a counter with a history of the values and ability to undo/redo actions. The canonical reducer example: past/present/future.
- [ ] **Tic-tac-toe** _(Medium)_ — Build a tic-tac-toe game that is playable by two players. Turn state, win detection, board as an array — a reducer fits naturally.
- [ ] **Transfer List** _(Medium)_ — Build a component that allows transferring items between two lists. Revisit: does a reducer make the state transitions clearer?
- [ ] **File Explorer** _(Medium)_ — Build a file explorer component to navigate files and directories in a tree-like hierarchical viewer. Reducer state with a recursive tree structure.
- [ ] **Nested Checkboxes** _(Hard)_ — Build a nested checkboxes component with parent-child selection logic. The state machine is the hard part.
- [ ] **Tic-tac-toe II** _(Hard)_ — Build an N x N tic-tac-toe game that requires M consecutive marks to win. Generalizing the state model.

**Revisit** _(return to during final review)_:

- [ ] **Connect Four** _(Medium)_ — Build a game for two players who take turns to drop colored discs from the top into a vertically suspended board/grid. Gravity mechanic and win detection.
- [ ] **Transfer List II** _(Hard)_ — Build a component that allows transferring items between two lists, bulk selection/unselection of items, and adding new items. State complexity compounds.

---

### Step 11: Performance & Render Optimization

**What You Learn**:

- Why most re-renders are fine and premature optimization is the actual performance problem
- `useMemo` and `useCallback`: the real cost is complexity, not runtime — use them when you can measure the difference
- Stable references as the prerequisite for memoization: if the input changes every render, the memo is useless
- Minimal DOM footprint: virtual rendering patterns for large or animated lists

**Practice** _(do these now)_:

- [ ] **Data Table III** _(Hard)_ — Build a generalized data table with pagination and sorting features. State interaction at scale.
- [ ] **Image Carousel III** _(Hard)_ — Build an image carousel that smoothly transitions between images and has a minimal DOM footprint. Virtual-list style rendering for an image sequence.
- [ ] **Selectable Cells** _(Hard)_ — Build an interface where users can drag to select multiple cells within a grid. High-frequency pointer events against a fixed render budget.

**Revisit** _(return to during final review)_:

- [ ] Revisit **Data Table** from Step 4 — where would re-renders hurt in a 10k-row dataset? What is the minimal fix?

---

### Step 12: Advanced Hook Patterns + Variance _(TypeScript)_

**TypeScript — Variance & Function Types**:

- Covariance vs contravariance: return types are covariant (broader is assignable), parameter types are contravariant (narrower is not assignable to broader)
- Why `(dog: Dog) => void` is not assignable to `(animal: Animal) => void` — and why this matters in hook callbacks
- TypeScript's `in`/`out` variance annotations on type parameters
- How method vs property syntax changes variance in interfaces — and the unsoundness it quietly introduces

**React — Advanced Hook Patterns**:

- Mediated state: updates pass through a processing function before being stored — the pattern behind formatters and validators
- `useInputControl` as a state machine: the valid transitions between pristine, dirty, touched, and validated
- `useIdle` as a multi-source state machine: any user event resets a single countdown
- When to reach for `useSyncExternalStore` instead of `useState` — subscribing to external state without tearing

**Practice** _(do these now)_:

_TypeScript:_

- [ ] Reproduce the variance hole in TypeScript's method shorthand — write a type-unsafe assignment it silently allows, then show the property syntax version that catches it
- [ ] Write an interface with `in`/`out` variance annotations and explain what each restricts at call sites
- [ ] Write a `Contravariant<T>` wrapper and show where it appears in real custom hook code — event handlers, `useEffect` callbacks, `useCallback` dependencies

_React:_

- [ ] **useMediatedState** _(Medium)_ — Implement a hook that is similar to useState, but supports a mediation process. The foundation of controlled value formatting.
- [ ] **useInputControl** _(Medium)_ — Implement a hook that manages a controlled input value and tracks its dirty & touched state. Revisit with the state machine framing: map out the valid state transitions before writing code.
- [ ] **useIdle** _(Medium)_ — Implement a hook that detects user inactivity. Multiple event sources, one timer — a small but real state machine with a non-trivial cleanup story.

---

### Step 13: Full-Feature Applications

**What You Learn**:

- Combining state machines, async, accessibility, and performance in a single component tree
- Identifying which problems belong in local state, a reducer, or an external store
- Scoping features: what state is shared, what is local, and what triggers re-renders across the tree

**Practice** _(do these now)_:

- [ ] **Users Database** _(Medium)_ — Build a UI to filter, create, update, and delete users. Full CRUD with optimistic update patterns.
- [ ] **Whack-A-Mole** _(Medium)_ — Build a popular arcade game where players attempt to hit moles as they pop up from holes in a board. Timer coordination + game state.
- [ ] **Memory Game** _(Medium)_ — Build a memory game where the player needs to match pairs of cards. Turn sequencing as a state machine.
- [ ] **Connect Four** _(Medium)_ — Build a game for two players who take turns to drop colored discs from the top into a vertically suspended board/grid. Full game loop with column gravity + win detection + player turns.
- [ ] **Wordle** _(Hard)_ — Build Wordle, the word-guessing game that took the world by storm. Six guesses, per-position letter state, keyboard input — every pattern from this path at once.

---

## 🎓 Final Checkpoint

**You should now be able to**:

- Implement any hook from Phase 2 from scratch, including cleanup and edge cases
- Write `Awaited<T>`, `ReturnType<T>`, `Mutable<T>`, and `RequiredDeep<T>` from scratch and explain the mechanism behind each
- Type a generic hook with proper constraints and explain what the constraint is enforcing
- Add correct ARIA roles and full keyboard support to any interactive component
- Model complex UI as a finite state machine and defend the state shape in a code review
- Explain why a specific render optimization is or is not worth the added complexity
- Build a full-feature application and justify where each piece of state lives

---

## Key Principles

### TypeScript and React Compound

The six TypeScript sections are placed where the React problem makes the type concept feel necessary — not as prerequisites. Generics land when you're writing typed collection hooks. Template literals land when you're typing event names. Variance lands when callback types in hooks start surprising you.

### Concept Before Code

Each step introduces what to think about. The questions reinforce it. Jumping straight to the question turns the exercise into memorization, not understanding.

### Revisit Questions Are Not Optional

Revisit questions exist because full understanding requires context you don't have the first time through. Do them after completing the steps they reference.

### Correctness Before Performance

Phases 1–2 are entirely about correctness. Phase 3 does not start with performance — it starts with accessibility, which is correctness at a different layer. Performance comes last because an optimized-but-broken component is still broken.
