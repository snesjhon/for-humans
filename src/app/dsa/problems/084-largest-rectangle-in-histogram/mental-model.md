# Largest Rectangle in Histogram - Mental Model

## The Problem

Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return the area of the largest rectangle in the histogram.

**Example 1:**
```
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The above is a histogram where width of each bar is 1.
The largest rectangle is shown in the red area, which has an area = 10 units.
```

**Example 2:**
```
Input: heights = [2,4]
Output: 4
```

**Constraints:**

- `1 <= heights.length <= 10^5`
- `0 <= heights[i] <= 10^4`

## The Closing Roof Permits Analogy

Imagine you are walking left to right across a row of warehouse columns, trying to issue **flat roof permits**. Each permit says, "I can keep extending a roof at this height until some future column is too short to support it."

You do not need to remember every possible roof separately. You only need the permits that are still open. Each open permit stores two facts: the roof height it is trying to preserve, and the earliest column where that roof was allowed to begin.

When a new column is at least as tall as the last open permit, that permit can stay open, and the new column may open another permit of its own. But when a shorter column appears, some taller permits must be **closed immediately**. Their right boundary is now fixed: they can stretch no farther than the column just before the drop. The moment a permit closes, its full rectangle area is finally known.

The subtle part is what the shorter column inherits. If a roof of height `2` closes a roof of height `5`, the lower roof can still use the same left support columns that the taller roof had already proven valid. So the shorter permit inherits the earliest left boundary from any taller permits it just closed.

## Understanding the Analogy

### The Setup

Every rectangle in the histogram chooses a height, then stretches left and right as long as every covered bar is at least that tall. That means each candidate rectangle is really asking one question: "Where is the first bar on the right that is too short for me?"

If we knew that closing point for every height, we could compute each area instantly. The trouble is that the closing point is not known when a roof permit first opens. We only discover it later when a shorter bar appears.

### Why Some Permits Stay Open

As you scan from left to right, keep a stack of open roof permits whose heights are increasing. The newest permit is always the most fragile one because it is the tallest unresolved roof.

If the current bar is taller, the tallest open roof still survives, so nothing needs to close. The new bar simply opens a fresh permit on top of the stack.

### Why A Shorter Bar Forces Closures

If the current bar is shorter than the top permit, that top roof can no longer continue through the current column. So its rectangle is complete: its height is known from the permit, and its width runs from the permit's stored `start` column up to `index - 1`.

You keep closing taller permits until the top of the stack is no taller than the current bar. That is what makes the stack monotonic: after cleanup, the open permits still rise in height from bottom to top.

### Why This Approach

A brute-force search would try many left-right pairs and repeatedly ask for the minimum height inside them, which is too slow. The permit stack avoids that repeated work because each bar opens at most one permit and each permit closes once.

That gives an `O(n)` scan. The stack stores exactly the unresolved rectangle heights, and each shorter bar settles the areas of the permits it blocks.

## How I Think Through This

I scan `heights` from left to right with a stack named `openRectangles`. Each stack item stores `{ start, height }`, meaning: "there is still an unresolved rectangle of this `height` that could have started at column `start`." The invariant is: **after cleanup, `openRectangles` is increasing by height, and every stored permit is still legally supported by every bar from `start` through the current column.**

For each `index`, I begin with `start = index` because a new rectangle can always begin at its own bar. Then I compare `heights[index]` to the top permit. While the top permit is taller, that permit must close here, so I pop it, compute `closed.height * (index - closed.start)`, and update `largestArea`. Crucially, I also move `start` left to `closed.start` because the current shorter roof can inherit every support column the closed taller roof had already covered. After all taller permits are gone, I push `{ start, height: heights[index] }`.

When the scan ends, any permits still open are rectangles that survive all the way to the right edge. I close them using width `heights.length - permit.start`.

Take `heights = [2,1,5,6,2,3]`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "current" }] },
      { "kind": "stack", "label": "openRectangles", "items": [], "color": "orange", "emptyLabel": "no open roof permits yet" }
    ],
    "action": null,
    "label": "Start at bar 0. No permits are open yet."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [0, 1], "pointers": [{ "index": 1, "label": "current drop" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@2"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "close this permit" }] }
    ],
    "action": "pop",
    "label": "Bar 1 has height `1`, so the `0@2` permit closes. Its area is `2 * (1 - 0) = 2`, and bar 1 inherits start `0` because a lower roof can still use that left support."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [2, 3], "pointers": [{ "index": 3, "label": "current" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "2@5", "3@6"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top permit" }] }
    ],
    "action": "push",
    "label": "Bars 2 and 3 keep climbing, so permits `2@5` and `3@6` both stay open on top of the earlier `0@1` permit."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "current drop" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "survives" }] }
    ],
    "action": "pop",
    "label": "Bar 4 has height `2`, so `3@6` closes with area `6`, then `2@5` closes with area `10`. Bar 4 inherits start `2`, because height `2` can stretch across bars 2 through 4."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [5], "pointers": [{ "index": 5, "label": "current" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "2@2", "5@3"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top permit" }] }
    ],
    "action": "push",
    "label": "Bar 5 rises again, so a fresh `5@3` permit opens while `0@1` and `2@2` remain unresolved."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [5], "pointers": [{ "index": 5, "label": "end" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "2@2", "5@3"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "best survivor" }] }
    ],
    "action": "done",
    "label": "At the right edge, the remaining permits close using the histogram end as their boundary. The best area stays `10` from height `5` spanning bars 2 through 3."
  }
]
:::

## Building the Algorithm

### Step 1: Start the Best-Area Tracker

Before any roof permits open or close, the function needs one place to remember the best rectangle found so far. Start with `largestArea = 0`.

That is not filler. Area `0` is already the correct answer for an empty histogram or a histogram made entirely of zero-height bars. This step establishes the return value the rest of the algorithm will improve.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": [], "color": "blue", "emptyLabel": "empty histogram" },
      { "kind": "stack", "label": "openRectangles", "items": [], "color": "orange", "emptyLabel": "no permits yet" }
    ],
    "action": null,
    "label": "With no bars, the best rectangle area is already `0`."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:0", "1:0", "2:0"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "all flat" }] },
      { "kind": "stack", "label": "openRectangles", "items": [], "color": "orange", "emptyLabel": "still unused" }
    ],
    "action": "done",
    "label": "If every bar has height `0`, every possible rectangle still has area `0`, so the tracker is already correct."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=4 solution="step1-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Own the return value first**: the algorithm needs one running best answer before it can compare any rectangles.
  - **Zero is a real answer**: empty histograms and all-zero histograms both legitimately return `0`.
  - **Do not prebuild the stack yet**: step 1 is only about the result tracker.
</details>

### Step 2: Open Permits and Close Them at the Right Edge

Now add the permit stack itself. As you scan left to right, push one permit for each bar: its own `start` column and its own `height`.

For now, do not close permits early when a shorter bar appears. Just let every permit stay open until the end, then close the survivors against the right boundary. That already solves histograms where heights never decrease, because in those cases every rectangle really does survive to the edge.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:3", "2:4"], "color": "blue", "activeIndices": [0, 1, 2], "pointers": [{ "index": 2, "label": "scan end" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@2", "1@3", "2@4"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top permit" }] }
    ],
    "action": "push",
    "label": "In a rising histogram, every bar opens a permit and none need to close early."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:3", "2:4"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "right edge" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@2", "1@3", "2@4"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "widest permit" }] }
    ],
    "action": "done",
    "label": "At the right edge, `0@2` spans width 3 for area `6`, which becomes the best rectangle."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=4 solution="step2-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Store both facts**: each permit needs a `start` and a `height`.
  - **This step only trusts the right edge**: it works for rising or flat histograms where no earlier closing point exists.
  - **Flush the survivors**: once the scan ends, every remaining permit uses `heights.length` as its right boundary.
</details>

### Step 3: Close Taller Permits When A Drop Appears

Now teach the first real monotonic-stack rule. When the current bar is shorter than the top permit, that taller permit is finished. Pop it and score its area using the current index as the first blocked column on the right.

At this stage, the current shorter bar still opens a fresh permit starting at its own column. That is enough to solve many dropped histograms, including the prompt example, because it correctly closes tall roofs the moment they become impossible.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "drop here" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "2@5", "3@6"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "close first" }] }
    ],
    "action": "pop",
    "label": "At bar 4 with height `2`, permit `3@6` closes first because height `6` cannot continue through a bar of height `2`."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "same drop" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "shorter permit remains" }] }
    ],
    "action": "pop",
    "label": "Permit `2@5` closes too, giving area `5 * (4 - 2) = 10`. That already reveals the prompt's best rectangle."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:5", "3:6", "4:2", "5:3"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "new permit" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "4@2"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "fresh start for now" }] }
    ],
    "action": "push",
    "label": "For now, the shorter bar opens a fresh permit starting at its own column `4`."
  }
]
:::

:::stackblitz{file="step3-problem.ts" step=3 total=4 solution="step3-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Use the current index as the closing wall**: once a shorter bar arrives, taller permits stop at `index - 1`.
  - **Pop all taller permits, not just one**: multiple roofs may become invalid at the same drop.
  - **This step is still slightly incomplete**: the shorter replacement permit starts fresh for now, which misses some cross-valley widths.
</details>

### Step 4: Let The Shorter Permit Inherit The Left Boundary

This is the final missing insight. When a shorter bar closes taller permits, it should not always start at its own column. A lower roof can still use every left support column that the closed taller roofs had already validated.

So while popping, keep moving `start` left to the popped permit's `start`. After cleanup, push the current shorter bar using that inherited `start`. That lets valleys produce wide rectangles like the `1` in `[2,1,2]`, which should span all three bars for area `3`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:2"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "current valley" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@2"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "popped permit" }] }
    ],
    "action": "pop",
    "label": "At bar 1 with height `1`, permit `0@2` closes. The current shorter bar learns that column `0` was already safe support."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:2"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "inherit start 0" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "reopened wider permit" }] }
    ],
    "action": "push",
    "label": "Instead of opening `1@1`, the shorter bar opens `0@1`, inheriting the left boundary from the permit it closed."
  },
  {
    "structures": [
      { "kind": "queue", "label": "bars", "items": ["0:2", "1:1", "2:2"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "right edge" }] },
      { "kind": "stack", "label": "openRectangles", "items": ["0@1", "2@2"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "width 3 permit" }] }
    ],
    "action": "done",
    "label": "At the end, permit `0@1` spans all three bars, so the algorithm finds area `3`, which step 3 would miss."
  }
]
:::

:::stackblitz{file="step4-problem.ts" step=4 total=4 solution="step4-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Carry the oldest usable start**: every popped taller permit proves that the current shorter height can extend at least that far left.
  - **The new permit reuses the inherited `start`**: do not reopen it at `index` unless nothing was popped.
  - **This is what fixes valley cases**: inputs like `[2,1,2]` need the center bar to stretch across both sides.
</details>

## Common Misconceptions

**"The best rectangle must use one of the tallest bars."** Not necessarily. In the permit model, a shorter roof can win by spanning much farther. Width can beat height.

**"When a shorter bar arrives, I only need to close one taller permit."** A single drop can invalidate several stacked roofs at once. Keep closing permits until the remaining top height is no taller than the current bar.

**"After popping taller permits, the shorter bar should always start at its own column."** That throws away left support columns the shorter roof can still use. The correct mental model is that the shorter permit inherits the earliest `start` from the permits it closed.

**"Any bar left in the stack was never scored."** Open permits are unresolved, not forgotten. At the right edge, they all close using the histogram end as their final boundary.

## Complete Solution

:::stackblitz{file="solution.ts" step=4 total=4 solution="solution.ts"}
