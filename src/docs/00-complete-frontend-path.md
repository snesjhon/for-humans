Complete Frontend Interview Path: TypeScript & React

---

## Philosophy

This path targets senior engineers preparing for front-end heavy interviews. It skips syntax and first-principles React. Every section focuses on the parts that catch experienced engineers off-guard: type system corners, closure semantics, rendering guarantees, and patterns that only make sense once you understand why React works the way it does.

TypeScript and React are not taught as separate tracks. Each phase introduces a TS concept and a React concept that reinforce each other — you apply the type tool immediately in the hook context where it matters.

### How It Works

- **Practice** — Work through these first. Goal: build the mental model, understand the why, move on.
- **Revisit** — Return after completing 1-2 more sections. These expose the edge cases interviewers actually probe.

Each section has a fundamentals guide and exercises that run through the test runner. No browser needed.

---

## 🌱 Phase 1: Novice

**Goal**: Close the gap between "knows React and TypeScript" and "understands why they work the way they do." Everything here targets the root cause of the most common senior-level mistakes.

### Why Start Here?

Every bug in Phase 2 and 3 has its root in something from this phase. Stale state, broken types, infinite effect loops — all traceable to closure mechanics, generic inference, or effect lifecycle misunderstood. Fix the mental model first.

---

### Step 1: Generics in Depth _(TypeScript)_

**What You Learn**:

- How TypeScript infers generic parameters from call-site context
- Constraining type parameters with `extends`
- When to add type parameters vs when inference handles it
- Generic functions that return different shapes based on input

**Practice** _(do these now)_:

- [ ] Write `pick<T, K extends keyof T>` without using the built-in `Pick`
- [ ] Write a type-safe `groupBy<T>` that returns `Record<string, T[]>`
- [ ] Write `mapValues<T, U>` that transforms object values while preserving keys

**Revisit** _(return to after Step 3)_:

- [ ] Write a generic `useLocalStorage<T>` hook signature — why does `T` need a default?
- [ ] Write a function overload where generics alone aren't enough

**Why First**: Every typed hook, every utility type, every conditional type builds on generics. You cannot type React correctly without this foundation.

---

### Step 2: Closure Captures & Stale State _(React)_

**What You Learn**:

- How closures capture values at creation time, not execution time
- Why stale state in `setInterval`, event handlers, and effects happens and how to reproduce it
- The `useRef` escape hatch for values you need to read without re-subscribing
- The `useEvent` pattern — stable reference with a fresh closure body

**Practice** _(do these now)_:

- [ ] Write a counter where `setInterval` always logs the initial count — then fix it
- [ ] Demonstrate stale state in a click handler — a value captured at render, read later
- [ ] Write `useLatestRef<T>` — a hook that always gives the latest value without adding it to a dep array

**Revisit** _(return to after Step 5)_:

- [ ] Implement the `useEvent` RFC pattern — why can't `useCallback` alone solve this?
- [ ] Write a test that proves a `useRef` fix works when `useState` would cause a stale closure

**Why Now**: Every other hook question is a variation of this. Every dep array question is a closure question. Build the model once here.

---

### Step 3: Effect Semantics & Cleanup _(React)_

**What You Learn**:

- The effect lifecycle: setup runs after paint, cleanup runs before the next effect and on unmount
- Why StrictMode double-fires effects and what that reveals about correctness
- How to cancel fetches, clear timers, and remove subscriptions correctly
- When effects are the wrong tool entirely

**Practice** _(do these now)_:

- [ ] Write an effect that subscribes to a WebSocket — add cleanup so re-renders don't leak connections
- [ ] Write a fetch effect where a second render cancels the first request using `AbortController`
- [ ] Deliberately break cleanup, then fix it — make StrictMode reveal the bug

**Revisit** _(return to after Step 5)_:

- [ ] Write `useSubscribe<T>` — a hook that handles any observable cleanly
- [ ] List the three things a cleanup function must do to be correct

**Why Now**: Cleanup is where most engineers write wrong code in production. Effects without cleanup are bugs that only appear under race conditions.

---

### Step 4: Conditional Types & `infer` _(TypeScript)_

**What You Learn**:

- The `T extends U ? X : Y` structure and how it distributes over unions
- Extracting nested types with `infer`
- Non-distributive conditional types — wrapping in a tuple to suppress distribution
- `NoInfer<T>` and when TypeScript over-widens

**Practice** _(do these now)_:

- [ ] Write `ReturnType<T>` from scratch using `infer`
- [ ] Write `Awaited<T>` — what does it do with `Promise<Promise<string>>`?
- [ ] Write `IsUnion<T>` that returns `true` for union types, `false` for singles

**Revisit** _(return to after Step 7)_:

- [ ] Write `DeepReadonly<T>` — where does a naive recursive version break?
- [ ] Write `UnionToIntersection<U>` and explain the contravariance trick

**Why Now**: `infer` is the mechanism behind every utility type. After writing `useLatestRef<T>` and `useSubscribe<T>`, you have the right context to understand why these types are shaped the way they are.

---

### Step 5: Dependency Arrays _(React)_

**What You Learn**:

- What `exhaustive-deps` is actually telling you — and when it is wrong
- Why objects and functions as dependencies cause infinite loops
- When adding a function to deps should be replaced by moving the function inside the effect
- The difference between a dep that changes every render and one that changes every time its upstream changes

**Practice** _(do these now)_:

- [ ] Write an effect with an object dependency that loops — identify the root cause and three ways to fix it
- [ ] Write a `useCallback` where deps include a function from props — show the version without `useCallback` is sometimes cleaner
- [ ] Write `usePrevious<T>` — why can it have an empty dep array?

**Revisit** _(return to after Step 8)_:

- [ ] Find every legitimate use of `// eslint-disable-next-line react-hooks/exhaustive-deps` and the ones that are just wrong
- [ ] Write an effect that deliberately removes a dependency and prove it is still correct

**Why Now**: Dep arrays are the most common source of debugging questions in front-end interviews. You now have the closure model (Step 2) and type tools (Step 4) to reason about them structurally.

---

## 🎓 Checkpoint: Novice → Studied

**You should now be able to**:

- Reproduce a stale closure bug on demand
- Write effects with correct cleanup for any subscription or async operation
- Explain dep array issues at the root cause level — not just "add it to the array"
- Write a generic utility type and explain what the constraint is doing

---

## 📚 Phase 2: Studied

**Goal**: Handle the patterns that distinguish senior engineers in code reviews and design discussions. Every section here is something that looks fine at first and breaks in a non-obvious way.

---

### Step 6: Mapped Types & Modifiers _(TypeScript)_

**What You Learn**:

- Key remapping with `as` clauses
- Modifier syntax: `-readonly`, `-?`, `+?`
- Homomorphic vs non-homomorphic mapped types
- When mapped types preserve vs discard the original shape

**Practice** _(do these now)_:

- [ ] Write `Mutable<T>` — removes `readonly` from every property
- [ ] Write `RequiredDeep<T>` — removes optionality recursively
- [ ] Write `Getters<T>` — maps `{ name: string }` to `{ getName: () => string }`

**Revisit** _(return to after Step 9)_:

- [ ] Write `EventMap<T>` — maps `{ click: MouseEvent }` to `{ onClick: (e: MouseEvent) => void }`
- [ ] Explain why `Partial<Readonly<T>>` and `Readonly<Partial<T>>` are the same shape but not the same type

**Why Now**: After writing typed hooks and cleanup patterns, you have enough context to understand why modifier control matters — especially when React's types use `readonly` to prevent mutation during render.

---

### Step 7: `ref` vs `state` _(React)_

**What You Learn**:

- The fundamental distinction: `ref` mutation does not schedule a re-render
- When mutation is the correct choice and why React's model permits it
- Using refs to hold DOM nodes, previous values, instance variables, and stable callbacks
- The rule: never read a ref during render

**Practice** _(do these now)_:

- [ ] Write `useToggle` twice — once with `useState`, once with `useRef` — explain when each is appropriate
- [ ] Write a focus manager that imperatively focuses a field without triggering a re-render
- [ ] Write `useRenderCount` — a hook that tracks re-renders without causing them

**Revisit** _(return to after Step 10)_:

- [ ] Build `useDebouncedValue<T>` using refs for the timer, state for the output — explain the division
- [ ] Write a hook that keeps a "live" callback without the `useCallback` ceremony

**Why Now**: The ref/state boundary tests React rendering model understanding, not API knowledge. Combined with the closure model from Step 2, this completes the picture of what React actually tracks.

---

### Step 8: Template Literal Types _(TypeScript)_

**What You Learn**:

- String manipulation at the type level
- Combining template literals with mapped types
- Parsing route strings and event names into typed structures
- When template literal types are expressive vs when they become unmaintainable

**Practice** _(do these now)_:

- [ ] Write `EventNames<T extends string>` that prefixes each union member with `"on"`
- [ ] Write `Split<S extends string, D extends string>` that splits a string type into a tuple
- [ ] Type a `css` helper so `css({ paddingTop: 8 })` rejects unknown CSS properties

**Revisit** _(return to after Step 11)_:

- [ ] Type an API router so `get('/users/:id')` extracts `{ id: string }` as the params type
- [ ] Write `CamelCase<S>` that converts `"user_first_name"` to `"userFirstName"` at the type level

**Why Now**: After mapped types you have the two tools that combine into the most complex TypeScript patterns. Template literals are what interviewers reach for when testing type system depth at senior level.

---

### Step 9: Custom Hook Composition _(React)_

**What You Learn**:

- Hooks as composable units of behavior, not state wrappers
- Hook factories: functions that return hooks with closed-over configuration
- Typing generic hooks correctly: `useAsync<T>`, `useLocalStorage<T>`, `useFetch<T>`
- What "don't call hooks conditionally" actually means structurally

**Practice** _(do these now)_:

- [ ] Write `useAsync<T>(fn: () => Promise<T>)` — handle loading, error, and data with correct types
- [ ] Write `useLocalStorage<T>(key: string, initialValue: T)` — including SSR safety
- [ ] Write `useDebounce<T>(value: T, delay: number)` — explain the cleanup

**Revisit** _(return to after Step 12)_:

- [ ] Compose `useAsync` and `useDebounce` into `useDebouncedSearch<T>` — where does the race condition hide?
- [ ] Write a hook that conditionally wraps another hook — why does this break the rules and what is the correct structure?

**Why Now**: This is where Phases 1 and 2 converge. Writing `useAsync<T>` correctly requires generics (Step 1), closure awareness (Step 2), cleanup (Step 3), and dep array reasoning (Step 5) simultaneously.

---

### Step 10: Branded & Opaque Types _(TypeScript)_

**What You Learn**:

- Why structural typing causes accidental substitution bugs
- The branded type pattern and how it works without runtime cost
- Using `declare const _brand: unique symbol` for stronger brands
- `satisfies` vs type assertion vs annotation — what each actually permits

**Practice** _(do these now)_:

- [ ] Create `UserId`, `PostId`, and `CommentId` — prevent mixing them at compile time
- [ ] Write a `createUser` that returns `UserId`, not `string`
- [ ] Reproduce the bug branded types prevent: a function that silently accepted the wrong ID type

**Revisit** _(return to after Step 13)_:

- [ ] Write a `Validated<T>` brand that marks a value as having passed runtime validation
- [ ] Explain when `satisfies` does something type assertions cannot

**Why Now**: Branded types come up in senior interviews as a proxy for structural typing fluency. After writing generic hooks, you have real context for when accidental substitution matters.

---

## 🎓 Checkpoint: Studied → Advanced

**You should now be able to**:

- Write and compose custom hooks with correct types and dep semantics
- Explain the ref/state boundary without hedging
- Use mapped and template literal types to model real API shapes
- Identify the closure root cause in any hook bug

---

## 🎯 Phase 3: Advanced

**Goal**: The patterns that appear in staff-level design discussions and the type system depth that separates senior from principal. Every section here requires everything that came before it.

---

### Step 11: `useReducer` & State Machines _(React)_

**What You Learn**:

- When `useReducer` is clearer than multiple `useState` calls
- Modeling UI states as a finite set — prevents impossible states
- Discriminated union actions for type-safe reducers
- Derived state vs stored state — when to compute vs when to store

**Practice** _(do these now)_:

- [ ] Model a multi-step form as a reducer — what impossible states does `useState` allow that the reducer prevents?
- [ ] Write `useRequestState` — `idle | loading | success | error` typed with discriminated union
- [ ] Write `useUndo<T>` — past, present, future as reducer state

**Revisit** _(return to after Step 14)_:

- [ ] Demonstrate why derived state inside a reducer creates inconsistency — write both versions
- [ ] Port a component with four `useState` calls to `useReducer` — identify what improved and what got worse

---

### Step 12: Variance & Function Types _(TypeScript)_

**What You Learn**:

- Covariance vs contravariance in function parameters
- Why `(dog: Dog) => void` is not assignable to `(animal: Animal) => void`
- TypeScript's `in`/`out` variance annotations
- How method vs property syntax changes variance in interfaces — and the unsoundness it introduces

**Practice** _(do these now)_:

- [ ] Reproduce the variance hole in TypeScript's method shorthand — show the type-unsafe assignment it allows
- [ ] Write an interface using `in`/`out` annotations and explain what each restricts
- [ ] Explain why `Array<Dog>` is not assignable to `Array<Animal>` even though TypeScript sometimes allows it

**Revisit** _(return to during final review)_:

- [ ] Write a `Contravariant<T>` wrapper and show where it appears in real code (event handlers, callbacks)
- [ ] Explain why callback types in props are stricter than method types

**Why Now**: Variance is the hardest TypeScript concept. You need the branded types and conditional type vocabulary from the earlier steps to reason about it correctly.

---

### Step 13: Context Performance _(React)_

**What You Learn**:

- Why every context consumer re-renders when any part of the context value changes
- Context splitting: separating frequently-changing from stable values
- The selector pattern using `useSyncExternalStore` as an alternative for high-frequency updates
- When to reach for external state management instead of context

**Practice** _(do these now)_:

- [ ] Demonstrate the context re-render problem — build a tree where an unrelated consumer re-renders
- [ ] Fix it with context splitting — observe what changes
- [ ] Write a minimal `createStore` that supports selectors without a third-party library

**Revisit** _(return to during final review)_:

- [ ] Implement a selector hook using `useSyncExternalStore` — explain why it prevents tearing
- [ ] Name the three situations where context is correct despite the performance cost

---

### Step 14: Concurrent Mode _(React)_

**What You Learn**:

- The difference between urgent and non-urgent updates
- `useTransition`: marking updates as interruptible
- `useDeferredValue`: the deferred mirror of a value — when to use it vs `useTransition`
- Why debouncing is not the same as deferring
- Suspense as a first-class primitive for async coordination

**Practice** _(do these now)_:

- [ ] Build a filtered list — first with debouncing, then with `useTransition` — contrast the behavior
- [ ] Demonstrate the tearing problem `useSyncExternalStore` solves — then fix it
- [ ] Write a component that uses `Suspense` with a custom async resource, not a library

**Revisit** _(return to during final review)_:

- [ ] Explain in a code review why replacing `useTransition` with debounce is a regression
- [ ] Write a test that catches a transition incorrectly marked as urgent

---

## 🎓 Final Checkpoint

**You should now be able to**:

- Design a state architecture for any feature spec and defend the tradeoffs
- Write utility types from scratch, including recursive and variance-aware variants
- Identify every class of hook bug — closure, cleanup, dep array, render timing — at the root cause level
- Explain concurrent mode to a skeptic without oversimplifying
- Recognize when context, external store, `useReducer`, or local state is the right tool

---

## Key Principles

### No Toy Examples

Every exercise uses patterns from real codebases: typed API clients, form state machines, data-fetching hooks with cancellation. Trivial examples teach the API surface, not the judgment.

### Bugs Before Solutions

Where possible, exercises ask you to reproduce the bug first. You cannot reliably fix what you cannot reliably create.

### TypeScript and React Compound

The phases are interleaved deliberately. Generics before hooks. Conditional types before effect types. Mapped types before context types. The TypeScript sections build vocabulary the React sections immediately spend.

### Mechanism Before Pattern

The interview question is never "do you know the API." It is "do you know why the API is shaped this way." Every section leads with mechanism before showing the pattern it enables.
