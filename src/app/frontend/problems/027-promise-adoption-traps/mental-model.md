## Overview

Promise bugs often come from a very specific misunderstanding: starting async work is not the same thing as making the outer promise wait for that work. It is easy to write code that looks asynchronous, kicks off the right operation, and still settles too early because the promise chain is no longer connected to the real source of truth.

This problem is about that connection. Each step asks the same core question in a slightly different form: what is the outer promise actually waiting for right now? If the answer is "nothing" or "the wrong branch," the caller resumes too early or stays rejected when a recovery path should have taken over.

## Core Concept and Mental Model

### The Handoff Receipt

Treat a promise like a handoff receipt. When a caller awaits a promise, they are not waiting for "some async work somewhere." They are waiting for the specific promise they were handed, and that promise only settles when something explicitly settles it.

That means there are three distinct moments you have to separate in your head:

- you start some work
- that work finishes
- the outer promise settles

If those moments are not linked deliberately, they drift apart.

### Starting Work Is Not Settlement

This is the first trap:

```ts
return new Promise((resolve) => {
  let value: string | null = null;

  setTimeout(() => {
    value = 'ready';
  }, 20);

  resolve(value);
});
```

The timer was started, but the promise did not wait for it. `resolve(value)` ran immediately, while `value` was still `null`. The later callback changes a local variable, not the already-settled promise.

The fix is not "do async work better." The fix is more precise: settle the promise from the callback that actually knows the work finished.

### Returning a Promise Makes the Chain Adopt It

The next trap happens inside `.then()`:

```ts
return Promise.resolve(id).then((userId) => {
  fetchUser(userId).then((user) => user.name.toUpperCase());
  return 'fallback';
});
```

This starts the right async work, but the outer chain is still not waiting for it. The `.then()` handler returned `'fallback'`, so the chain settles from that value instead.

The important rule is this: a `.then()` or `.catch()` handler controls the next promise in the chain through its return value.

- return a plain value, and the chain continues with that value
- throw, and the chain becomes rejected
- return a promise, and the chain adopts that promise and waits for it

That adoption rule is one of the most important promise mechanics to internalize.

### Recovery Only Works If You Return the Recovery Branch

The same rule applies to `.catch()`:

```ts
fetchUser(id).catch((error) => {
  fetchUser(id);
  throw error;
});
```

This launches a retry, but it does not replace the failed branch. The outer chain still sees the thrown error because the retry promise was never returned.

If you want recovery to become the new path, you have to return it:

```ts
fetchUser(id).catch(() => {
  return fetchUser(id);
});
```

Now the chain stops following the old failure and starts waiting for the new promise instead.

## How I Think Through This

When I read promise code, I stop looking at indentation first and instead trace settlement ownership. Which line settles the promise the caller received? Which handler return value becomes the next link in the chain? If async work is started in one place but never returned or wired into `resolve` or `reject`, I assume there is a bug until proven otherwise.

That makes interview-style promise questions much easier to reason about. Instead of asking "is this async?", ask "what exactly is the outer promise waiting for?" If the answer changes step by step, the code gets clearer quickly.

---

## Building the Solution

### Step 1: Settle the promise from the callback that finishes the work

The callback-based reader already knows when the data is ready. The bug is that the outer promise settles before that callback runs, so the caller gets `null` even though the data shows up later.

Keep the mental model narrow here. Do not think about caching, retries, or transformations yet. Just connect the promise to the callback that proves the work is finished.

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

**Hints**

- `new Promise(executor)` runs the executor synchronously.
- Updating a local variable later does not retroactively change an already-settled promise.
- Settle the promise in the place that actually receives the finished user.

### Step 2: Return the nested promise so the outer chain waits for it

This version starts the follow-up fetch correctly, but it returns the wrong thing from `.then()`. The chain only adopts work that the handler returns. If the nested promise is started and ignored, the outer promise resolves from whatever else the handler returned.

Read the `.then()` body like a contract: whatever comes out of this callback becomes the next promise in the chain. Make the chain follow the asynchronous transformation instead of a placeholder value.

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

**Hints**

- A `.then()` callback decides what the next link in the chain waits for.
- Starting `fetchUser` is not enough if the handler returns something else.
- Return the async transformation branch itself.

### Step 3: Return the retry branch from `.catch()`

Now the chain has a recovery path, but the recovery path is not actually replacing the failure. The retry starts, then the original error keeps flowing outward because the catch handler never hands the new promise back to the chain.

Use the same adoption rule from Step 2, but apply it to recovery. If the retry should become the new truth, the catch handler has to return it.

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

**Hints**

- `.catch()` is just another promise handler with the same return-value rules as `.then()`.
- If the retry promise is not returned, the outer chain never switches to it.
- Recovery only replaces failure when the catch handler hands the new branch back.

### Final Solution

All three steps are the same mechanism viewed from different angles. The caller only waits for work the outer promise is explicitly connected to. If you resolve too early, return the wrong value, or fail to return the recovery branch, the chain breaks.

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
