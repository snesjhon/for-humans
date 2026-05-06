## Overview

JavaScript runtime bugs usually happen before React ever gets a chance to help. A component receives the result of earlier runtime decisions: whether a value was copied or shared, whether a fallback treated `0` as missing, whether an update changed a reference or mutated in place, and whether a callback ran in the current turn or a later queue.

**The interview problem:** predict what a snippet does before you run it, especially when the bug is really about shared references, defaulting, coercion, mutation, or scheduling.

**The React payoff:** once these runtime rules are fresh, state updates, derived values, and async UI behavior become much easier to defend out loud.

**Level 1** teaches shared identity, specifically value vs reference and why shallow copies only protect the outer layer.

**Level 2** teaches presence semantics, specifically the difference between missing values and falsy values, plus the coercion traps that `==` introduces.

**Level 3** teaches time and side effects, specifically which array operations mutate in place and why Promise callbacks run before `setTimeout` callbacks.

## Core Concept & Mental Model

The interview problem from the Overview is really a bookkeeping problem: before React reads anything, the JavaScript runtime has already written a ledger of what happened. Some lines in that ledger say "copied a value." Some say "shared a reference." Some say "fell back because the value was missing." Some say "mutated the existing container." Some say "queued this callback for later." If you can read that ledger accurately, the snippet stops feeling tricky.

### The Runtime Ledger

Think of each line of code as writing one entry into a runtime ledger.

- **copied value** = a primitive assignment such as `const b = a`
- **shared reference** = an object or array alias such as `const next = current`
- **outer copy only** = a shallow spread such as `{ ...state }`
- **missing-value decision** = whether `??` or `||` decided to keep or replace a value
- **in-place mutation** = an operation like `sort()` or `splice()` that changes the existing array
- **queued callback** = a Promise or timer callback scheduled to run after the current call stack

The important point is that the ledger is literal. JavaScript does not remember your intent. If two variables point at the same object, later writes hit the same object. If `||` sees `0`, it falls back even when `0` was a perfectly valid answer. If `sort()` runs on the original array, the original array is now reordered. If both a Promise callback and a timeout are queued, the microtask runs first.

### Copying Is Not The Same As Separating

Primitives are copied by value. Objects and arrays copy references unless you explicitly create a new container.

```ts
const count = 1;
const nextCount = count; // copied value

const state = { theme: 'light', filters: ['open'] };
const alias = state;     // shared reference
alias.theme = 'dark';
// state.theme is now 'dark' too
```

That explains the first class of bugs. The second class comes from assuming a shallow copy is deep:

```ts
const state = {
  theme: 'light',
  preferences: { density: 'compact' },
};

const next = { ...state };              // new outer object only
next.preferences.density = 'comfortable';

// state.preferences.density is now 'comfortable'
```

The ledger entry for the spread is "copied the outer object." It is not "deep copied every nested path."

### Defaulting Is A Policy Choice

`||` and `??` do different jobs. `||` treats any falsy value as a reason to fall back. `??` falls back only for `null` and `undefined`.

```ts
0 || 10;      // 10
0 ?? 10;      // 0
'' || 'N/A';  // 'N/A'
'' ?? 'N/A';  // ''
```

That difference matters because many frontend values are allowed to be falsy: `0` items, an empty search box, `false` for a disabled toggle. When those are valid states, the ledger should record "value is present" rather than "replace it."

### Mutation And Scheduling Change What React Sees

Some operations change the existing container. Others return a new one.

```ts
const values = [3, 1, 2];
values.sort();             // mutates values

const copied = [...values].sort(); // sorts a new array instead
```

And async callbacks are not all equal:

```ts
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
```

The ledger order is:

1. log `start`
2. queue timeout
3. queue promise callback
4. log `end`
5. drain microtasks, so `promise`
6. run the next macrotask, so `timeout`

Once you read code this way, the question becomes concrete: what ledger entries did this snippet actually create?

---

## Building Blocks: Progressive Learning

### Level 1: Shared Identity

This level makes one skill reliable: follow the identity path of a value. If the data is primitive, assignment copies it. If it is an object or array, assignment shares it. If you spread, only the outer container becomes new. That is the whole level.

In React terms, this is the prerequisite for understanding why "I updated state" is not enough. The real question is which references changed and which ones stayed shared.

```ts
const draft = { title: 'Review', meta: { pinned: false } };

const alias = draft;          // shares the same object
const shallow = { ...draft }; // new outer object only
```

#### **Exercise 1**

`appendTag` receives an existing array of tags and a new tag to add. Return a new array that contains the new tag without mutating the original array. This is the simplest identity rule in the whole guide: array assignment shares the same container, so appending must happen on a fresh array.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

`renameUser` receives a user object and a new name. Return a new user object with the updated `name`, while leaving the original object unchanged. The runtime skill is the same as Exercise 1, just on an object instead of an array.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

`setTheme` receives a settings object with a nested `preferences` object. Return a new settings object where `preferences.theme` changes, while the original nested object stays untouched. This is the shallow-copy trap directly: copying the outer object is not enough when the write lands on a nested path.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "Follow the write path. Every object or array on that path needs a new container."

**Bridge to Level 2**: After identity is clear, the next source of bugs is not sharing, it is policy. Did this code treat the value as missing or merely falsy?

### Level 2: Presence Semantics

This level trains a different question: when code falls back or compares values, what policy did it apply? `??` means "missing only." `||` means "any falsy value." `===` means "same type and same value." `==` means "coerce first, then compare."

That policy choice is where a lot of interview bugs hide. A badge count of `0` is still a real count. An empty string can still be a real input. A boolean flag should not quietly match the number `0` just because loose equality allows it.

```ts
const count = 0;
count || 99; // 99 — falsy fallback
count ?? 99; // 0  — missing-only fallback

false == 0;  // true — coerced
false === 0; // false
```

#### **Exercise 1**

`resolveRetryDelay` receives an optional delay in milliseconds. Use the provided delay when it exists, but fall back to `1000` only when the delay is actually missing. A delay of `0` is valid and should stay `0`.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

`isReadyCode` should return `true` only when the input is exactly the number `0`. Strings like `'0'` and booleans like `false` should not count. The lesson is not about cleverness, it is about refusing coercion.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

`hasProvidedValue` should return `false` only for `null` and `undefined`. Values like `0`, `false`, and `''` are present and should return `true`. This is the runtime version of deciding whether a field is absent or simply empty.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Pick the fallback policy first, then write the operator that matches it."

**Bridge to Level 3**: Once identity and presence are clear, the last major source of surprises is time. Did this operation mutate the current container, and when does this callback actually run?

### Level 3: In-Place Change And Queue Order

The last level combines two runtime rules that frequently get mixed together in interviews: whether an operation changed the current container, and when queued work actually runs. Both are temporal questions. One asks "what changed right now?" The other asks "what runs later, and in what order?"

Mutation matters because later code sees the mutated container immediately. Queue order matters because later callbacks do not all run in the same phase. Promise callbacks drain before timers.

```ts
const scores = [3, 1, 2];
const sorted = [...scores].sort((a, b) => b - a); // scores untouched

const order: string[] = [];
order.push('sync');
Promise.resolve().then(() => order.push('microtask'));
setTimeout(() => order.push('timeout'), 0);
```

#### **Exercise 1**

`appendMessage` adds a new message to a log. Return a new array and leave the input log unchanged. This reinforces the non-mutating pattern before you touch a more subtle mutating method.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

`sortScoresDescending` should return scores from highest to lowest without changing the original array. `sort()` is the trap here because it mutates in place. The correct solution makes a new array first, then sorts the copy.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

`collectQueueOrder` should produce the observable execution order for one synchronous log, one Promise callback, and one `setTimeout` callback. The point is not memorization. The point is proving to yourself that microtasks drain before the next macrotask.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Ask two timing questions: did this line mutate the current container, and which queue runs next?"

## Key Patterns

- Primitive assignment copies a value. Object and array assignment shares a reference.
- Spread and array cloning are shallow. They protect only the containers you explicitly recreate.
- `??` is the missing-value operator. `||` is the falsy fallback operator.
- `===` preserves type boundaries. `==` invites coercion bugs.
- Methods like `map`, `filter`, `slice`, and `concat` return new arrays. Methods like `sort`, `reverse`, and `splice` mutate the current one.
- Promise callbacks run in the microtask queue before the next timer callback in the macrotask queue.

---

## Decision Framework

When a runtime snippet looks confusing, walk it in this order:

1. What values are primitive copies, and what values are shared references?
2. If a write lands on a nested path, which containers on that path need to be recreated?
3. Is the fallback policy "missing only" or "any falsy value"?
4. Does this comparison rely on coercion, or should the types stay strict?
5. Did this operation mutate the current container or return a new one?
6. If callbacks are queued, which ones are microtasks and which ones are macrotasks?

If you answer those six questions in order, most interview snippets stop being guesswork.

## Common Gotchas & Edge Cases

- `const next = current` is not a copy for objects or arrays. It is a second label for the same container.
- `{ ...state }` does not protect nested objects. If `state.preferences.theme` changes, `preferences` also needs its own copy.
- `0`, `false`, and `''` are often valid user states. Replacing them with `||` is usually a policy bug, not a syntax bug.
- `null == undefined` is `true`, which is why loose equality hides missing-value mistakes so easily.
- `NaN === NaN` is `false`. Use `Number.isNaN(...)` when you need to detect it.
- `sort()` mutates before it returns, so "I only used the return value" is not a defense.
- `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`, even when the timeout delay is zero.
