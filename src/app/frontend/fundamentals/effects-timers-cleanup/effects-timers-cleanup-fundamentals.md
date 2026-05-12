## Overview

React effects have a setup phase and a cleanup phase — both halves are the contract, not just the setup. Three related problems grow from the same root: the setup half of an effect ran, but the shutdown half never did.

**The missing cleanup problem:** Effects without a return value leave intervals, listeners, and subscriptions running after a component unmounts or a dependency changes. Under React StrictMode, every effect runs twice on mount (setup → cleanup → setup), which turns a silent leak into immediately visible double behavior.

**The interval drift problem:** A tick counter inside `setInterval` conflates "number of ticks" with "elapsed seconds." When the tick rate is faster than one per second, the counter overcounts. When scheduling delays accumulate over time, the counter falls behind. The fix is to read `Date.now()` from a reference captured at setup time, so the displayed value reflects actual elapsed time.

**The async cancellation problem:** `fetch` does not cancel itself. A response launched by one effect run can arrive and call `setState` after the component has moved on to a different dependency — or unmounted entirely. An `AbortController` is the mechanism: the setup passes a kill signal into the request, and the cleanup fires it.

**Level 1** teaches the cleanup contract: what to return from `useEffect`, when that return value runs, and what visibly breaks when it is absent.

**Level 2** teaches the drift trap: why a tick counter overcounts when the interval fires faster than once per second, and how capturing `Date.now()` at setup time produces an accurate elapsed value regardless of tick rate.

**Level 3** teaches `AbortController`: how to pass a kill signal into `fetch`, when to fire it via cleanup, and why `AbortError` should never set the component's error state.

## Core Concept & Mental Model

### The Sensor-and-Shutdown Pair

A hardware sensor has two wires: power (setup) and kill (cleanup). Connecting power alone turns the sensor on. But decommissioning the sensor — replacing it, rewiring it, moving on — requires the kill wire too. Cutting only power often leaves residual state running.

React uses the same contract for effects. The setup function connects something: an interval, an event listener, a fetch request, a subscription. The cleanup function — the return value from the setup — disconnects it. React runs the setup after every paint. React runs the cleanup before the next setup fires and before the component leaves the tree.

Under StrictMode in development, React tests this contract deliberately: it runs setup → cleanup → setup for every effect on mount. If the second setup produces double the behavior, the cleanup wire was never connected. Production never double-mounts, but StrictMode surfaces the gap before it becomes a production incident.

The three problems in this guide are three variants of a disconnected kill wire.

**Missing cleanup (Level 1):** The kill wire does not exist. Every setup leaves a running interval, listener, or subscription behind. Under StrictMode, two setups run without a cleanup between them, making the doubling visible immediately.

**Stale tick counter (Level 2):** The kill wire exists, but the sensor is counting oscillator ticks instead of reading the clock. An interval that fires every 200ms will call `setSeconds(s => s + 1)` five times per real second — the counter reads 5 when one second has elapsed. Replacing the counter with `Math.floor((Date.now() - start) / 1000)` anchors the reading to real clock time.

**In-flight request (Level 3):** The setup launches an async operation. The kill wire must carry an abort signal to the in-flight work, not just stop future processing. An `AbortController` is the mechanism: the setup passes `controller.signal` to `fetch`, and the cleanup calls `controller.abort()`.

### The Cleanup Timing Window

The cleanup function runs in two situations:

1. Before the next effect fires when a dependency changes
2. On unmount

This means cleanup is not "teardown when the component is done." It is "teardown whenever the current effect needs to be replaced." If a component has an effect that depends on a `deviceId` prop and the prop changes, React runs the cleanup for the old `deviceId` before running the setup for the new one. Two separate effect runs for the same dep must never coexist in a correctly written component.

```ts
useEffect(() => {
  const id = setInterval(() => poll(deviceId), 1000);
  return () => clearInterval(id); // runs when deviceId changes and on unmount
}, [deviceId]);
```

Without the return, the old interval for the previous `deviceId` continues while a new one starts. After N dep changes, N intervals are running simultaneously.

### Why StrictMode Reveals the Missing Cleanup

In development with `<React.StrictMode>`, React mounts, immediately simulates an unmount, and then remounts every component once. This verifies that setup and cleanup are a matched pair. A component whose effects double their behavior under StrictMode has a missing cleanup.

This is not a bug introduced by StrictMode. StrictMode reveals a bug that already exists. The same accumulation happens in production whenever the component unmounts and remounts — during route changes, conditionally rendered branches, or list reconciliation. StrictMode makes the next occurrence happen immediately and predictably in dev.

---

## Building Blocks: Progressive Learning

### Level 1: The Cleanup Contract

Every effect that starts something must return a function that stops it. That return value is the kill wire. Without it, React has no way to decommission the current effect run before starting the next one.

The fix is always the same shape: capture the resource ID inside the effect and return a one-liner that releases it.

```ts
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // the kill wire
}, []);
```

Before writing any cleanup, identify what the effect started. An interval needs `clearInterval`. An event listener needs `removeEventListener` with the same handler reference. A subscription needs its `unsubscribe`. The cleanup mirrors the setup exactly.

#### **Exercise 1**

`useCounter` increments every second using `setInterval`. The effect is missing its return value. Predict: with React StrictMode running setup → cleanup → setup on mount, and no cleanup to interrupt the sequence, how many intervals are running by the time the component settles? Then return a cleanup function that calls `clearInterval(id)` so the second setup replaces the first.

How to think about it:

1. How many times does StrictMode call the effect setup before the component is fully mounted?
2. Without a return value, what does React call between the first and second setup?
3. How many active intervals does that leave behind?

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

`useResizeCount` tracks how many times the window resizes by adding an event listener in the effect. The effect returns nothing. Predict: after StrictMode runs setup → cleanup(none) → setup, how many resize handlers are attached? Then return a cleanup function that calls `window.removeEventListener('resize', handler)` using the same handler reference from the setup.

How to think about it:

1. `addEventListener` adds a new listener on each call — it does not replace an existing one with the same function unless the same reference is used in `removeEventListener`.
2. Without a cleanup, what happens to the handler from the first setup when the second setup runs?
3. What does "same handler reference" mean for the cleanup function's argument?

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

`usePoller` fires a 500ms interval for a given `key`. This exercise moves the lesson from StrictMode's double-mount to a different trigger: a prop changing. When `key` changes, React runs the cleanup from the previous effect run before starting the new one — but only if there is a cleanup to run. Predict: without a return value, how many intervals are running after the `key` changes once? Then add the cleanup so the dep change shuts down the old interval before the new one takes over.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "The kill wire exists for every effect that starts something. The cleanup runs before the next setup fires — on dep change and on unmount."

**Bridge to Level 2**: Once cleanup is in place, the next question is what the interval is actually reading. A closure inside `setInterval` captures whatever was in scope when the effect ran. When the interval is fast, counting ticks does not match counting seconds.

### Level 2: The Drift Trap

A function created inside `useEffect` closes over the values from that render. An interval callback that reads `count` will read the version from the render that created the interval. For state updates, the functional updater form (`setCount(c => c + 1)`) avoids the stale-read problem entirely — React supplies the current value at update time, not the captured snapshot.

But there is a second, separate problem: tick counting.

A tick counter increments on every interval fire. When the interval fires at 200ms, a counter increment per tick gives 5 increments per real second. When you display `secondsElapsed`, the number shown is five times higher than the real elapsed time. The counter has no relationship to wall-clock seconds — it counts interval fires, not seconds.

The fix is to compute elapsed time from a reference point:

```ts
const start = Date.now();
const id = setInterval(() => {
  setSeconds(Math.floor((Date.now() - start) / 1000));
}, 200);
```

With `jest.useFakeTimers()`, `Date.now()` advances with the virtual clock, so the calculation works the same way in tests as it does in a browser. The interval can fire at any rate — 200ms, 100ms, 1000ms — and the returned value is always the floor of the real elapsed seconds.

#### **Exercise 1**

`useElapsedSeconds(tickMs)` should return the number of whole seconds elapsed since mount. The current implementation uses `setSeconds(s => s + 1)` on each interval fire. Predict: with `tickMs=200`, what does the hook return after 2 real seconds? Then replace the tick counter with a `Date.now()` calculation so the return value tracks actual elapsed time regardless of how fast the interval fires.

How to think about it:

1. With a 200ms interval, how many times does the callback fire in 2000ms?
2. What does `setSeconds(s => s + 1)` produce after that many fires?
3. What expression computes whole elapsed seconds from a `Date.now()` reference?

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

`useCountdown(totalSeconds, tickMs)` should count down from `totalSeconds` to zero in whole real-clock seconds. The current implementation calls `setSecondsLeft(s => s - 1)` on each interval fire. With a fast tick rate, the countdown depletes before the real time has elapsed. Fix it: capture `Date.now()` at setup and compute the remaining seconds as `totalSeconds - elapsed`, clamped to zero.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

`useAccuratePoller(tickMs)` has both bugs from this level combined: no cleanup function and a tick counter instead of a clock calculation. Predict: with `tickMs=200` under StrictMode, what does the hook return after 2 real seconds? Then fix both problems — add a cleanup return and replace the counter with `Date.now()` math — so the hook returns exactly 2.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Tick count and elapsed seconds are not the same thing. Anchor to Date.now() — not to how many times the interval fired."

**Bridge to Level 3**: Cleanup and accurate timing are fully solved. The remaining problem is async: `fetch` keeps running after the cleanup fires unless you explicitly connect the abort signal to the in-flight request.

### Level 3: AbortController

`fetch` is not cancelled by the cleanup return. When `useEffect`'s cleanup function runs — because a dep changed or the component unmounted — any in-flight `fetch` call continues until the server responds. If that response arrives after the component has moved on, it calls `setData` on state that belongs to a now-irrelevant render.

The `AbortController` API is the mechanism for connecting the cleanup to the in-flight work:

```ts
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/devices/${deviceId}`, { signal: controller.signal })
    .then(res => res.json())
    .then(d => setData(d))
    .catch(err => {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err.message);
    });

  return () => controller.abort();
}, [deviceId]);
```

Three things to notice. First, the `AbortController` is created inside the effect so each run has its own controller. Second, `controller.signal` is passed to `fetch` as the signal option — this is what connects the abort call to the in-flight request. Third, `AbortError` must be caught and ignored. When `controller.abort()` fires, the fetch promise rejects with a `DOMException` whose `name` is `'AbortError'`. That rejection is intentional, not a real failure, and must not reach the error state.

#### **Exercise 1**

`useFetchDevice(deviceId)` fetches device data when `deviceId` changes. The current implementation has no cleanup — there is no `AbortController` and no return function. The test verifies that when `deviceId` changes, the previous fetch's signal becomes aborted. Add the full `AbortController` pattern: create the controller, pass `{ signal: controller.signal }` to `fetch`, and return `() => controller.abort()`.

How to think about it:

1. Where in the effect should the `AbortController` be created — before `fetch` runs or after?
2. What do you pass to `fetch` as the second argument to connect the signal?
3. What does the cleanup function need to call to cancel the in-flight request?

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

This exercise shows where missing abort causes visible data corruption. Two `fetch` calls are in-flight: one for `device-1` (slow) and one for `device-2` (fast). The newer request resolves first and sets data to `device-2`. Then the older request resolves and overwrites it with `device-1`. The displayed data now belongs to a device the user is no longer looking at. Add the same `AbortController` pattern: the cleanup aborts the `device-1` fetch before `device-2`'s fetch starts, so its late response is silently discarded.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

This exercise has the `AbortController` wired correctly, but the `catch` handler is wrong. When `deviceId` changes, cleanup fires `controller.abort()`, which causes the in-flight fetch to reject with a `DOMException` named `'AbortError'`. The current catch handler treats this the same as a real network failure and calls `setError` — the component shows an error state for an intentional navigation. Add a guard before `setError`: if the thrown value is a `DOMException` with `name === 'AbortError'`, return early without setting any state.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "AbortController connects the kill wire to the in-flight request. AbortError is the expected result of firing it — not a failure."

## Key Patterns

### Pattern 1: Return a Cleanup Function from Every Effect That Starts Something

**When to use:** any effect that calls `setInterval`, `setTimeout`, `addEventListener`, opens a WebSocket, or starts any persistent resource.

**What it prevents:** accumulated timers and listeners that continue firing after the component has moved on. Under StrictMode, missing cleanup immediately doubles all side effects.

```ts
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

### Pattern 2: Compute Elapsed Time from Date.now(), Not Tick Count

**When to use:** any hook that displays or measures elapsed seconds, countdowns, or any time-based value.

**What it prevents:** overcounting when the interval fires faster than once per second, and accumulated scheduling delay causing the displayed value to drift behind real time over long durations.

```ts
useEffect(() => {
  const start = Date.now();
  const id = setInterval(() => {
    setSeconds(Math.floor((Date.now() - start) / 1000));
  }, 200); // fast tick rate for responsiveness, clock for accuracy
  return () => clearInterval(id);
}, []);
```

### Pattern 3: AbortController for Fetch Cancellation

**When to use:** any `useEffect` that issues a `fetch` call based on a prop, state value, or mount.

**What it prevents:** stale responses updating state after the component has unmounted or moved to a different dependency. In fast dep-change scenarios, this prevents an older slower response from overwriting a newer faster one.

```ts
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/device/${id}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setDevice(data))
    .catch(err => {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err.message);
    });

  return () => controller.abort();
}, [id]);
```

### Pattern 4: Guard AbortError Before Setting Error State

**When to use:** every catch handler in an effect that uses `AbortController`.

**What it prevents:** the component showing an error screen after the user navigates away or changes a filter — situations where the abort was intentional and the error state would be incorrect.

```ts
.catch((err: unknown) => {
  if (err instanceof DOMException && err.name === 'AbortError') return;
  setError(err instanceof Error ? err.message : 'Request failed');
});
```

---

## Decision Framework

When writing a `useEffect`, two questions determine what cleanup and timing strategy to use:

**Does this effect start anything persistent?**

| Effect starts | Required cleanup | Common mistake |
|---|---|---|
| `setInterval` | `return () => clearInterval(id)` | No return — interval accumulates per dep change and mount |
| `setTimeout` | `return () => clearTimeout(id)` | No return — fires after unmount if dep changes first |
| `addEventListener` | `return () => el.removeEventListener(type, handler)` | No return — duplicate handler stacks on each render |
| `fetch` | `return () => controller.abort()` | No signal — stale response updates state after dep change |
| Custom subscription | `return () => unsubscribe()` | No return — subscriber list grows indefinitely |

**Does the interval callback need to display time-based values?**

```
displaying "seconds elapsed" or "seconds remaining"
    │
    ├── counting ticks: setSeconds(s => s + 1)
    │       └── wrong when tick rate ≠ 1000ms
    │       └── drift accumulates over long durations
    │
    └── reading the clock: Math.floor((Date.now() - start) / 1000)
            └── correct at any tick rate
            └── no accumulated drift
```

## Common Gotchas & Edge Cases

**Gotcha 1: No cleanup return from an effect that starts an interval**

Why it happens: the interval "works" on the first render, so the return feels optional.

Why it is wrong: on the second render with StrictMode active, two intervals run simultaneously. In production, any component unmount-and-remount cycle (route change, conditional render, list reconciliation) leaves an orphan interval. Over time, multiple intervals accumulate and fire in parallel.

Fix: always return `() => clearInterval(id)` from any effect that calls `setInterval`.

**Gotcha 2: Treating dep-change cleanup as only an unmount concern**

Why it happens: the mental model of cleanup is "run when the component is done," which sounds like unmount.

Why it is wrong: cleanup also runs before the next effect fires when a dependency changes. An effect that depends on `deviceId` and polls via `setInterval` must clean up the old interval before the new one starts — otherwise the old poll keeps running for the old device while the new poll runs for the new one.

Fix: the cleanup return handles both cases automatically. The same `return () => clearInterval(id)` that handles unmount also handles dep-change replacement.

**Gotcha 3: Using a tick counter to display elapsed or remaining seconds**

Why it happens: `setSeconds(s => s + 1)` looks correct for a 1-second interval, and it is correct — until the tick rate changes or scheduling delay accumulates.

Why it is wrong: any tick rate faster than 1000ms (used for UI responsiveness) multiplies the counter by the tick frequency. A 200ms interval with `s + 1` reads 10 after 2 real seconds.

Fix: capture `Date.now()` at effect setup. Compute `Math.floor((Date.now() - start) / 1000)` inside the callback. The tick rate controls how responsive the update feels; the clock reference controls what value is displayed.

**Gotcha 4: Passing no signal to fetch**

Why it happens: fetch without a second argument works in the happy path. The signal option is opt-in, so it is easy to omit.

Why it is wrong: without a signal, `controller.abort()` has nothing to cancel. The in-flight request runs to completion and resolves its promise. If the cleanup fired because `deviceId` changed, the now-irrelevant response lands and calls `setData` with data for the previous device.

Fix: always create an `AbortController` inside the effect and pass `{ signal: controller.signal }` as the second argument to `fetch`.

**Gotcha 5: Setting error state on AbortError**

Why it happens: every catch handler looks the same — catch the error, display the message. `AbortError` is thrown in the catch just like a network error.

Why it is wrong: `AbortError` is thrown because the cleanup intentionally fired `controller.abort()`. The user navigated away, changed a filter, or the component unmounted. None of those are error conditions. Setting error state in response to them shows a false error screen.

Fix: check `err instanceof DOMException && err.name === 'AbortError'` before calling `setError`. Return early if the condition is true. Only real network or parse failures should reach the error state.
