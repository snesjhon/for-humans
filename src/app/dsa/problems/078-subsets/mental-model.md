# Subsets - Mental Model

## The Problem

Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in **any order**.

**Example 1:**

```
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

**Example 2:**

```
Input: nums = [0]
Output: [[],[0]]
```

**Constraints:**

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`
- All the numbers of `nums` are unique.

---

## The Packing for a Trip Analogy

Imagine you're packing for a trip. Your items are laid out in a row: passport, charger, book, jacket, and so on. You start with an empty suitcase, and your task is to list every possible combination of items you could pack, including the choice to pack nothing at all.

For each item, you face a simple decision: put it in the suitcase or leave it out. After making that choice, you move to the next item and repeat. By the time you've considered all the items, whatever is currently in the suitcase is one valid subset.

The key is that after you explore every packing list that includes a particular item, you take that item back out before trying the next option. This is backtracking: make a choice, explore everything that follows from it, undo the choice, and continue. By repeating that pattern, you generate every possible packing combination exactly once.

One critical observation: you record the suitcase contents at the start of each visit, not just at the very end. Every intermediate suitcase is already a valid subset. The empty suitcase is the empty subset `[]`. A suitcase containing only the passport is another subset. You record them all.

## Understanding the Analogy

### The Setup

You start with an empty suitcase and `n` items laid out in order. The key insight is that you don't always restart from item 0. After choosing one item, you only consider items that come after it. This prevents you from packing the same item twice and avoids generating the same subset in different orders.

### The Suitcase and the Decision

At each item, you face exactly two conceptual choices.

1. Choice one: pack `nums[i]` by putting it into the suitcase, then move forward and keep exploring.

2. Choice two: leave it out and move on.

Either way, before you make more choices, whatever is already in the suitcase is a valid subset and should be recorded.

The index where you're currently allowed to start packing is called `start`. Every recursive call begins by recording the current suitcase, then loops over items from `start` to the end, trying each one.

### The Retracing

After you fully explore every path that begins by packing item `i`, you take `nums[i]` back out. The suitcase returns to exactly the state it was in before that choice. Then the loop advances to `i + 1` and you try packing a different next item instead.

This undo step — `suitcase.pop()` — is what makes the algorithm correct. Without it, one packing branch would contaminate the next branch.

### Why This Approach

Why not generate subsets mathematically using bitmasks? Bitmasks work, but they obscure the structure: you lose the natural "here's what's currently in my suitcase, and here are the remaining items I could still pack" mental model that makes backtracking generalize to harder problems. The same pattern shows up in combinations, permutations, and N-Queens — only the rules for what you're allowed to choose next change.

Why record the suitcase at every visit rather than only at the end? Because every partial packing list is itself a valid subset. The backtracking tree has 2ⁿ leaves, but there are 2ⁿ valid subsets in total — and they correspond to the suitcase contents at each node in the tree, not just the leaves.

## How I Think Through This

Before trying any new item, I push a snapshot of `suitcase` into `results`. Starting with an empty suitcase, that immediately records `[]` as the first subset. Then I enter a loop from `start` to the end of `nums`.

On each iteration of that loop, I choose to pack `nums[i]` — push it onto `suitcase` — then call the same function recursively with `start = i + 1`. That recursive call immediately records the current suitcase again, then explores the remaining items. When the recursion returns, I unpack that item with `suitcase.pop()`. This restores the suitcase to its earlier state before the loop advances.

The stopping condition is implicit: when `start` equals `nums.length`, the for-loop body never runs. The suitcase snapshot still gets recorded, and the function returns. No explicit base case is needed.

Because `suitcase` is shared and mutated in place across every recursive call, it must be declared once in the outer `subsets` function — not recreated on each backtrack call. `results` lives there too, and both are closed over by `backtrack`. The outer function initializes them, calls `backtrack(0)`, and returns `results`.

Take `nums = [1, 2, 3]`.

:::trace-subset
{
  "labels": {
    "position": "item",
    "selection": "suitcase",
    "source": "nums",
    "pointer": "start"
  },
  "steps": [
{"nums":[1,2,3],"start":0,"basket":[],"action":"record","label":"Start with an empty suitcase. Record [] as the first subset. Now loop from item 0."},
{"nums":[1,2,3],"start":0,"basket":[1],"action":"add","label":"Pack item 0 (1) → suitcase = [1]. Recurse with start=1."},
{"nums":[1,2,3],"start":1,"basket":[1],"action":"record","label":"Arrive with suitcase [1] — record [1]. Now loop from item 1."},
{"nums":[1,2,3],"start":1,"basket":[1,2],"action":"add","label":"Pack item 1 (2) → suitcase = [1,2]. Recurse with start=2."},
{"nums":[1,2,3],"start":2,"basket":[1,2],"action":"record","label":"Arrive with suitcase [1,2] — record [1,2]. Now loop from item 2."},
{"nums":[1,2,3],"start":2,"basket":[1,2,3],"action":"add","label":"Pack item 2 (3) → suitcase = [1,2,3]. Recurse with start=3."},
{"nums":[1,2,3],"start":3,"basket":[1,2,3],"action":"record","label":"start=3 = nums.length. Record [1,2,3]. Loop never runs. Return."},
{"nums":[1,2,3],"start":2,"basket":[1,2],"action":"remove","label":"Backtrack: unpack 3 → suitcase = [1,2]. Loop ends. Return."},
{"nums":[1,2,3],"start":1,"basket":[1],"action":"remove","label":"Backtrack: unpack 2 → suitcase = [1]. Advance to item 2."},
{"nums":[1,2,3],"start":2,"basket":[1,3],"action":"add","label":"Pack item 2 (3) → suitcase = [1,3]. Recurse with start=3."},
{"nums":[1,2,3],"start":3,"basket":[1,3],"action":"record","label":"start=3 = nums.length. Record [1,3]. Return."},
{"nums":[1,2,3],"start":2,"basket":[1],"action":"remove","label":"Backtrack: unpack 3 → suitcase = [1]. Loop ends. Return."},
{"nums":[1,2,3],"start":0,"basket":[],"action":"remove","label":"Backtrack: unpack 1 → suitcase = []. Advance to item 1."},
{"nums":[1,2,3],"start":1,"basket":[2],"action":"add","label":"Pack item 1 (2) → suitcase = [2]. Recurse with start=2."},
{"nums":[1,2,3],"start":2,"basket":[2],"action":"record","label":"Arrive with suitcase [2] — record [2]. Now loop from item 2."},
{"nums":[1,2,3],"start":2,"basket":[2,3],"action":"add","label":"Pack item 2 (3) → suitcase = [2,3]. Recurse with start=3."},
{"nums":[1,2,3],"start":3,"basket":[2,3],"action":"record","label":"start=3 = nums.length. Record [2,3]. Return."},
{"nums":[1,2,3],"start":2,"basket":[2],"action":"remove","label":"Backtrack: unpack 3 → suitcase = [2]. Loop ends. Return."},
{"nums":[1,2,3],"start":1,"basket":[],"action":"remove","label":"Backtrack: unpack 2 → suitcase = []. Advance to item 2."},
{"nums":[1,2,3],"start":2,"basket":[3],"action":"add","label":"Pack item 2 (3) → suitcase = [3]. Recurse with start=3."},
{"nums":[1,2,3],"start":3,"basket":[3],"action":"record","label":"start=3 = nums.length. Record [3]. Return."},
{"nums":[1,2,3],"start":2,"basket":[],"action":"remove","label":"Backtrack: unpack 3 → suitcase = []. Loop ends. Return."},
{"nums":[1,2,3],"start":3,"basket":[],"action":"done","label":"All items considered. Results: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]] — all 8 subsets. ✓"}
  ]
}
:::

## Building the Algorithm

Each step introduces one concept from the packing analogy, then a StackBlitz embed to try it.

### Step 1: Arrive, Record, Prepare to Walk

The first thing that happens at every recursive visit is writing down whatever is currently in the suitcase. This is the recording step, and it happens unconditionally, even when the suitcase is empty.

`subsets(nums)` is the outer shell: it creates `results` and `suitcase` once, defines `backtrack` as a closure over both, calls `backtrack(0)`, and returns `results`. Both arrays persist across every recursive call because `backtrack` closes over them — no argument passing needed.

Inside `backtrack(start)`, the very first line records `[...suitcase]` into `results`. The spread operator is required — `results.push(suitcase)` would store the same reference that gets mutated later, so every entry in `results` would end up as an empty array by the time the traversal finishes.

After recording, a `for` loop runs from `start` to `nums.length - 1`. The loop body will be filled in the next step. For now, having the loop header in place is enough to prove the recording invariant: every call to `backtrack` contributes exactly one entry to `results`, regardless of what the loop eventually does.

:::trace-subset
{
  "labels": {
    "position": "item",
    "selection": "suitcase",
    "source": "nums",
    "pointer": "start"
  },
  "steps": [
{"nums":[1,2,3],"start":0,"basket":[],"action":"record","label":"backtrack(0): record [] immediately. results = [[]]"},
{"nums":[1,2,3],"start":1,"basket":[],"action":"record","label":"If called with start=1 and an empty suitcase: record []. results grows by one entry each call."},
{"nums":[1,2,3],"start":3,"basket":[1,2,3],"action":"record","label":"start=3 (past the last item): record [1,2,3]. Loop runs 0 times. Returns immediately."}
  ]
}
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

<details>
<summary>Hints</summary>

- Declare `results` and `suitcase` inside `subsets`, before defining `backtrack`. They live for the entire traversal.
- `results.push(suitcase)` stores a live reference — the suitcase will be empty by the time the traversal finishes. Use `results.push([...suitcase])` to capture a snapshot.
- When `start === nums.length`, the for-loop body never executes, but the record still happens. No explicit `if` guard is needed.
- The loop header `for (let i = start; i < nums.length; i++) {}` is the full loop for this step — leave the body empty.

</details>

### Step 2: Pack the Item, Explore, Unpack It

Now fill in the loop body. For each item `i` from `start` to `nums.length - 1`:

1. **Pack** — push `nums[i]` onto `suitcase`.
2. **Explore** — call `backtrack(i + 1)`. This recursive call immediately records the new suitcase state and explores every item after `i`.
3. **Unpack** — pop the last element off `suitcase`.

Step 3 is not optional. `suitcase` is the same array object for the entire traversal, mutated in place. After exploring all paths that start with `nums[i]` in the suitcase, you must restore the suitcase to its pre-pack state before the loop advances to `i + 1`. Without the pop, `nums[i]` contaminates every recorded snapshot in subsequent branches.

The advance to `i + 1` (not `i`) in the recursive call is equally critical. Calling `backtrack(i)` would re-examine the same item, adding `nums[i]` to the suitcase forever and stack-overflowing immediately.

:::trace-subset
{
  "labels": {
    "position": "item",
    "selection": "suitcase",
    "source": "nums",
    "pointer": "start"
  },
  "steps": [
{"nums":[1,2,3],"start":0,"basket":[],"action":"record","label":"record []. Loop i=0: pack nums[0]=1."},
{"nums":[1,2,3],"start":0,"basket":[1],"action":"add","label":"suitcase.push(1) → [1]. Call backtrack(1)."},
{"nums":[1,2,3],"start":1,"basket":[1],"action":"record","label":"record [1]. Loop i=1: pack nums[1]=2."},
{"nums":[1,2,3],"start":1,"basket":[1,2],"action":"add","label":"suitcase.push(2) → [1,2]. Call backtrack(2)."},
{"nums":[1,2,3],"start":2,"basket":[1,2],"action":"record","label":"record [1,2]. Loop i=2: pack nums[2]=3."},
{"nums":[1,2,3],"start":2,"basket":[1,2,3],"action":"add","label":"suitcase.push(3) → [1,2,3]. Call backtrack(3)."},
{"nums":[1,2,3],"start":3,"basket":[1,2,3],"action":"record","label":"record [1,2,3]. Loop runs 0 times. Return."},
{"nums":[1,2,3],"start":2,"basket":[1,2],"action":"remove","label":"suitcase.pop() → [1,2]. i=2 was the last item. Return."},
{"nums":[1,2,3],"start":1,"basket":[1],"action":"remove","label":"suitcase.pop() → [1]. Advance i to 2."}
  ]
}
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

<details>
<summary>Hints</summary>

- Push before the recursive call, pop immediately after — always paired, never separated by a conditional.
- `backtrack(i + 1)` not `backtrack(i)` — you must advance past the current item.
- The pop runs after `backtrack` returns, regardless of how deep the recursion went. It always restores the suitcase to exactly the state before the push.

</details>

---

## Common Misconceptions

**"I should only record the suitcase when `start === nums.length` (at the end of each path)"** — That would only collect the leaves of the backtracking tree, which are the longest subsets reachable from each starting branch. You'd miss `[]`, `[1]`, `[2]`, `[1,2]`, and many others. Every node in the tree — not just the leaves — holds a valid subset. Record at every arrival.

**"I don't need to pop after the recursive call — the recursion handles cleanup"** — The recursion does not reset the suitcase. `suitcase` is a shared array mutated in place throughout the entire traversal. After you pack `nums[i]` and explore everything downstream, you must remove it with `suitcase.pop()` before trying `nums[i+1]`. Without the pop, `nums[i]` stays in the suitcase for every remaining branch.

**"I should push `suitcase` directly into results, not a copy"** — `suitcase` is the same array object for the entire traversal. Pushing it directly means every entry in `results` is the same reference, and they'll all reflect the final state of `suitcase` when the traversal ends — which is empty. Always spread: `results.push([...suitcase])`.

**"Passing `i` instead of `i + 1` to the recursive call is fine"** — If you call `backtrack(i)` after packing `nums[i]`, the recursion will immediately try to pack `nums[i]` again — leading to a stack overflow. You must advance to `i + 1` so the recursion only considers later items.

**"I need to sort `nums` first for the backtracking to work correctly"** — Sorting is required for problems with duplicate elements (like LeetCode 90, Subsets II), where you need to skip duplicate choices at the same decision level. For problem 78, all elements are unique. Backtracking works in any order; sorting is irrelevant here.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
