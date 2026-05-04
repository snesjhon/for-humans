## The Problem

Build a custom hook `useWindowDimensions` that returns an object with three fields:

- `width`: current window width in pixels
- `height`: current window height in pixels
- `orientation`: `'landscape'` when `width > height`, otherwise `'portrait'`

The hook must stay current as the browser window is resized.

## Overview

The first instinct is to store all three fields directly. Three outputs, three state variables. But orientation is not a new fact -- it is the relationship between width and height. If width and height are already in state, orientation can be computed at render time. Storing it separately just means every resize handler has to update three things in sync, and any missed write produces a stale value.

The more interesting part of this problem is what happens when the window is resized. Width and height live outside React -- they belong to the browser. Keeping state synchronized with an external source requires an event listener, and that listener has a lifecycle: attach it when the component mounts, remove it when the component unmounts. Getting the removal right is where most implementations fall apart.

## Core Concept and Mental Model

### Two browser facts, one derived value

The hook reads two facts from the browser:

- `window.innerWidth`
- `window.innerHeight`

Orientation follows from those facts: if `width > height`, it is `'landscape'`; otherwise `'portrait'`. That comparison can happen in the return expression at render time. Storing orientation separately is storing the result of a calculation that is always reproducible from the facts you already have.

### The listener lifecycle

Browser events like `resize` exist outside React's render cycle. To keep state current, the hook needs to:

1. Register a `resize` listener when the component mounts
2. Update state inside the listener when the event fires
3. Remove the listener when the component unmounts

Step 3 is where most implementations fail. If the listener is never removed, it stays attached to `window` after the component is gone. The next resize event triggers a state setter on an unmounted component. In StrictMode, React deliberately mounts, unmounts, and remounts every component on first load -- exactly to surface this kind of missing cleanup.

`useEffect` is the right place for this pair:

```ts
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

The empty dependency array means the effect runs once on mount. The returned function is the cleanup -- it runs once on unmount. The listener is alive for exactly as long as the component is.

### Why the cleanup is the contract

Think of the event listener as a subscription. You open a subscription on mount and you must cancel it on unmount. Without the cancellation, you have a resource leak. In React, an effect without a cleanup is a signal that the effect was only half-thought-through. The setup and the cleanup are a matched pair -- writing one without the other is an incomplete contract.

## How I Think Through This

Start with the state shape. The fields coming back are `width`, `height`, and `orientation`. Width and height change when the window resizes, so they need to live in state. Orientation does not change independently -- it changes as a consequence of width or height changing. That makes it a derived value, not a state variable.

Then think about the listener lifetime. The hook should reflect the current window dimensions for as long as the component using it exists. That maps directly to a mount/unmount lifecycle. A `useEffect` with no dependencies and a cleanup function is the minimal correct implementation.

A useful mental check after writing the effect: if you unmount the component and then fire a resize event, does the state setter still run? If it does, the listener is still there.

---

## Building the Solution

### Step 1: Return the current dimensions

Start by getting the initial snapshot right. The hook should read `window.innerWidth` and `window.innerHeight` on initialization and return all three fields. Do not add any event listener yet -- just make the starting values correct and let orientation follow from them.

One check before writing code: if the browser viewport is 1200 x 800, what should `orientation` be, and why? Tracing that through the rule makes the return expression straightforward.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- `window.innerWidth` and `window.innerHeight` are available directly without any import.
- Initialize state from those values so the hook starts with an accurate snapshot.
- Compute `orientation` in the return expression from `width` and `height`.

### Step 2: Keep the dimensions current

The step 1 hook reads the right initial values, but it never updates. Add a `resize` listener that writes new values into state when the window size changes. Make sure the listener is removed when the component unmounts.

A reliable test for the cleanup: if you fire a `resize` event after unmounting the component, the state setter should not run. If it does, the listener survived.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Use `useEffect` with an empty dependency array -- the listener should be registered once on mount.
- Return a cleanup function from the effect that calls `removeEventListener` with the same handler reference.
- In tests, updating `window.innerWidth` alone is not enough -- you also need to fire the `'resize'` event, since jsdom does not do it automatically.

### Final Solution

The finished hook stores two browser facts, derives everything else, and manages the listener lifecycle through a matched setup/cleanup pair.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
