# Generate Parentheses - Mental Model

## The Problem

Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

**Example 1:**
```
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
```

**Example 2:**
```
Input: n = 1
Output: ["()"]
```

**Constraints:**

- `1 <= n <= 8`

## The Mountain Climber Analogy

Imagine a climber walking a mountain trail made of exactly `2 * n` moves. An uphill step `(` raises the climber one level. A downhill step `)` lowers the climber one level. The climber must start at ground level, finish back at ground level, and can never go below the ground while still on the trail.

That is exactly what a well-formed parentheses string means. Every `(` opens a climb upward. Every `)` closes one of those climbs by stepping back down. If you ever try to step downhill before you have climbed enough, the trail is invalid immediately.

Backtracking fits because the climber is not following one fixed trail. They are exploring every legal trail. At each point, there may be up to two choices: step uphill if there are uphill moves left, or step downhill if the current height is above ground. After exploring one choice completely, the climber erases that step, returns to the fork, and tries the other legal path.

The important thing is that we never wander onto an invalid trail and clean it up later. We only extend prefixes that are already legal. That means every recursive call represents a valid partial trail, and the search space stays small enough to manage.

## Understanding the Analogy

### The Setup

The trail always has exactly `n` uphill steps and `n` downhill steps available in total. So while building a route, we need to remember two counts: how many uphill steps we have used and how many downhill steps we have used.

The current route is the path the climber has already walked. In code, that is a mutable array of characters. It grows when we choose a step, then shrinks again when we backtrack.

### The Uphill Rule

An uphill step means placing `(` into the route. We can only do that while `openCount < n`. Once we have already used all `n` uphill steps, no more climbing is allowed.

This rule prevents routes like `"(((("` from growing forever. It is the trail's total elevation budget.

### The Downhill Rule

A downhill step means placing `)` into the route. We can only do that while `closeCount < openCount`.

That condition is the whole correctness rule. It means the climber is only allowed to step down if they are currently above ground level. In parentheses language: we can only close a parenthesis if there is already an unmatched opening parenthesis waiting for it.

### Why This Approach

We could generate all `2^(2n)` strings of `(` and `)` and filter the bad ones afterward, but that wastes most of the work on impossible trails. Backtracking is better because the mountain rules let us reject invalid prefixes before they branch any further.

That gives one clean invariant for every recursive call: the current route is already a valid prefix, with `0 <= closeCount <= openCount <= n`. From that state, the only job is deciding which legal next step to try.

## How I Think Through This

I keep three shared pieces of state inside `generateParenthesis(n)`: `results` for finished trails, `route` for the current trail, and a recursive helper `backtrack(openCount, closeCount)`. The invariant is: `route.join('')` is always a legal prefix, so I never need to "fix" a bad trail later.

At the start of each recursive call, I ask whether the trail is complete. If `route.length === 2 * n`, the climber has used all `2 * n` moves, so this route is one full legal answer. I record `route.join('')` and return.

If the route is not complete yet, I consider the two legal next moves independently. If I still have uphill steps left, I push `(`, recurse, then pop it. If I currently have more uphill steps than downhill ones, I can also push `)`, recurse, then pop it. Those push and pop pairs are what let one shared `route` explore many different trails without leaking one branch into the next.

Take `n = 2`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": null,
    "label": "Start at ground level with an empty trail. openCount=0, closeCount=0."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Take one uphill step `(` because openCount < n. The prefix `(` is still legal."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "("], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "Take a second uphill step `(`. Now openCount=2, so no more uphill moves remain."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", ")"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "The only legal next move is downhill `)` because closeCount < openCount."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", ")", ")"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "done",
    "label": "One full trail is `(())`. Record it, then backtrack to try the other fork later."
  }
]
:::

## Building the Algorithm

Each step adds one mountain-trail rule, then a StackBlitz embed to practice it.

### Step 1: Build the Trail Frame and Summit Rule

Start with the outer frame: create `results`, create `route`, define `backtrack(openCount, closeCount)`, and stop when the trail reaches length `2 * n`.

This step does not choose any next moves yet. It only teaches the recursive frame and the recording rule: whenever a full-length legal trail is reached, convert `route` into a string and store it in `results`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": null,
    "label": "For n=0, the empty trail already has length 2 * n, so it is complete immediately."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": "done",
    "label": "Record `` as one complete trail and return. The branching rules come later."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

<details>
<summary>Hints</summary>

- `results`, `route`, and `backtrack` should all live inside `generateParenthesis`, so the helper can close over shared state.
- The completion rule is `route.length === 2 * n`, not "used all opens" or "returned to level 0" by itself.
- Record `route.join('')`, not `route`, because the array will be mutated again during backtracking.

</details>

### Step 2: Add the Uphill Branch

Now teach the climber how to go uphill. If `openCount < n`, push `(` onto `route`, recurse with `openCount + 1`, then pop it back off.

This step matters because it introduces the choose explore undo rhythm that every later branch uses. It also locks in the budget rule: uphill steps are limited to exactly `n`.

At this stage, the climber can only move upward. That means trails for `n > 0` are still incomplete, but the recursion now knows how to build legal prefixes while respecting the uphill budget.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": null,
    "label": "Start with n=2. Because openCount < n, an uphill move is allowed."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Push `(`, recurse with openCount=1, then come back to the same fork."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "("], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "Push another `(` because openCount is still below n."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "After exploring that branch, pop to restore the route before trying any other move."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

<details>
<summary>Hints</summary>

- The uphill branch is guarded by `openCount < n`.
- Push before the recursive call and pop immediately after it. Those two lines are a matched pair.
- This step still does not finish routes for `n > 0`; it only teaches the uphill half of the recursion tree.

</details>

### Step 3: Add the Downhill Branch

Now add the rule that makes the trails complete. If `closeCount < openCount`, push `)`, recurse with `closeCount + 1`, then pop it.

That guard is the correctness invariant in executable form. It prevents the climber from ever stepping below ground level. Once both branches exist, the backtracking tree generates every legal trail and none of the illegal ones.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "("], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": null,
    "label": "With route `((`, uphill moves are exhausted for n=2, but downhill is legal because closeCount < openCount."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", ")"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "Push `)` to come back down one level while keeping the prefix legal."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", ")", ")"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "done",
    "label": "Route length is now 4, so `(())` is complete and gets recorded."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Backtrack to an earlier fork, then try the branch that creates `()()`."
  }
]
:::

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

<details>
<summary>Hints</summary>

- The downhill guard is `closeCount < openCount`, not `closeCount < n`.
- `closeCount < n` would allow invalid prefixes like `")("` because it forgets whether there is anything available to close.
- Once both guarded branches exist, the completion rule from step 1 starts producing every final answer.

</details>

## Tracing through an Example

Take `n = 3`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": null,
    "label": "Start at the trailhead. Both choices are not available yet: only uphill `(` is legal because openCount=0 and closeCount=0."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Take the first uphill step. Route is now `(`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "("], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "Take another uphill step. Route is now `((`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", "("], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "Take the last uphill step. Route is now `(((`, so only downhill moves remain."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", "(", ")"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "push",
    "label": "Close once: route becomes `((()`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", "(", ")", ")"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "top" }] }
    ],
    "action": "push",
    "label": "Close again: route becomes `((())`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "(", "(", ")", ")", ")"], "color": "blue", "activeIndices": [5], "pointers": [{ "index": 5, "label": "top" }] }
    ],
    "action": "done",
    "label": "Close the final time: `((()))` is complete, so record it."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["(", "("], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Backtrack to the earlier fork at `((`, then try closing sooner to build `(()())` and `(())()`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": ["("], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Backtrack again to `(`, where another legal fork leads to `()(())` and `()()()`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "route", "items": [], "color": "blue", "emptyLabel": "ground level" }
    ],
    "action": "done",
    "label": "After exploring every legal fork, the recorded trails are `((()))`, `(()())`, `(())()`, `()(())`, and `()()()`."
  }
]
:::

## Common Misconceptions

**"As long as I use exactly `n` opening and `n` closing parentheses, the string will be valid."** That only checks the total trail budget. It does not stop the climber from stepping below ground in the middle, which is why strings like `")(()"` are still invalid. The correct mental model is that every prefix must stay on or above ground level.

**"The closing rule should be `closeCount < n`."** That only says you still have downhill moves left. It does not say there is any height available to come back down from. The correct rule is `closeCount < openCount`.

**"I can build the string with immutable concatenation and skip backtracking."** You can, but then the mountain-fork mental model becomes harder to see. The point here is to learn the choose explore undo pattern with one shared `route`.

**"Once I add `(`, I do not need to pop it because recursion will handle cleanup."** Recursion explores the deeper branch, but it does not restore the parent's trail automatically. The correct mental model is: every chosen step must be undone before you try the next fork.

## Complete Solution

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
