## The Problem

You have a working search hook from problem 051. Every time the user types a character, the visible list recomputes instantly. For in-memory filtering over a small array, that is fine. But real search features often need to do more: fire an API request, recompute an expensive derived structure, or update a URL parameter. Firing that work on every keystroke means the user sends a request for `"t"`, then `"te"`, then `"tea"` before they have finished typing.

Debounce is the fix. You separate the query the input field reads from (live, so typing stays responsive) from the query the search logic uses (debounced, so computation happens only after the user pauses). The two values are both real, but they serve different consumers.

## Overview

The surface change is small: the search hook returns two query values instead of one. But the mechanism underneath is specific. A new value schedules a timer. If another new value arrives before the timer fires, the old timer is canceled and a new one starts. Only when the timer actually fires does the debounced value update. That sequence has to hold up correctly on every change and also on unmount.

Separating the mechanism from the wiring makes both easier to get right. Step 1 is the timing primitive: a generic `useDebounce<T>` hook that handles the timer lifecycle for any value type. Step 2 is the wiring: a search hook that passes the live query through `useDebounce` and feeds the settled result to the filter.

## Core Concept and Mental Model

### The two-value model

A debounced search maintains two distinct values:

- `query`: the live value, updated on every keystroke and bound to the input field
- `debouncedQuery`: the settled value, updated only after the user pauses for the configured delay

The input reads from `query` so typing stays responsive. The filter computation reads from `debouncedQuery` so it does not rerun on every character.

```
keystroke → setQuery → query updates immediately
                     ↓
              setTimeout(delay)
                     ↓ (if no new keystroke arrives)
              debouncedQuery updates → filter recomputes
```

If a new keystroke arrives before the delay expires, the pending timer is canceled:

```
keystroke → clearTimeout(pending)
          → setTimeout(delay)   (fresh timer, new value)
```

### The timer lifecycle inside useDebounce

The timing primitive is a `useEffect` that runs whenever `value` changes:

1. Schedule a timer: `const id = setTimeout(() => setDebounced(value), delay)`
2. Return a cleanup: `() => clearTimeout(id)`

React calls the cleanup before running the next effect, so when `value` changes again, the old timer is canceled before a new one starts. When the component unmounts, React calls the cleanup one final time, canceling any pending timer.

The result is that `debouncedQuery` always reflects the most recent value that stayed stable for the full delay duration.

### Why the filter reads from the settled value

The visible list is derived from `debouncedQuery`, not from `query`:

```ts
const visibleItems = items.filter((item) =>
  debouncedQuery.length === 0 || item.name.toLowerCase().includes(debouncedQuery)
);
```

This is the same projection logic from problem 051. The only change is which query drives it. The live query is only for the input binding. The settled query is the signal that the user has paused long enough for the computation to be worth running.

## How I Think Through This

Start from the timer contract, not the hook interface. Ask: when should the debounced value change? Only when the timer fires. When should the timer be canceled? When a new value arrives, and when the component unmounts.

Once that is clear, the `useEffect` implementation follows directly. The effect's cleanup handles both cancellation cases: React runs it both on re-render (canceling the old timer before the new one starts) and on unmount.

The search hook then becomes a wiring problem. Feed the live query into `useDebounce`. Use the output as the filter's input. Return both so the parent can bind the input to `query` and observe what the filter is actually using through `debouncedQuery`.

Test the timing boundary explicitly: set a query, advance timers by less than the delay, and confirm the debounced value has not changed yet. Then advance by the remaining time and confirm it catches up. That boundary is where bugs live.

---

## Building the Solution

### Step 1: Build the timing primitive

`useDebounce<T>` takes a value and a delay. It returns a debounced copy of the value that trails the live value by the delay.

The debounced value should start equal to the input value. When the input changes, it should not update immediately. Instead, it should schedule a timer for the configured delay. If the input changes again before the timer fires, the pending timer should be canceled and a fresh one should start.

Think about what needs to happen on unmount. If the component unmounts while a timer is pending, React calls the cleanup from the last effect. That cleanup should cancel the pending timer.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- `useEffect` runs whenever `value` or `delay` changes. Its cleanup runs before the next effect and on unmount.
- `setTimeout` returns a numeric ID. `clearTimeout` takes that ID.
- The debounced state should start as the initial `value` so the first render is correct before any effect runs.

### Step 2: Wire the timing primitive into a search hook

Now use `useDebounce` to build `useDebouncedSearch`. The hook takes a list of items and a delay. It manages the live query in state and passes it through `useDebounce` to produce the settled query. The visible list is computed from the settled query, not the live one.

The hook should return all four values: the live query for input binding, a setter to update it, the debounced query to show what the filter is actually using, and the derived visible list.

Confirm that rapidly updating the query does not make the visible list flicker through intermediate states. After setting a query, advance time to just before the delay and check that the list has not updated yet. Advance past the delay and check that it has.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Normalize the debounced query the same way problem 051 normalized the live query: trim and lowercase before matching.
- `visibleItems` is still a derived value computed during render from `debouncedQuery`.
- Return `debouncedQuery` alongside `query` so tests can inspect what the filter is actually using.

### Final Solution

The finished hook separates two responsibilities that look like one. The input field stays responsive because it reads from `query`. The filter stays efficient because it reads from `debouncedQuery`. The timing primitive `useDebounce` handles the cancellation contract so the search hook does not need to manage timers directly.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
