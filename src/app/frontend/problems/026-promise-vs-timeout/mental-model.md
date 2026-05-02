## Overview

On first pass, timing in JavaScript looks like it follows declaration order. `setTimeout(fn, 0)` seems like it means "run immediately after this," and `Promise.resolve().then(fn)` seems similar. Put them in the same block and the temptation is to assume they interleave based on position.

They don't. JavaScript's event loop enforces a strict priority between two separate queues. The bugs in these exercises come from that gap: a callback that fires at the wrong time, a promise that resolves before the data is ready, or an async function that returns without ever actually waiting.

The one thing to lock in before any exercise: `setTimeout(fn, 0)` does not mean "run immediately." It means "schedule in the macrotask queue." That is a different queue from promises, and it runs last.

## Core Concept and Mental Model

### Two Queues, One Rule

JavaScript's runtime processes asynchronous work from two separate queues:

- **Microtask queue** -- Promises (`.then`, `.catch`, `.finally`), `queueMicrotask`
- **Macrotask queue** -- `setTimeout`, `setInterval`, `setImmediate`

The rule the engine enforces after the call stack empties:

1. Drain the **entire** microtask queue
2. Only then pick the next macrotask
3. After that macrotask completes, repeat from step 1

This is not a soft priority. The engine will never start a macrotask while any microtask is pending.

### What This Looks Like in Practice

Given this code:

```ts
console.log('A');
setTimeout(() => console.log('C'), 0);
Promise.resolve().then(() => console.log('B'));
console.log('D');
```

The output is `A D B C`, not `A C B D` or `A B C D`.

- `A` and `D` are synchronous -- they run immediately on the call stack
- When the call stack empties, the microtask queue has `B`
- The engine drains the microtask queue first: `B` runs
- Only then does the engine pick up the macrotask: `C` runs

### Chain Depth Does Not Change Priority

Each `.then()` in a promise chain enqueues a new microtask when it runs -- but it still lands in the microtask queue, not the macrotask queue. This means a chain of three `.then()` calls all complete before any `setTimeout` fires:

```ts
setTimeout(() => console.log('timeout'), 0);
Promise.resolve()
  .then(() => console.log('step-1'))
  .then(() => console.log('step-2'))
  .then(() => console.log('step-3'));
```

Output: `step-1 step-2 step-3 timeout`

After each `.then()` callback runs, the next link is already a microtask. The engine keeps draining until the microtask queue is empty -- step-1, step-2, step-3 -- before it touches the macrotask queue.

### The Sleep Pattern

`await` can only pause a function if it has a Promise to wait on. `setTimeout` does not return a Promise -- it returns a numeric timer ID. So when you write this:

```ts
async function delay(ms: number): Promise<void> {
  setTimeout(() => {
    doSomething();
  }, ms);
}
```

Two completely separate things are happening in parallel:

- **Track 1**: The async function body runs synchronously to the end. No `await` means no pause. The function's returned Promise resolves immediately.
- **Track 2**: The timer is registered with the browser. After `ms` milliseconds it fires, runs `doSomething()`, and exits. Nothing is waiting for it.

Any caller that does `await delay(100)` resumes the instant Track 1 finishes -- long before the timer fires. `doSomething()` runs later, orphaned, with no connection to the caller's execution flow.

The fix is to build a bridge between the two tracks. `new Promise` lets you hand the Promise's `resolve` function to `setTimeout` directly:

```ts
async function delay(ms: number): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, ms));
  doSomething();
}
```

Tracing this through the two-queue model:

1. `new Promise(executor)` runs the executor synchronously. Inside, `setTimeout(resolve, ms)` is called -- this places `resolve` into the macrotask queue, scheduled to fire after `ms` ms.
2. `await` on the new Promise suspends the async function. The function is parked; the caller does not resume.
3. After `ms` ms, the macrotask fires. It calls `resolve()`, which settles the Promise.
4. Settling the Promise enqueues a microtask to resume the suspended `async` function.
5. The microtask queue drains: the function resumes, and `doSomething()` runs.

The key shift: instead of putting your work inside the `setTimeout` callback, you put `resolve` there. The Promise is the bridge -- `await` waits on the Promise, the Promise waits on the timer, and the timer waits on nothing. The chain connects.

## How I Think Through This

When reading async code, the first thing I sort is queue membership, not position in the file. Synchronous code always goes first. Then I split the async work: is this a promise callback or a timer callback? Promise callbacks go in the microtask pile, timer callbacks go in the macrotask pile. Everything in the microtask pile runs before anything in the macrotask pile.

For chained promises, I trace each `.then()` as its own microtask. Chain length does not matter -- all of them clear before any timer fires.

For async functions, the rule that trips people up most is that `await somePromise` actually pauses the function. If there is no `await`, the function body runs synchronously to completion and the returned promise resolves immediately. A bare `setTimeout` inside an async function without an `await` is an orphaned callback -- the caller's `await` does not wait for it.

---

## Building the Solution

### Step 1: Build the two-queue order

The mental model walked through `A D B C`. This exercise asks you to construct that same ordering from scratch: one entry synchronously, one through the microtask queue, one through the macrotask queue.

`scheduleWork` already pushes `'start'` immediately. Your job is to schedule `'micro'` and `'macro'` so they land in the log in the right order -- using the two mechanisms the mental model introduced.

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

**Hints**

- The microtask queue always drains before the macrotask queue fires.
- Both `Promise.resolve().then()` and `setTimeout` are available -- pick the right one for each entry.
- Neither `'micro'` nor `'macro'` should be in the log right after `scheduleWork` returns.

### Step 2: When does a Promise settle?

`fetchUser` always resolves with `null`. Trace through the executor the same way you traced the two-queue example in the mental model: what runs synchronously, and what runs later?

`resolve()` is a synchronous call. Ask yourself what value it captures at the moment it runs, and compare that to when the async work actually completes. The two-queue model tells you exactly which piece of code runs first.

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

**Hints**

- `new Promise(executor)` runs the executor synchronously -- it is not deferred.
- `resolve()` captures the value of its argument at the exact moment it is called.
- Think about the order: what runs first, the code inside `setTimeout`, or the code after it in the executor?

### Step 3: What does `await` actually wait for?

`delay` never suspends. An `async` function without `await` resolves its returned promise the moment the function body finishes -- the `setTimeout` callback fires later, unconnected to anything the caller is waiting on.

Step 2 showed how to tie a `setTimeout` callback to a promise. The same relationship applies here, except the goal is not to resolve with a value but to pause the function itself until the timer fires.

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

**Hints**

- An `async` function without `await` behaves like a regular function that returns a resolved promise.
- A callback inside `setTimeout` has no connection to the function's returned promise unless you create one explicitly.
- What would you need between `await` and the timer to make the function actually pause?

### Final Solution

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
