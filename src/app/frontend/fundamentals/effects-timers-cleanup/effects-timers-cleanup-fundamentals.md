## Overview

Effects are where React steps out of pure rendering and starts synchronizing with something outside the component: a timer, a DOM subscription, a network request, or any other resource that keeps running after the render finishes. The bug pattern is consistent. A setup starts some outside work, but nothing stops the previous work when inputs change or the component disappears.

**The lifecycle problem:** effect setup runs after React commits the screen, cleanup runs before the next setup and again on unmount. The pair is the contract.

**The timer problem:** `setInterval` feels convenient, but without cleanup it leaks duplicate work, and with wall-clock UIs it drifts because it measures elapsed callbacks instead of checking the real time.

**The fetch problem:** network requests need cancellation too. `AbortController` is the cleanup mechanism that stops obsolete work before it can update the wrong screen.

**Level 1** teaches the setup-cleanup contract and why missing interval cleanup misbehaves under rerenders and StrictMode.

**Level 2** teaches why countdowns and clocks should derive from a real deadline or timestamp instead of decrementing local state on every interval tick.

**Level 3** teaches fetch cancellation with `AbortController`, first as a signal, then as effect cleanup, then inside a complete hook.

## Core Concept & Mental Model

The problem from the overview is this: an effect is not "some code that runs later." It is a lease on an external resource. Once the component starts a timer, listener, or request, that resource stays alive outside React until the lease is explicitly closed.

### The Lease Contract

Imagine every effect run signs a lease.

- **lease start** = the effect setup function running after React commits
- **leased resource** = the interval, listener, request, or subscription created by setup
- **lease termination** = the cleanup function returned by the effect
- **renewal** = React running cleanup for the old lease before starting a new one
- **eviction** = unmount, where React runs cleanup one final time

The important point is that the lease belongs to one specific effect run. If setup starts work and cleanup does nothing, the old lease stays active. React can render a newer screen, but the older timer or request is still alive.

### When Setup And Cleanup Actually Run

The order matters:

1. React renders.
2. React commits the DOM update.
3. The effect setup runs after that commit.
4. If dependencies change, React runs the previous cleanup before the next setup.
5. On unmount, React runs cleanup one final time.

That means cleanup is not just an unmount detail. Cleanup also runs during normal updates whenever the effect is about to be replaced by a newer lease.

### Why Intervals Leak So Quietly

An interval is the easiest way to violate the contract because the setup looks harmless:

```ts
useEffect(() => {
  const id = setInterval(() => {
    console.log('tick');
  }, 1000);
}, []);
```

The interval keeps running until someone calls `clearInterval(id)`. React does not infer that automatically. Without cleanup, the leased resource outlives the effect that created it.

That creates three different failure modes:

- rerender with changed dependencies: old interval keeps running beside the new one
- unmount: interval keeps firing after the component is gone
- StrictMode in development: React intentionally mounts, cleans up, and mounts again to expose missing cleanup, so leaked setups often appear doubled

### StrictMode Is Surfacing A Real Contract Violation

StrictMode is not inventing the bug. It is replaying setup and cleanup to prove whether the effect can survive being started and stopped correctly. If the effect leaves an interval behind, StrictMode makes that visible immediately by exposing duplicate work.

Think of it as a lease audit:

- setup starts lease A
- cleanup should terminate lease A
- setup starts lease B

If lease A never closes, both leases stay active. The double tick is the symptom, not the root cause.

### Why Real Clocks Need A Deadline, Not A Counter

`setInterval(() => setSeconds((s) => s - 1), 1000)` measures "how many callbacks happened." A real countdown measures "how far are we from the deadline right now?"

Those are not equivalent. Callback timing drifts because:

- the event loop can be busy
- background tabs can throttle timers
- a delayed callback still subtracts only one second, even if more real time passed

For a wall clock or countdown, the reliable source of truth is a timestamp:

```ts
const remainingMs = targetTimeMs - Date.now();
const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
```

Then schedule the next timeout based on the next boundary you care about, not on the assumption that the last callback arrived exactly on time.

### Why Fetch Cleanup Uses AbortController

A request is also a leased resource. Once started, it may resolve after the component has moved on to a different URL or unmounted entirely. Cleanup needs a way to terminate that work.

`AbortController` is that termination handle:

- setup creates the controller
- the fetch receives `controller.signal`
- cleanup calls `controller.abort()`

That closes the old lease before the next request starts. The point is not just to silence warnings. It is to stop stale work from winning the race against newer state.

---

## Building Blocks: Progressive Learning

### Level 1: Treat Cleanup As Part Of The Effect, Not An Optional Extra

The first capability is reading an effect as a pair: start the lease, then define how the lease ends. This level stays with timers because the mistake is visible fast. One missing cleanup can leave duplicate intervals running after rerenders, after unmount, and under StrictMode's development replay.

#### **Exercise 1**

Fix a `useTicker` hook so it clears its interval on unmount. The bug comes first: setup starts an interval, but the lease never closes.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

Fix a polling hook so changing `label` or `delay` replaces the old interval instead of leaving both intervals alive. This is the "cleanup before the next setup" case, not just unmount cleanup.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

Fix a heartbeat effect so it survives StrictMode without double scheduling. The doubled callback is the symptom of a missing terminated lease.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "If setup leased a resource, cleanup must terminate that lease."

**→ Bridge to Level 2**: Cleanup prevents duplicate work, but it does not solve timer drift. The next level changes the source of truth from callback count to real clock time.

### Level 2: Sync To The Clock You Actually Care About

Now the bug changes shape. The timer may clean up correctly and still be wrong. If the UI is supposed to show real time remaining, decrementing local state every second is only an approximation. The correct model derives from a deadline or timestamp on each update.

#### **Exercise 1**

Compute the delay until the next exact second boundary. This is the smallest piece of real-clock scheduling: how long until the display should change again?

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

Compute remaining whole seconds from a real deadline and the current timestamp. This replaces "one callback equals one second" with actual elapsed time.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

Build a `useSyncedCountdown` hook that reads a deadline, recomputes from `Date.now()`, and schedules the next timeout at the next second boundary. This is the drift-resistant shape for countdown UI.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "For real-clock UI, store the deadline, recompute the display."

**→ Bridge to Level 3**: Timers are not the only leased resource. Fetches also outlive renders, so cleanup needs a request-specific termination handle.

### Level 3: Cancel Obsolete Requests With AbortController

The final capability applies the same lease model to network requests. A fetch started by one render should not keep running after the effect has been replaced. `AbortController` is the cleanup handle that lets the old request terminate before the next one starts.

#### **Exercise 1**

Create an abortable fetch helper that passes a real `AbortSignal` into the request. The first step is wiring the termination handle to the request at all.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Fix an effect so it aborts the previous request during cleanup. This is the request version of clearing an old interval before starting a new one.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Build a full `useAbortableJson` hook that tracks loading, success, and error while ignoring an intentional abort. The hook should stop obsolete requests without turning cancellation into a user-visible failure.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Cleanup for fetch means abort the old request, not wait and hope it loses the race."

## Key Patterns

### Model Every Effect As Setup Plus Termination

If setup touches something outside React, ask immediately how that work stops.

- **When to use it:** intervals, timeouts that reschedule, event listeners, subscriptions, fetches
- **What it prevents:** duplicate work, post-unmount updates, StrictMode surprises

### Clean Up Before Replacing A Lease

Dependency changes are a cleanup case too. The old effect must end before the new one starts.

- **When to use it:** polling keyed by props, listeners bound to changing values, requests keyed by URL
- **What it prevents:** old and new resources running in parallel

### Derive Clock UI From Timestamps, Not Tick Counters

For countdowns and clocks, the displayed value should come from `Date.now()` and a deadline or boundary.

- **When to use it:** countdowns, clocks, retry timers, TTL displays
- **What it prevents:** drift from delayed callbacks or background tab throttling

### Abort Requests Instead Of Letting Them Finish Stale

An obsolete request is still active work. Cleanup should terminate it.

- **When to use it:** fetch keyed by props, search requests, page transitions, component unmount
- **What it prevents:** stale responses updating newer UI and avoidable network work

---

## Decision Framework

1. What external resource did this effect lease: timer, listener, subscription, or request?
2. What exact operation terminates that resource?
3. Does cleanup run both on unmount and before the next setup for this effect?
4. If the UI shows real time, is the source of truth a timestamp or just a decrementing counter?
5. If the effect starts a request, does cleanup abort it and ignore the abort path as a normal control flow case?

## Common Gotchas & Edge Cases

- `[]` does not mean "safe forever." It means "this one setup instance owns the resource until cleanup."
- StrictMode double-invocation in development is a cleanup audit. If it doubles work, the effect was already incorrect.
- `clearInterval` and `clearTimeout` need the exact handle returned by setup.
- Replacing a request URL without aborting the previous request creates a race even if the code "usually works."
- A countdown that subtracts one every second will drift if the tab stalls for three seconds and then resumes.
- Aborting a fetch is not the same as a real failure. Treat `AbortError` as expected cleanup, not as user-visible error state.
