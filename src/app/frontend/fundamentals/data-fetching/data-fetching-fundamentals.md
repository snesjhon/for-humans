## Overview

Data fetching bugs usually come from mixing two separate problems. The runtime problem is screen state: a request is either idle, loading, successful, or failed, and the UI gets brittle when one of those phases is missing or inferred from unrelated data. The type system problem is payload shape: a loader returns a `Promise`, but the component logic needs the resolved data inside that promise without hard-coding the shape for every hook. This guide teaches both halves as one model.

**The runtime problem:** if `idle`, `loading`, `success`, or `error` is missing, the UI starts guessing state from empty arrays, `null`, or optional fields, and impossible screens slip in.

**The type problem:** a generic fetch helper or hook should preserve the resolved payload type from the loader it receives, not collapse everything to `unknown`.

**Level 1** teaches how `infer` and a hand-written `Awaited<T>` peel promise wrappers until the payload type is exposed.

**Level 2** teaches how to carry that extracted payload into generic async helpers without losing the loader's data shape.

**Level 3** teaches how to model the full four-phase async state as a discriminated union that keeps UI branches explicit and exhaustive.

## Core Concept & Mental Model

The problem from the overview is this: one async operation has two truths at once. At runtime, the UI needs to know what phase the request is in. At compile time, TypeScript needs to know what shape arrives when the request succeeds. The same mechanism model explains both.

### The Sealed Envelope

Imagine every loader hands your component a sealed envelope.

- **envelope** = the `Promise` returned by the loader
- **payload** = the resolved data inside the promise
- **delivery board** = the UI state that says whether the envelope is idle, loading, delivered, or failed
- **`infer`** = the clerk reading the label and pulling out the payload type
- **discriminated union** = the rule that only one delivery-board state can be active at a time

If you skip the delivery board, the UI starts guessing from whether the envelope has arrived yet. If you skip the clerk, your generic hook keeps the envelope but loses the payload type.

### Runtime First: The Four Phases Are Separate Facts

An async request is not "data or no data." It has four distinct phases:

- `idle`: nothing has started yet
- `loading`: work is in flight
- `success`: payload arrived
- `error`: the request failed

Those phases are not interchangeable. An empty array might be a successful response with zero results. `null` might mean "nothing selected yet," not "network request failed." If the phase itself is not explicit, the component has to invent meaning from values that were supposed to represent something else.

That is how UI bugs like these happen:

- missing `idle`: the screen flashes a spinner before the user even triggers the request
- missing `loading`: the previous success data stays visible with no indication that a refresh is in flight
- missing `success`: components keep checking `data && ...` everywhere instead of working against one trusted branch
- missing `error`: failures collapse into empty-state UI, so users see "0 results" instead of "request failed"

### Compile Time Next: `Awaited<T>` Peels The Envelope

At the type level, the hook does not need the envelope itself. It needs the payload inside the envelope. That is what `Awaited<T>` does. It asks, "does this type wrap a promise-like value?" If yes, extract the inner type and keep going. If no, stop and return what is left.

```ts
// Step 1: does Promise<Promise<Device[]>> wrap a Promise? Yes, inner type: Promise<Device[]>
//         recurse with Awaited<Promise<Device[]>>
// Step 2: does Promise<Device[]> wrap a Promise? Yes, inner type: Device[]
//         recurse with Awaited<Device[]>
// Step 3: does Device[] wrap a Promise? No
//         return Device[]
type Devices = Awaited<Promise<Promise<{ id: string }[]>>>;
```

`infer` is the extraction mechanism inside that conditional type. It creates a temporary type variable for "whatever sits inside the promise."

```ts
type MyAwaited<T> =
  T extends Promise<infer Value>
    ? MyAwaited<Value>
    : T;
```

`Value` is not a real runtime variable. It is the type-level name for the payload currently sitting inside the envelope.

### The Hook Stays Generic By Extracting, Not Repeating

Once you can peel the envelope, a generic helper does not need to know whether the loader resolves to `Device[]`, `User`, or `{ items: Product[] }`. It can derive that type from the loader itself.

```ts
type LoaderData<TLoader extends (...args: never[]) => Promise<unknown>> =
  Awaited<ReturnType<TLoader>>;
```

That one line means:

- get the function's return type
- unwrap the promise
- keep the actual payload shape

Now a generic hook can stay generic without erasing the thing the caller actually cares about.

### The Full Model: Delivery Board Plus Payload

The best async state model combines the runtime board and the extracted payload.

```ts
type AsyncState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };
```

The discriminant is `status`. It tells the UI which branch is legal. `TData` tells the success branch what payload shape it owns. Those two facts solve different problems, and both are necessary.

Without the union, the component keeps asking loose questions like "is there data?" Without `Awaited<T>`, the success branch often degrades into `unknown`, which forces casts and breaks the point of having a typed loader in the first place.

---

## Building Blocks: Progressive Learning

### Level 1: Peel The Promise Until You Reach The Payload

The first capability is mechanical but essential: stop treating a loader's return type as the final type you want to work with. A promise is a container. The useful type is the resolved value inside it.

This level uses hand-written conditional types so the extraction is visible instead of magical. You will start with one promise wrapper, then nested wrappers, then apply the same mechanism to an async function's return type. The goal is not to memorize syntax. The goal is to see that `infer` is the bridge from "generic promise" to "specific payload."

#### **Exercise 1**

Write a one-level `UnwrapPromise<T>` that extracts the value from `Promise<T>`. This is the smallest form of the mechanism: if the envelope wraps a payload, expose the payload.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

Extend that idea into a recursive `DeepAwaited<T>` so nested promises still resolve to one final payload type. The point is to make the "keep peeling until you hit a non-promise" behavior explicit.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

Use the same extraction mechanism on an async function by combining `ReturnType` with your promise-unwrapping type. This is the step that makes a generic hook or helper keep the caller's data shape automatically.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "A loader returns an envelope. `infer` peels it until the payload type is exposed."

**→ Bridge to Level 2**: Extracting the payload is only half the job. The next level carries that payload through generic async helpers so success state stays strongly typed.

### Level 2: Let Generic Helpers Inherit The Loader's Data Shape

Now the problem changes. You already know how to peel the envelope. The question is how to stop generic async code from erasing the payload once you have it.

This level types helpers around a loader function itself, not a hard-coded data model. Each exercise keeps the same pattern: derive the success data type from the loader, then let that type flow into the helper's return value or arguments. The hook stays reusable, but `data` still knows exactly what it is.

#### **Exercise 1**

Create `LoaderData<TLoader>` so a generic helper can derive the resolved payload type from any async loader function. The answer should come from the loader's return type, not from a manual type parameter passed by the caller.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

Use `LoaderData<TLoader>` to type a success state object. If the loader resolves to `Device[]`, the success branch should require `Device[]`. If it resolves to `User`, the success branch should require `User`.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

Type a `buildSuccess` helper that takes a loader and matching resolved data, then returns a correctly typed success object. This makes the "generic outside, specific inside" shape concrete.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Generic async helpers should inherit the payload type from the loader, not ask the caller to repeat it."

**→ Bridge to Level 3**: Typed success state still is not enough for real UI. The screen needs all four phases modeled explicitly so branches cannot overlap or go missing.

### Level 3: Model The Full Four-Phase Async State

The final capability is the runtime model. A typed success branch is useful, but it does not protect the UI from impossible states like "loading and has error" or "no request yet, but we render empty results as though success already happened."

This level turns the delivery board into a discriminated union over the four async phases. Once that union exists, helper functions can render or transform state without losing exhaustiveness. The type system starts enforcing the same phase boundaries the UI needs.

#### **Exercise 1**

Define the complete `AsyncState<TData>` union with `idle`, `loading`, `success`, and `error`. The success branch should own `data`, and the error branch should own `error`.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Write a `describeAsyncState` helper that switches on `status` and returns the correct UI label for each branch. This is where the four phases stop being theory and become explicit render logic.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Write `mapAsyncData` so only the success branch transforms its payload while `idle`, `loading`, and `error` pass through unchanged. This is the generic version of "derive UI-ready data without losing the phase model."

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "The delivery board decides which branch is legal. The success branch carries the extracted payload."

## Key Patterns

### Use `Awaited<T>` When The Promise Wrapper Is Not The Thing You Need

If your hook, helper, or component logic works with the resolved data, extract that type instead of carrying `Promise<...>` deeper into the API.

- **When to use it:** generic loader helpers, async hooks, success-state typing
- **What it costs:** one extra type alias
- **What it prevents:** `unknown` data, repeated manual type parameters, and unnecessary casts

### Put The Discriminant On The State Object, Not In Several Booleans

Use one `status` field rather than `isLoading`, `hasError`, and optional `data` all floating independently.

- **When to use it:** request lifecycle state, screen-state branches, fetch retries
- **What it costs:** a small union type and branch switching
- **What it prevents:** contradictory combinations like loading plus error plus stale data

### Let The Success Branch Own The Payload

Only the success branch should expose `data`. That keeps consumers honest about when data is actually available.

- **When to use it:** render helpers, async hooks, derived selectors
- **What it costs:** branch narrowing before access
- **What it prevents:** scattered optional chaining and accidental reads from not-yet-loaded state

### Keep Runtime Phase And Payload Shape As Separate Concerns

The four-phase union solves lifecycle truth. `Awaited<T>` solves payload truth. Use both.

- **When to use it:** any generic async abstraction that both fetches and renders
- **What it costs:** two small type tools instead of one oversized abstraction
- **What it prevents:** confusing "typed data but unclear lifecycle" or "clear lifecycle but erased payload" designs

---

## Decision Framework

Ask these questions in order:

1. Do I need the resolved data type from an async function?
   Use `Awaited<ReturnType<typeof loader>>` or an equivalent helper.

2. Am I typing a reusable helper around a loader?
   Derive the payload from the loader itself instead of asking the caller to repeat the type.

3. Am I modeling screen state for an async request?
   Use a discriminated union with `idle`, `loading`, `success`, and `error`.

4. Am I reaching for booleans plus optional data?
   Stop and check whether a single `status` discriminant would make impossible states unrepresentable.

5. Am I transforming fetched data?
   Transform only inside the success branch and pass the other phases through untouched.

## Common Gotchas & Edge Cases

### Treating Empty Data As Loading Or Error

An empty result set can still be a successful request. If `[]` means both "we have no matches" and "the request has not finished yet," the UI cannot tell the user the truth.

### Forgetting `Idle`

`idle` matters when the request is user-triggered or gated behind some prerequisite. Without it, the UI often shows loading too early or treats "not started" as "already failed."

### Typing `data` As Optional On Every Branch

`data?: T` across one object type throws away the whole point of discriminated unions. It forces every consumer to keep guessing whether the payload is actually legal in the current phase.

### Using Generic Helpers That Return `unknown`

If a hook accepts a loader but does not derive the resolved payload type from it, the caller pays twice: once to pass the loader and again to cast the result.

### Forgetting That Real `Awaited<T>` Handles More Than Plain `Promise<T>`

The built-in `Awaited<T>` also handles thenables. For this guide, the hand-written versions stay focused on `Promise<T>` so the extraction mechanism is easy to see.
