## The Problem

You have a horizontal list of covers inside a scrollable container. Only five are visible at once. Two arrow buttons sit on either side: left and right.

Requirements:

1. Clicking the right arrow scrolls the container to the right.
2. Clicking the left arrow scrolls the container to the left.
3. At the start of the list, hide the left arrow.
4. At the end of the list, hide the right arrow.
5. Anywhere in the middle, show both arrows.

## Overview

The question is where the arrow visibility logic belongs and what it should read from. The arrows are not independent toggles -- they respond to one thing: how much scrollable content is hidden on each side of the visible window.

Every time the container scrolls, the `scroll` event fires and `event.target` gives you the current state of the DOM element. Three properties tell you everything:

- `scrollLeft`: pixels scrolled from the left edge
- `scrollWidth`: total width of all the content
- `clientWidth`: visible width of the container

From those, you can compute two offset values that directly answer whether each arrow should appear. The goal is to name those offsets clearly and derive the flags from them on every scroll event.

## Core Concept and Mental Model

### Offset from each edge

Think of the scrollable content as a long strip. The container is a window cut into that strip. As you scroll right, the strip slides left underneath the window.

At any scroll position, two distances describe where you are:

- **Left offset**: how much of the strip is hidden to the left of the window. This is just `scrollLeft`.
- **Right offset**: how much of the strip is still hidden to the right of the window. This is the total scrollable range minus how far you have already traveled.

```ts
const leftOffset  = scrollLeft;
const rightOffset = scrollWidth - clientWidth - scrollLeft;
```

`scrollWidth - clientWidth` is the maximum distance the strip can travel. Subtracting `scrollLeft` gives how much of that distance remains.

The arrow visibility follows directly:

```ts
const canScrollLeft  = leftOffset > 0;
const canScrollRight = rightOffset > 0;
```

When `leftOffset` is zero, the strip is all the way to the right and nothing is hidden to the left. When `rightOffset` is zero, the strip is all the way to the left and nothing is hidden to the right.

### Why this works as an event handler

The `scroll` event fires on every position change -- arrow click, scrollbar drag, keyboard navigation, or programmatic scroll. Its `target` always carries the current state of the element. Reading from `event.target` on each fire means the flags are always derived from the actual current position, not from a React counter that updates only on button clicks.

```ts
const handleScroll = (event) => {
  const { scrollLeft, scrollWidth, clientWidth } = event.target;

  const leftOffset  = scrollLeft;
  const rightOffset = scrollWidth - clientWidth - scrollLeft;

  setCanScrollLeft(leftOffset > 0);
  setCanScrollRight(rightOffset > 0);
};
```

No stored position. No synchronization. The DOM delivers the offset on every event, and the flags follow.

### What the three properties mean together

A concrete example helps fix these in memory. Imagine a container with `clientWidth = 200` and content with `scrollWidth = 500`. The total scrollable range is `500 - 200 = 300` pixels.

| scrollLeft | leftOffset | rightOffset | canScrollLeft | canScrollRight |
|------------|------------|-------------|---------------|----------------|
| 0          | 0          | 300         | false         | true           |
| 150        | 150        | 150         | true          | true           |
| 300        | 300        | 0           | true          | false          |

At `scrollLeft = 300`, the visible window has traveled all 300 scrollable pixels. Nothing remains to the right. `rightOffset` hits zero and the right arrow disappears.

## How I Think Through This

Start by naming the two offset values before writing any condition. `leftOffset` and `rightOffset` are not computed from each other -- they come from the same three source properties. Writing them out as named intermediates first makes each condition obvious and avoids compressing everything into one expression.

Then test the boundary positions mentally. When `scrollLeft` is zero, what is `leftOffset`? When `scrollLeft` equals `scrollWidth - clientWidth`, what is `rightOffset`? If both answer to zero at the correct boundary, the expressions are right.

Notice that the arrow click handlers do not need to set any visibility state. They only scroll the container. The `scroll` event fires as a result, `handleScroll` runs, and the flags update automatically. The handler is the single place that derives visibility from the DOM.

---

## Building the Solution

### Step 1: Compute the left offset and derive canScrollLeft

The first capability to earn is reading the left offset from the event. When the `scroll` event fires, the target element tells you how far it has scrolled. That number is the left offset. If it is greater than zero, content is hidden to the left and the arrow should appear.

The scaffold has a `handleScroll` function that receives the event but ignores it. Your job is to read from `event.target` and set `canScrollLeft` from what you find.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- The left offset is how far the container has already scrolled.
- One property on `event.target` gives you this number directly.
- The left arrow should appear any time that number is greater than zero.

### Step 2: Compute the right offset from the remaining scrollable distance

Now add the right arrow. The right offset is how much scrollable distance remains. The total scrollable range is `scrollWidth - clientWidth`. Subtracting `scrollLeft` gives how much of that range you have not yet reached.

The scaffold computes the left offset correctly but leaves `canScrollRight` hardcoded. Your job is to compute `rightOffset` from all three scroll properties and derive the right arrow visibility from it.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- `scrollWidth - clientWidth` is the total scrollable distance.
- Subtract `scrollLeft` to find how much of that distance is still to the right.
- The right arrow should appear any time that remaining distance is greater than zero.

### Final Solution

When you compare your finished version to the step 2 scaffold, check that both `leftOffset` and `rightOffset` are computed inside the handler from `event.target` properties. If you were to resize the window or scroll the container from outside React, the flags should still update correctly on the next scroll event.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
