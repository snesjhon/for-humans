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

## The Analogy: The Mountain Trail

### What are we actually searching for?

We are not searching for one best answer. We are listing every trail that uses exactly `n` uphill steps `(` and `n` downhill steps `)`, while never dropping below ground level along the way.

That is the real shape of the problem: not "try every string and filter later," but "grow only the partial trails that are still physically possible." The moment a trail would step below ground, it stops being a candidate at all.

### The Mountain Trail

Imagine a climber walking a trail made of exactly `2 * n` moves. Each `(` is one uphill step. Each `)` is one downhill step. The climber starts at ground level, must finish back at ground level, and is never allowed to go below it.

That makes a well-formed parentheses string feel physical instead of symbolic. An opening parenthesis is not just a character. It is a step up. A closing parenthesis is not just "the other symbol." It is a step back down from height the climber has already earned.

### How we define the route

While building one trail, we only need three pieces of state. `route` is the path we have already chosen. `openCount` is how many uphill steps we have spent. `closeCount` is how many downhill steps we have spent.

Those counts matter for different reasons. `openCount < n` tells us whether any uphill budget remains. `closeCount < openCount` tells us whether the climber is still above ground and is therefore allowed to step down. Together they define which next moves are legal from the current fork.

### The safety rule that makes backtracking valid

Backtracking works here because every recursive call represents one trail prefix that is already safe. We never walk onto an impossible trail and promise to repair it later. We only extend prefixes that still obey the mountain rules.

That gives one clean invariant: `0 <= closeCount <= openCount <= n`, and `route` is a legal partial trail. From that state, the only question is which legal next move to try first.

### Testing a candidate move

Testing a move is local. If the climber still has uphill steps left, they may add `(`. If the climber is above ground, they may add `)`. If neither condition is true, that branch has reached its natural stop.

Completion is just as local. When `route.length === 2 * n`, the climber has used every move in the trail budget. Because the invariant already guaranteed the prefix was safe, that full route is automatically one valid answer.

### How I Think Through This

I think of `route` as one shared trail that I keep extending and undoing. At each fork, I ask two questions in order: do I still have uphill steps left, and am I currently high enough to step back down? Those are the only two reasons a branch may continue.

I never let an invalid trail exist. If stepping down would go below ground, I simply do not take that branch. That means every recursive call starts from a route I already trust.

When the trail reaches length `2 * n`, I know I have used the full budget of moves without ever breaking the safety rule, so I record `route.join('')` and return to the previous fork.

Take `n = 3`.

:::trace-sq
[
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "("],
        "color": "blue",
        "activeIndices": [1],
        "pointers": [{ "index": 1, "label": "top" }]
      }
    ],
    "action": "peek",
    "label": "At route `((`, I am at one fork. I can still climb because openCount < n, and I can also step down because closeCount < openCount."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", ")"],
        "color": "blue",
        "activeIndices": [2],
        "pointers": [{ "index": 2, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "If I choose the downhill move, the route becomes `(()`, which is still a legal trail prefix and can keep branching."
  }
]
:::

## Building the Algorithm

Each step adds one real mountain-trail rule, then a StackBlitz exercise to lock it in.

### Step 1: Build the Trail Frame and Completion Rule

Start by building the shared frame that every branch will use. `generateParenthesis(n)` owns `results`, `route`, and the recursive helper `backtrack(openCount, closeCount)`. Inside that helper, the first real rule is the completion check: if `route.length === 2 * n`, record the current trail and return.

This step matters because it establishes what a finished trail means before we worry about how to branch. A learner should leave this step understanding that a recursive call is carrying shared state forward, and that a full-length safe route gets copied into `results`.

:::trace-sq
[
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": [],
        "color": "blue",
        "emptyLabel": "ground level"
      }
    ],
    "action": null,
    "label": "For `n = 0`, the trail starts already complete because route.length is 0 and `2 * n` is also 0."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": [],
        "color": "blue",
        "emptyLabel": "ground level"
      }
    ],
    "action": "done",
    "label": "Record the empty trail `\"\"` and return. The branching rules come later."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

<details>
<summary>Hints</summary>

- `results` and `route` should be created once inside `generateParenthesis`, not inside `backtrack`.
- The completion rule is based on total trail length, not just whether `openCount === n`.
- Record `route.join('')`, not `route`, because the same array gets mutated again during backtracking.

</details>

### Step 2: Add the Uphill Branch

Now teach the climber how to extend the trail upward. If `openCount < n`, push `(` onto `route`, recurse with `openCount + 1`, then pop it after the branch finishes.

This step matters because it introduces the core backtracking rhythm: choose, explore, undo. The uphill branch is the first place where the learner sees why one shared `route` is enough. You are not making new trail copies at every fork. You are temporarily extending the same trail, exploring everything under that choice, then restoring the earlier state.

:::trace-sq
[
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["("],
        "color": "blue",
        "activeIndices": [0],
        "pointers": [{ "index": 0, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "With `n = 2`, if route is `(` and openCount is still below `n`, the climber may spend one more uphill step."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "("],
        "color": "blue",
        "activeIndices": [1],
        "pointers": [{ "index": 1, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Push `(`, recurse, then later pop it to return to the earlier fork."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["("],
        "color": "blue",
        "activeIndices": [0],
        "pointers": [{ "index": 0, "label": "top" }]
      }
    ],
    "action": "pop",
    "label": "After that branch finishes, popping restores the trail to exactly `(` before any other choice is tried."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

<details>
<summary>Hints</summary>

- The uphill guard is `openCount < n`.
- `route.push('(')` and `route.pop()` are a matched pair around the recursive call.
- This step still cannot finish non-empty trails, because the downhill rule has not been added yet.

</details>

### Step 3: Add the Downhill Branch

The downhill branch is the rule that turns safe prefixes into complete legal trails. If `closeCount < openCount`, push `)`, recurse with `closeCount + 1`, then pop it.

This step matters because it encodes the safety invariant directly into the algorithm. `closeCount < openCount` means the climber is above ground right now. Without that check, the recursion would wander into impossible prefixes like `\")(\"`. Once both guarded branches exist, the search explores every legal trail and rejects illegal ones before they spread.

:::trace-sq
[
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "("],
        "color": "blue",
        "activeIndices": [1],
        "pointers": [{ "index": 1, "label": "top" }]
      }
    ],
    "action": null,
    "label": "At route `((` for `n = 2`, downhill is legal because closeCount is still less than openCount."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", ")"],
        "color": "blue",
        "activeIndices": [2],
        "pointers": [{ "index": 2, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Push `)` to come down one level while keeping the trail legal."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", ")", ")"],
        "color": "blue",
        "activeIndices": [3],
        "pointers": [{ "index": 3, "label": "top" }]
      }
    ],
    "action": "done",
    "label": "When route length reaches 4, `(())` is complete and gets recorded."
  }
]
:::

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

<details>
<summary>Hints</summary>

- The downhill guard is `closeCount < openCount`, not `closeCount < n`.
- That guard is what prevents the route from going below ground.
- Once this branch exists, the completion rule from step 1 starts recording the full answer set.

</details>

## Tracing through an Example

Take `n = 3`.

:::trace-sq
[
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": [],
        "color": "blue",
        "emptyLabel": "ground level"
      }
    ],
    "action": null,
    "label": "Start at the trailhead. The route is empty, so the only legal first move is uphill `(`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["("],
        "color": "blue",
        "activeIndices": [0],
        "pointers": [{ "index": 0, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Take the first uphill step. Route becomes `(`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "("],
        "color": "blue",
        "activeIndices": [1],
        "pointers": [{ "index": 1, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Take another uphill step. Route becomes `((`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", "("],
        "color": "blue",
        "activeIndices": [2],
        "pointers": [{ "index": 2, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Spend the last uphill step. Route becomes `(((`, so only downhill moves remain on this branch."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", "(", ")"],
        "color": "blue",
        "activeIndices": [3],
        "pointers": [{ "index": 3, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Step down once. Route becomes `((()`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", "(", ")", ")"],
        "color": "blue",
        "activeIndices": [4],
        "pointers": [{ "index": 4, "label": "top" }]
      }
    ],
    "action": "push",
    "label": "Step down again. Route becomes `((())`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "(", "(", ")", ")", ")"],
        "color": "blue",
        "activeIndices": [5],
        "pointers": [{ "index": 5, "label": "top" }]
      }
    ],
    "action": "done",
    "label": "Step down the final time. `((()))` is a complete trail, so it gets recorded."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["(", "("],
        "color": "blue",
        "activeIndices": [1],
        "pointers": [{ "index": 1, "label": "top" }]
      }
    ],
    "action": "pop",
    "label": "Backtrack to the earlier fork at `((`, then try stepping down sooner to build `(()())` and `(())()`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": ["("],
        "color": "blue",
        "activeIndices": [0],
        "pointers": [{ "index": 0, "label": "top" }]
      }
    ],
    "action": "pop",
    "label": "Backtrack again to `(`, where the remaining legal forks will produce `()(())` and `()()()`."
  },
  {
    "structures": [
      {
        "kind": "stack",
        "label": "route",
        "items": [],
        "color": "blue",
        "emptyLabel": "ground level"
      }
    ],
    "action": "done",
    "label": "After every legal fork is explored, the recorded trails are `((()))`, `(()())`, `(())()`, `()(())`, and `()()()`."
  }
]
:::

## Recognizing This Pattern

- Reach for this pattern when the problem asks for all valid constructions, not one best answer, and each next choice can be declared legal or illegal immediately.
- The structural property is local validity: if a prefix is already impossible, no longer string built from it can become valid later, so pruning early is correct.
- Backtracking beats brute force here because it never builds the huge pile of invalid strings that would later be filtered out.

## Common Misconceptions

**"As long as I use exactly `n` opening and `n` closing parentheses, the string is valid."** Total counts are not enough. A trail like `)(()` still goes below ground in the middle, which is already illegal.

**"The downhill rule should be `closeCount < n`."** That only says you still own some closing parentheses. It does not say there is anything available to close right now. The real rule is `closeCount < openCount`.

**"Backtracking means fixing bad trails after they happen."** Not here. The point is the opposite: only legal prefixes are allowed to keep growing.

**"I do not need to pop after recursion because the call stack will clean up for me."** The call stack returns control, but `route` is still the same shared array. If you do not pop, one branch leaks into the next branch.

## Complete Solution

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
