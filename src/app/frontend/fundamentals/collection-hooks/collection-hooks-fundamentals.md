## Overview

Collection-heavy React code mixes two separate problems. The runtime problem is identity: React only sees that state changed when you publish a new array, `Map`, or `Set` reference. The type system problem is API shape: generic helpers and hooks should preserve the collection's key and value types without forcing the caller to restate them.

**The runtime problem:** mutating an existing collection in place keeps the same reference, so React and downstream effects can miss the logical change.

**The reference problem:** publishing a brand new array with identical contents still counts as a change, so effects and memoized consumers will rerun unless you intentionally preserve the old reference on no-op updates.

**The type problem:** generic collection helpers need enough constraints to stay safe, but not so many explicit type parameters that the caller has to fight inference.

**Level 1** teaches immutable update patterns for arrays, sets, and maps so every real change publishes a new collection reference.

**Level 2** teaches how reference identity drives downstream behavior, and when a no-op update should keep the previous reference instead of cloning anyway.

**Level 3** teaches constrained generics, when `extends` belongs on a type parameter, and how to type a generic hook return shape without making callers spell out types manually.

## Core Concept & Mental Model

The problem from the overview is not "React collections are special." The problem is that a collection has two truths at once: the entries inside it and the container reference around those entries. React compares the container reference first, and TypeScript needs the container's generic shape to stay trustworthy. One mechanism model explains both.

### The Ledger Page

Imagine every array, `Map`, or `Set` in state is a ledger page.

- **ledger page** = one concrete array, `Map`, or `Set` instance
- **rows on the page** = the entries currently stored in that collection
- **publishing a new page** = returning a new collection reference from `setState`
- **scribbling on the old page** = mutating the existing collection in place
- **stable page reuse** = returning the previous reference when the logical contents did not change
- **generic constraint** = the rule that says what kinds of keys or rows may appear on the page

React does not read every row to decide whether state changed. It first asks whether you handed it the same page or a different page.

### Why In-Place Mutation Is Easy To Miss

If a hook mutates the existing array and returns it, the rows changed but the page did not.

```ts
setItems((current) => {
  current.push('new item');
  return current;
});
```

The UI bug is not that `push` failed. The bug is that React received the same array reference back. Anything relying on reference comparison, `useEffect` dependencies, memoized child props, cache keys, or equality checks, still sees the old page identity.

The same mistake appears with `Set` and `Map`:

```ts
setPinned((current) => {
  current.add('device-7');
  return current;
});

setById((current) => {
  current.set('device-7', { status: 'offline' });
  return current;
});
```

Those updates change the rows but keep the same page instance.

### Why A Fresh Array Still Triggers Effects Even When The Rows Match

The opposite edge case matters too. If you clone a collection even when nothing logically changed, React sees a new page and publishes it downstream.

```ts
setSelectedIds((current) => [...current]);
```

That array contains the same rows in the same order, but it is still a different page. Any effect that depends on `selectedIds` reruns because the dependency comparison is reference-based, not deep-content-based.

This is why both rules matter:

- publish a new page for real changes
- keep the old page for no-op changes

If you only learn the first rule, you fix missed renders but can still trigger unnecessary downstream work.

### Arrays, Sets, And Maps Need Different Update Mechanics

All three collections follow the same identity rule, but the copy pattern differs.

- **Array:** copy the list, then insert, remove, or replace by position
- **Set:** copy the set, then add or delete membership
- **Map:** copy the map, then set or delete key-value entries

The important distinction is not the method name. It is whether the method acts on a fresh copy or the current state instance.

### Generic Constraints Are The Type-Level Version Of The Same Boundary

At the type level, a generic helper needs to know what kinds of entries it is allowed to talk about.

```ts
function pick<T, K extends keyof T>(value: T, keys: readonly K[]): Pick<T, K> {
  // ...
}
```

`T` means "some object shape." `K extends keyof T` means "some keys that are valid for that object shape." The constraint is the boundary of the ledger page. Without it, `K` could be any string at all, and `Pick<T, K>` would stop being meaningful.

For maps and sets, `PropertyKey` is the matching boundary when values will be used as object-like keys:

```ts
function useSelectionSet<T extends PropertyKey>(initial: readonly T[]) {
  // ...
}
```

That constraint says the hook manages string, number, or symbol identifiers, not arbitrary objects.

### When To Add A Type Parameter, And When To Let Inference Work

Add a type parameter when one part of the API must stay linked to another part.

- `pick<T, K extends keyof T>` needs both `T` and `K` because the chosen keys depend on the object shape.
- `useMapState<K extends PropertyKey, V>` needs both `K` and `V` because the returned `get`, `set`, and `entries` APIs all depend on those two shapes.

Do not add a type parameter when the function can read the answer directly from an argument.

```ts
const devices = [{ id: 'a', status: 'online' }];

// Let TypeScript infer T from `devices`.
const ids = devices.map((device) => device.id);
```

Making the caller write `<{ id: string; status: string }>` there adds ceremony without adding information.

### The Full Model

Collection state stays predictable when the runtime and type-system rules line up:

- runtime: publish a new collection instance only for a real logical change
- runtime: preserve the old instance for a true no-op
- type system: constrain keys and item relationships where the API needs safety
- type system: let inference fill in the obvious parts from arguments

Once you see collection state as ledger pages, the weird cases stop being weird. React is tracking which page you published. TypeScript is checking which rows are legal on that page.

---

## Building Blocks: Progressive Learning

### Level 1: Publish A Fresh Collection For A Real Change

The first capability is mechanical: if the logical contents changed, return a fresh collection instance. This level keeps the problems concrete by working one collection type at a time. The goal is to make the copy pattern feel automatic.

#### **Exercise 1**

The hook appends and removes tasks by mutating the live array, then returns the same reference. Fix it so each real task-list change publishes a new array instance. The question is not which array method you prefer. The question is whether the method is acting on a fresh copy or on the current state page.

**How to think about it:**
1. Start by tracing the updater callback, not by rewriting the whole hook.
2. Ask which array instance leaves `setTasks` today, then decide what should happen when the rows really change.
3. Once that is clear, move the existing append and remove behavior onto a fresh array before you return it.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

The hook toggles pinned device IDs by mutating the existing `Set`. Fix it so membership changes happen on a copied set and the new set becomes the next state page. Watch both the membership result and the reference identity.

**How to think about it:**
1. Do not start with the `if` branches, they are already close to right.
2. First decide which `Set` instance should receive `add` or `delete`.
3. If those methods run on the live state object, the membership may look correct while React still sees the old reference.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

The inventory hook updates a `Map` in place. Fix it so increments and removals copy the map first, then publish the updated copy. The mental move is the same as arrays and sets even though the method names differ.

**How to think about it:**
1. Trace the container before you trace the math.
2. The stock arithmetic is fine, the important question is whether `set` and `delete` are acting on the current state `Map` or on a copied `Map`.
3. Once you move the existing logic onto a fresh container, the fix should fall out naturally.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "If the rows changed, publish a new ledger page."

**→ Bridge to Level 2**: Returning a fresh collection fixes missed updates, but it also creates the opposite risk: returning a fresh collection when nothing actually changed.

### Level 2: Keep The Old Reference For A Real No-Op

Now the problem changes. The collection logic is already immutable, but the hook still clones too eagerly. That produces avoidable effect runs, memo busts, and dependency churn because React only knows the reference changed, not whether the rows stayed equal.

This level teaches a second discipline: detect no-op updates and keep the previous page when the logical contents are unchanged.

#### **Exercise 1**

This hook keeps a task list in state and synchronizes whenever the task array reference changes. Fix `renameTask` so it publishes a new array only when a label really changes. If the task is missing or the label is already correct, the hook should hand back the same array reference and the sync effect should stay quiet. This is the simplest React version of "new rows" versus "same rows on a cloned page."

**How to think about it:**
1. Before you build a replacement array, ask whether this rename would change anything at all.
2. There are two no-op cases to catch early: no matching task, or a matching task whose label already equals `nextLabel`.
3. Only after ruling those out should you allocate a new array.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

This hook stores alarm-tag counts in a `Map` and records how many times a downstream sync runs. Fix `upsertTagCount` so true no-ops keep the old map reference while real changes still publish a copy. The point is not only to keep the `Map` correct, but to stop React from broadcasting a fake change.

**How to think about it:**
1. The key move is to reverse the current order of operations.
2. Right now the hook clones first and asks questions later.
3. Instead, inspect the existing value for the incoming tag, decide whether the write is real, and only clone when the next count differs from the current one.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

The hook replaces selection with a brand-new array every time, even when the next IDs match the current IDs exactly. A downstream effect counts sync runs and should stay quiet on equal-content replacements. Fix the hook so equal arrays reuse the previous reference while actual selection changes still trigger the effect.

**How to think about it:**
1. This exercise already gives you the comparison primitive: `sameIds`.
2. The real question is where to use it.
3. Put the equality decision inside the state update itself, where you can choose between reusing `current` and publishing `nextIds`.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "If the rows did not change, keep the same ledger page."

**→ Bridge to Level 3**: Reference discipline makes collection state predictable at runtime. The next level is about keeping that predictability in the type signatures of generic helpers and hooks.

### Level 3: Constrain Generic APIs Without Fighting Inference

The final capability is type design. Arrays, maps, and sets often sit behind reusable helpers or hooks, which means the collection shape has to flow through a generic API without getting erased.

This level starts with `pick<T, K>` because it makes the `extends` rule explicit, then carries that same thinking into collection-specific helpers and finally into a fully typed hook return shape.

#### **Exercise 1**

Write `pick<T, K extends keyof T>` by hand so the selected keys stay linked to the original object shape. This is the smallest useful example of "add a type parameter because two parts of the API depend on each other."

**How to think about it:**
1. Start by naming the whole object shape with one generic.
2. Then ask what the keys generic is allowed to contain.
3. It should not be arbitrary strings, it should be keys drawn from that first generic, so the return type can reuse that same relationship.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Write `toIdSet<TItem extends { id: PropertyKey }>` so the returned `Set` preserves the item's actual ID type. The helper should constrain the item shape enough to be safe, then let inference carry the specific ID type from the input array.

**How to think about it:**
1. Work backward from the two hover expectations.
2. `alarmIds` should stay `Set<number>` and `deviceIds` should stay `Set<string>`, so the return type cannot collapse to one broad key type.
3. Constrain the item enough to make `item.id` safe, then derive the `Set` element type from that field.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Type a generic `useMapState<K, V>` hook so its `entries`, `get`, `set`, and `remove` APIs all stay linked to the inferred key and value types. This is the full "generic hook return shape" version of the same idea you started with in `pick<T, K>`.

**How to think about it:**
1. Do not debug the runtime logic first, it is already fine.
2. Focus on the hook signature and ask which two shapes must stay linked everywhere.
3. Once key type and value type both live on the hook as generics, thread them through the parameter and the returned API so the whole surface area stays in sync.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Add type parameters only where the API needs linked shapes. Let inference supply the concrete shapes from arguments."

## Key Patterns

### Copy The Right Collection Primitive

Use a fresh array, `Set`, or `Map` instance before you mutate.

- **When to use it:** any collection state update that changes rows
- **What it costs:** one copy allocation
- **What it prevents:** invisible in-place mutation behind an unchanged reference

### Treat No-Ops As First-Class Decisions

If the next logical contents match the current contents, return the current reference.

- **When to use it:** rename-if-different, replace-if-equal, upsert-if-same-value, membership no-ops
- **What it costs:** a small equality check
- **What it prevents:** unnecessary effects, memo busting, and sync churn

### Constrain Keys At The Boundary

Use `K extends keyof T` for object-property relationships and `T extends PropertyKey` for key-like identifiers.

- **When to use it:** `pick`, map-backed hooks, selection sets, keyed indexes
- **What it costs:** slightly more generic syntax
- **What it prevents:** invalid keys and erased return shapes

### Prefer Inference Until The API Truly Needs Another Type Parameter

Do not add a type parameter just because the function is generic somewhere.

- **When to use explicit parameters:** when two or more arguments or return positions must stay linked
- **What it costs:** type-level design work up front
- **What it prevents:** redundant caller annotations and misleadingly complex signatures

---

## Decision Framework

Ask these questions in order:

1. Did the logical contents of the collection change?
   Return a fresh array, `Set`, or `Map`.

2. Did the requested operation turn out to be a no-op?
   Return the previous reference unchanged.

3. Does a generic parameter need to stay linked to another part of the API?
   Add a constrained type parameter such as `K extends keyof T` or `T extends PropertyKey`.

4. Can TypeScript already infer the concrete shape from the argument list?
   Let inference do the work instead of forcing an explicit type argument.

5. Will downstream code depend on this collection by reference?
   Be deliberate about when you publish a new instance, because equality checks, effects, and memoized consumers all care about identity.

## Common Gotchas & Edge Cases

### A New Reference Is Not The Same As New Data

`[...current]` can be a no-op logically and still be a change semantically to React because the array identity changed.

### A Mutated `Set` Or `Map` Looks Fine In Console Logs

Console output can fool you because the entries changed. The bug is often the unchanged container reference, not the visible rows.

### `K extends keyof T` Is About Relationships, Not Ceremony

If one type parameter depends on another, constrain it. If nothing depends on it, adding a new type parameter is usually noise.

### `PropertyKey` Exists For A Reason

If a hook treats values as keys in a `Map`, `Set`, or object-like lookup, constrain those values to `string | number | symbol` instead of letting arbitrary object types sneak in.

### "Identical Contents" Depends On The Equality Rule You Choose

In these exercises, arrays compare by same length and same element order, and maps compare by current vs next value at the touched key. Real applications sometimes need deeper equality, but you should choose that rule intentionally because it changes when references stay stable.
