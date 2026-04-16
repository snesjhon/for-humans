# Factorial - Mental Model

## The Problem

Given a non-negative integer `n`, return `n!`.

The factorial of `n` is the product of all positive integers less than or equal to `n`.

- `0! = 1`
- `1! = 1`
- `n! = n * (n - 1)!`, for `n > 1`

**Example 1:**
```
Input: n = 0
Output: 1
Explanation: 0! is defined as 1.
```

**Example 2:**
```
Input: n = 3
Output: 6
Explanation: 3! = 3 * 2 * 1 = 6.
```

**Example 3:**
```
Input: n = 5
Output: 120
Explanation: 5! = 5 * 4 * 3 * 2 * 1 = 120.
```

## The Work Order Stack Analogy

Imagine a workshop that receives numbered work orders. A work order says, "Build the product for `fact(n)`." The workshop knows one thing for sure: work order `0` is already finished. It comes with a completed sample on the shelf, so the answer is immediately `1`.

For every larger work order, the foreman cannot finish it all at once. Instead, they pause the current order and create one smaller dependency: "First finish `fact(n - 1)`." The current order waits on the stack while the smaller order gets pushed on top.

When the smallest order finally finishes, the workshop starts unwinding. Each waiting order wakes back up, takes the returned value from the smaller order, multiplies by its own number, and passes that finished result upward. So recursion here is not magic. It is a stack of paused work orders, each waiting for one smaller product before it can finish its own multiplication.

## Understanding the Analogy

### The Setup

You hand the workshop one work order: `fact(n)`. Every work order has the same job description: return the factorial for its number. That sameness is what makes recursion possible. A smaller work order is not a different kind of task. It is the exact same task on a smaller input.

### The Finished Sample

The workshop has one finished sample on the shelf: `fact(0) = 1`. That is the base case. It stops the chain of smaller work orders.

Without that finished sample, the foreman would keep creating `fact(n - 1)`, `fact(n - 2)`, and so on forever. Recursion always needs a stopping point the function can answer directly.

### The Waiting Multiply

Suppose the workshop receives `fact(4)`. That order cannot finish until `fact(3)` finishes. But `fact(3)` cannot finish until `fact(2)` finishes. And `fact(2)` cannot finish until `fact(1)` finishes. In this version of the problem, we keep shrinking until we hit the single finished sample at `fact(0) = 1`.

That means every unfinished order sits on the call stack waiting to do one multiplication later. The multiplication does not happen on the way down. It happens on the way back up.

### Why This Approach

Factorial is one of the cleanest recursion drills because the prompt already gives you the full recursive shape:

- if the order is the finished sample, return `1`
- otherwise, ask for the next smaller order
- multiply the returned answer by the current number

There is only one recursive branch, which makes the call stack easier to see than in Fibonacci. That makes factorial a good first recursion problem before branching recursion and backtracking.

## How I Think Through This

I start with one question: is `n` already the stopping point? If `n === 0`, I return `1` immediately. That is the shelf sample that prevents the recursion from falling forever.

If `n` is larger than `0`, I do not try to multiply all the numbers by hand inside one call. I trust the smaller work order to finish first. I ask for `fact(n - 1)`, then multiply that returned value by `n`. The invariant is: every call to `fact(k)` must return the correct factorial for `k`.

Take `n = 4`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Start with work order `fact(4)`. It is not the finished sample, so it creates one smaller dependency."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "`fact(4)` pauses and pushes `fact(3)` on top of the stack."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)", "fact(2)"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "`fact(3)` also needs a smaller dependency, so it pushes `fact(2)`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)", "fact(2)", "fact(1)"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "push",
    "label": "`fact(2)` pushes `fact(1)`, and that call will still need the finished sample beneath it."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)", "fact(2)", "fact(1)", "fact(0)"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "top" }] }
    ],
    "action": "push",
    "label": "`fact(1)` pushes `fact(0)`. That is the finished sample, so it returns `1` immediately."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)", "fact(2)", "fact(1)"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Unwind to `fact(1)`: multiply `1 * 1 = 1`, then return that result upward."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)", "fact(2)"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Unwind to `fact(2)`: multiply `2 * 1 = 2`, then return `2`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)", "fact(3)"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Unwind to `fact(3)`: multiply `3 * 2 = 6`, then return `6`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(4)"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Unwind to `fact(4)`: multiply `4 * 6 = 24`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": [], "color": "blue" }
    ],
    "action": "done",
    "label": "The stack is empty again. Final answer: `24`."
  }
]
:::

---

## Building the Algorithm

Each step adds one rule from the workshop's work-order stack, then a StackBlitz embed to practice it.

### Step 1: Return the Finished Sample

Start with the one answer the workshop already knows: `fact(0) = 1`. Before recursion can happen, the function needs a stopping rule that returns immediately.

This step matters because every recursive call eventually depends on this exact return value. If the finished sample is wrong or missing, every larger work order collapses with it.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(0)"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "A work order for `fact(0)` reaches the top of the stack."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": [], "color": "blue" }
    ],
    "action": "done",
    "label": "Because `0` is the finished sample, return `1` with no smaller work order."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

<details>
<summary>Hints & gotchas</summary>

- Check the base case before making any recursive call.
- The returned value is `1`, not `0`. `0!` is defined as `1`.
- This step intentionally does not solve `n > 0` yet. The only goal is the stopping rule.

</details>

### Step 2: Ask for the Smaller Work Order, Then Multiply

Now teach the workshop how to finish every non-zero order. If `n` is not the finished sample, ask recursion for `fact(n - 1)`, then multiply that returned value by `n`.

This is the full recursive pattern in its simplest form: one base case, one recursive call, one combine step on the way back up the stack.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(3)"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Start with `fact(3)`. It is not the finished sample, so it asks for `fact(2)`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(3)", "fact(2)"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "`fact(2)` asks for `fact(1)`, continuing the chain downward."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(3)", "fact(2)", "fact(1)", "fact(0)"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "push",
    "label": "Eventually the stack reaches `fact(0)`, which returns `1`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(3)", "fact(2)", "fact(1)"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "pop",
    "label": "`fact(1)` wakes up and multiplies `1 * 1 = 1`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": ["fact(3)", "fact(2)"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "pop",
    "label": "`fact(2)` multiplies `2 * 1 = 2` and returns `2`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "workOrders", "items": [], "color": "blue" }
    ],
    "action": "done",
    "label": "`fact(3)` multiplies `3 * 2 = 6`. Final answer: `6`."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

<details>
<summary>Hints & gotchas</summary>

- The recursive call must move toward the base case: use `n - 1`.
- Multiply after the recursive call returns. The product is built while the stack unwinds.
- Keep the base case from step 1 exactly as it is.

</details>

## Common Misconceptions

**"The multiplication happens before the recursive call."** The current work order cannot multiply yet because it does not have the smaller result. First it waits for `fact(n - 1)`, then it multiplies on the way back up.

**"The base case for factorial should return `0` because the input is `0`."** In the workshop, `0` is the finished sample whose value is defined as `1`. Returning `0` would poison every larger work order, because every multiplication chain would eventually include `* 0`.

**"Each call has to loop through all the smaller numbers itself."** That breaks the recursive model. Each work order is responsible for only one thing: ask the next smaller order for its finished value, then multiply once by its own number.

**"Factorial and Fibonacci use the same recursion shape."** They are both recursive, but factorial has one smaller dependency while Fibonacci branches into two. The single-chain work-order stack is exactly why factorial is the simpler first drill.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
