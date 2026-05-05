## The Problem

Practice three JavaScript situations that look harmless on first read but behave differently at runtime:

- a spread copy that still shares nested references
- a plain assignment that creates an alias instead of a copy
- a fallback expression that replaces valid falsy values

The goal is not to memorize trivia. The goal is to build the runtime model that lets you predict these outcomes before you run the code.

## Overview

JavaScript has a lot of short syntax that feels more powerful than it is. `{ ...obj }` looks like "copy the object." `other = obj` looks like "make another version." `value || fallback` looks like "use the fallback only when the value is missing."

Each one hides an important limit:

- spread copies only one level
- assignment copies the reference, not the object
- `||` falls back on any falsy value, not just missing ones

These are the same class of bug. The code reads like it is preserving data, but the operator is actually preserving less, or more, than you intended.

## Core Concept and Mental Model

### One Box, Many Labels

For objects and arrays, variables do not hold the full object contents inline. They hold a reference to a box in memory.

If two variables point at the same box, a mutation through either name changes what both variables observe:

```ts
const obj = { a: 'foo', b: { c: 'bar' } };
const obj2 = obj;

obj2.b.c = 'baz';

console.log(obj.b.c); // 'baz'
```

`obj2 = obj` did not make a second object. It made a second label for the same object.

### Spread Makes a New Outer Box, Not New Inner Boxes

Spread changes one thing: the outer object is new.

```ts
const obj = { a: 'foo', b: { c: 'bar' } };
const obj1 = { ...obj };
```

Now:

- `obj1 !== obj`, because the outer object is a new box
- `obj1.a` starts as the same primitive value `'foo'`
- `obj1.b === obj.b`, because the nested object reference was copied as-is

That means top-level writes diverge, but nested writes still leak through the shared inner reference:

```ts
obj1.a = 'baz';
console.log(obj.a); // 'foo'

obj1.b.c = 'qux';
console.log(obj.b.c); // 'qux'
```

This is why shallow copies are enough for some updates and dangerously incomplete for nested ones.

### Missing Is Not the Same as Falsy

Fallback operators have the same "looks broader than it is" problem.

`||` does not ask "is this missing?" It asks "is this falsy?"

So all of these trigger the fallback:

- `0`
- `''`
- `false`
- `null`
- `undefined`

That is often too aggressive:

```ts
const page = 0 || 1; // 1
const label = '' || 'Untitled'; // 'Untitled'
```

If you only want to replace absent values, use `??` instead. Nullish coalescing falls back only for `null` and `undefined`:

```ts
const page = 0 ?? 1; // 0
const label = '' ?? 'Untitled'; // ''
```

## How I Think Through This

When an interview question uses compact JavaScript syntax, I stop translating it into English too early. Instead I ask three concrete questions:

1. Did this line create a new object, or just another reference?
2. If it created a new object, how deep did the copy actually go?
3. Is this fallback checking for missing values, or for any falsy value?

Those three questions are usually enough to predict the result.

For object updates, I inspect the exact path being changed. If the write is to `next.theme`, a shallow copy may be enough. If the write is to `next.preferences.theme`, then `preferences` also needs its own copy.

For defaults, I ask whether `0`, `''`, or `false` are valid inputs. If they are, `||` is almost always wrong.

---

## Building the Solution

### Step 1: Reproduce the shallow-copy behavior

Start with the exact spread example that trips people up in interviews. Build a shallow clone of a profile object and watch what happens when top-level data changes versus nested data.

The important observation is not just that spread creates a new object. It is that the nested `stats` object is still shared, so the clone and the original can disagree at one level and still leak changes at another.

:::stackblitz{file="step1-problem.ts" step=1 total=3 solution="step1-solution.ts"}

**Hints**

- The outer object should be new.
- The nested object should still be the same reference in this step.
- A top-level string and a nested object do not behave the same way after spread.

### Step 2: Copy the nested path you are about to change

Now repair the trap from Step 1. A shallow copy of the outer object is not enough when the write happens inside `preferences.theme`. If the nested object is still shared, the original record is mutated too.

The fix is precise: copy the outer object, then copy the exact nested object you plan to change. You do not need a deep clone of everything. You need a fresh object along the mutation path.

:::stackblitz{file="step2-problem.ts" step=2 total=3 solution="step2-solution.ts"}

**Hints**

- Copy only the branch you are about to mutate.
- The updated `preferences` object should be new.
- Unchanged sibling branches can keep their original references.

### Step 3: Default only when the value is actually missing

The final trap looks unrelated, but it is the same mental move: inspect what the operator preserves. `||` throws away all falsy values, which means it treats `0`, `''`, and `false` as if they were missing.

Your job is to preserve valid falsy inputs and fall back only for `null` and `undefined`.

:::stackblitz{file="step3-problem.ts" step=3 total=3 solution="step3-solution.ts"}

**Hints**

- Ask whether `0`, `''`, and `false` are valid answers in this API.
- If they are valid, the fallback operator must preserve them.
- The operator you want distinguishes nullish from merely falsy.

### Final Solution

All three steps train the same habit: do not trust the short syntax until you know exactly what it keeps, what it shares, and what it replaces.

:::stackblitz{file="solution.ts" step=3 total=3 solution="solution.ts"}
