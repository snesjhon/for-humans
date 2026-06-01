## The Problem

Implement `promiseAll`, a utility that takes an array of values or promises and returns one promise for the whole batch.

The finished behavior should match the core `Promise.all` contract:

- preserve the input order in the resolved array
- wait until every input has fulfilled
- reject immediately when the first input rejects
- resolve immediately with `[]` when the input is empty

The core question is why completion order cannot decide the output order, and how one shared remaining-count model controls both final resolution and fail-fast rejection.

## Overview

`Promise.all` looks simple from the outside because it returns one promise. Internally, though, it is coordinating several independent branches at once. Each branch may finish at a different time. One branch may already be a plain value. Another may reject before the rest finish. The outer promise still has to obey one clean contract.

That means the implementation cannot be "push values as they arrive." Arrival order is runtime timing. Output order is input structure. Those are different things. The function needs a stable slot for each input, plus one place to track how many unfinished branches are still outstanding.

This problem teaches that coordination shape in three passes. First, reserve slots so out-of-order completion still produces in-order output. Then adopt plain values and the empty-array case without changing the mechanism. Finally, add fail-fast rejection so the outer promise settles exactly once, even if other branches finish later.

## Core Concept and Mental Model

### The Arrival Board

Treat `promiseAll` like a dispatch board with one row per input.

- each input gets a fixed slot based on its index
- each slot starts empty
- when a branch fulfills, it fills its own slot
- the outer promise resolves only when every slot has been filled

That means the result array is not built in completion order. It is built by position.

```ts
inputs:   [ slowA, fastB, slowC ]
slots:    [   _  ,   _  ,   _   ]

fastB settles first  -> [   _  ,  'B',   _   ]
slowA settles next   -> [  'A' ,  'B',   _   ]
slowC settles last   -> [  'A' ,  'B',  'C'  ]
```

If you `push` as branches finish, you get `['B', 'A', 'C']`, which describes timing, not the original input list.

### One Counter Owns Final Resolution

The outer promise does not care which branch finishes last. It only cares how many unfinished branches remain.

So the implementation needs one shared number:

- start with `remaining = inputs.length`
- every fulfilled branch writes into its slot, then decrements `remaining`
- when `remaining === 0`, every slot is filled, so resolve with the results array

That counter is the synchronization mechanism. The slots preserve order. The counter decides when the batch is complete.

### Plain Values Still Need a Slot

`Promise.all` accepts plain values too:

```ts
Promise.all([Promise.resolve('A'), 'B', 3]);
```

Those plain values still belong to the same dispatch board. They are just branches that are already fulfilled. `Promise.resolve(input)` is the bridge that lets every iteration use one uniform `.then(...)` path, whether the input started as a promise or not.

### Rejection Closes the Board Early

The final rule is fail-fast rejection. If any branch rejects, the outer promise rejects immediately with that error. It does not wait for the rest.

That means there are really two ways the outer promise can settle:

- all slots are filled, so resolve with the ordered results
- one branch rejects first, so reject immediately

After either one happens, the outer promise is done. Later fulfillments or rejections from other branches should not change the outcome.

## How I Think Through This

When I read a batch-promise implementation, I ignore the loop first and ask two narrower questions.

First: where is the output order coming from? If the code uses `push`, it is probably letting completion timing leak into the result shape. For `Promise.all`, the output order has to come from the original input index.

Second: what exact condition settles the outer promise? It should not be "the last callback I happened to notice." It should be one explicit counter reaching zero, or one explicit rejection arriving first.

Once those two ownership rules are clear, the code shape becomes steady: reserve slots, normalize each input through `Promise.resolve`, decrement the shared counter on fulfillment, and reject on the first failure.

---

## Building the Solution

### Step 1: Preserve input order even when completion order differs

Start with the simplest success-only version. The inputs are all promises, but they do not finish in index order. One branch can settle faster than an earlier branch, and that should not reorder the final output.

Use the arrival-board model from the mental model directly here. Each input needs a reserved result slot tied to its original index. Filling by index is the whole point of this step.

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

**Hints**

- `push` describes arrival order, not input order.
- Pre-size or reserve the results array so each branch can write to `results[index]`.
- Resolve only after every branch has fulfilled.

### Step 2: Adopt plain values and the empty-array case

Now make the utility behave like `Promise.all`, not just a success-only helper for promise arrays. Plain values should flow through the same mechanism as promises, and `[]` should resolve immediately without waiting on anything.

The key move is to normalize each input before attaching handlers. That lets one loop handle both already-fulfilled values and asynchronous branches without separate code paths.

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

**Hints**

- A plain value still belongs in a result slot at its original index.
- `Promise.resolve(...)` turns both values and promises into one consistent pathway.
- If there are zero inputs, the remaining-count model should already say "done."

### Step 3: Reject on the first failure

The outer promise should stop waiting as soon as any branch rejects. That means the rejection path must settle the outer promise directly instead of leaving the batch half-open while other branches continue running.

Keep the success mechanism from Step 2. The new work is adding the fail-fast branch without breaking the "settle once" contract of the outer promise.

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

**Hints**

- The same outer promise cannot both reject early and later resolve successfully.
- Attach a rejection handler for each normalized branch.
- Let the first rejection settle the batch immediately.

### Final Solution

The finished implementation has one stable shape:

- normalize every input
- write fulfilled values into fixed result slots
- decrement one shared remaining counter
- resolve when the counter reaches zero
- reject immediately on the first failure

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
