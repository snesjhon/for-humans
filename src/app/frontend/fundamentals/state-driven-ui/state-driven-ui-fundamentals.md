## Overview

State driven UI starts with one rule: the state you read in a handler belongs to the render that created that handler. React does not mutate the variables already sitting inside that function. It schedules new state, finishes the handler, then renders again with a new snapshot. That is why repeated `setCount(count + 1)` calls collapse, why a second piece of state can lag one click behind the first, and why some event flows are easier to model as one object update instead of a scatter of independent setters.

**The main bug shape:** a handler reads from an old render snapshot and then schedules multiple updates as if those reads were live.

**Level 1** teaches how batching and repeated writes behave when you stay inside one state lane.

**Level 2** teaches how to coordinate multiple interacting pieces of state by deriving the next values once and reusing them.

**Level 3** teaches when a single object update is the cleaner model because one user action is really one state transaction.

## Core Concept & Mental Model

The problem from the overview is not "React updates too slowly." The problem is that a render is a snapshot, and handlers keep using the snapshot from the render where they were created.

### The Frozen Photo

Imagine every render takes a photo of your component state and hands that photo to the handlers created during that render. A click handler can point at values inside the photo, but it cannot rewrite the photo already in its hands. It can only ask React to take a new photo later.

- **photo** = one render's state snapshot
- **handler** = a function holding that render's photo
- **`setState` call** = a request for the next photo
- **batched event** = React waits until the handler finishes before publishing the next photo
- **local `nextValue` variable** = notes you compute once from the current photo and reuse consistently

Once you see handlers as reading from a frozen photo, the strange cases stop being strange.

### Why Three `setCount(count + 1)` Calls Do Not Produce Three Increments

If `count` is `0` in the current render, then every read of `count` inside that handler is still `0`.

```ts
function handleClick() {
  setCount(count + 1); // asks for 1
  setCount(count + 1); // asks for 1 again
  setCount(count + 1); // asks for 1 again
}
```

React batches the event, then processes those requests after the handler returns. But the handler did not ask for `1`, then `2`, then `3`. It asked for `1` three times from the same frozen photo.

If the update should build on whatever the latest committed state is, pass React an updater function instead:

```ts
function handleClick() {
  setCount((current) => current + 1);
  setCount((current) => current + 1);
  setCount((current) => current + 1);
}
```

Now the handler is not reading the old photo for the next value. It is handing React three instructions that React can thread through live state during the batch.

### Multiple State Values Can Drift When You Derive Them Separately

The same snapshot rule applies when one handler updates more than one piece of state.

```ts
function select(nextId: string) {
  setSelectedId(nextId);
  const item = items.find((entry) => entry.id === selectedId);
  setPreview(item?.label ?? '');
}
```

`selectedId` inside this handler is still the old value, even after `setSelectedId(nextId)`. The second line is reading from the old photo. When two state lanes must agree after one event, compute the shared "next" value once and feed it to every setter that depends on it.

```ts
function select(nextId: string) {
  const nextItem = items.find((entry) => entry.id === nextId);
  setSelectedId(nextId);
  setPreview(nextItem?.label ?? '');
}
```

### Sometimes One Event Is Really One State Transaction

If one click updates fields that always move together, separate `useState` calls can make the handler noisy and error prone. A checkout preset that sets `name`, `email`, and `step` is not three unrelated state stories. It is one transition.

That is when a single object state can be cleaner:

```ts
setCheckout({
  name: 'Guest Buyer',
  email: 'guest@example.com',
  step: 'review',
});
```

The gain is not that React suddenly becomes "more synchronous." The gain is that your code now models one user action as one coherent next snapshot.

---

## Building Blocks: Progressive Learning

### Level 1: One Snapshot, One State Lane

The first level isolates batching inside a single state lane. This is where React feels the most surprising because the UI bug looks tiny while the mental mistake is structural: you keep asking the frozen photo for the next answer instead of handing React an update rule.

The move to learn here is functional updates. If the next value depends on the previous value, especially when multiple updates happen in one event or later in a timer, write the update as a function of current state rather than reading directly from the old photo.

#### **Exercise 1**

One click is supposed to add three to the counter, but the handler reads the same `count` snapshot three times and asks React for the same next value three times. Fix the hook so one click lands as three increments, not one overwritten request. The question is simple: should this handler read the frozen photo for each increment, or should it hand React three increment instructions?

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

Two notifications are queued during one event, but both array updates spread from the same old `messages` snapshot. The second request overwrites the first instead of appending after it. Fix the hook so both notifications survive in order. Ask yourself whether the handler should build the next array from the photo in its hands or from the live array React has when each update is applied.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

One preset click should fill both `firstName` and `lastName`, but the object state is replaced twice from the same old draft snapshot, so only the final field survives. Fix the hook so one event produces one complete draft. The key move is to merge against the live object, not the stale one.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "A handler reads one photo. If the next value depends on previous state, hand React an updater instead of rereading the photo."

**→ Bridge to Level 2**: Functional updaters solve repeated writes inside one state lane. They do not solve the case where one handler coordinates several related state values that all need to agree after the click.

### Level 2: Derive The Next Values Once

Now the problem is no longer "one lane updated three times." The problem is "several state lanes need to agree, but the handler keeps reading from the old photo halfway through the transition." Setting one state value does not refresh the other reads inside that same handler.

The reliable pattern is to compute the shared next value once in a local variable, then use that next value for every setter and branch that depends on it. That gives the whole handler one internally consistent story of what the next snapshot should be.

#### **Exercise 1**

Selecting a swatch should update both the selected ID and the preview color. Right now the handler sets the new ID and then looks up the preview using the old `selectedId`, so the preview lags behind the user's click. Fix the hook so both state values agree after one selection. Compute the next swatch from the event input, not from the state value that still belongs to the current render.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

The like banner should appear exactly when the count reaches the goal, but the handler checks the old `likes` value after scheduling the increment. That makes the banner appear one click late. Fix the hook so the counter and banner agree on the same next count. Derive the next count once, then reuse it for both decisions.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

The hook stores both `count` and `doubled`, but the second setter still reads the old `count` snapshot. After one increment, `doubled` stays behind instead of tracking the new count. Fix it so both lanes move together. If several state values are derived from the same next count, compute that next count once and feed it everywhere.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Inside one handler, derive the next value once, then let every dependent update read from that shared note."

**→ Bridge to Level 3**: Sometimes a handler coordinates so many tightly related fields that several setters stop being the clearest model. The next level is about choosing a cleaner state shape for one user action.

### Level 3: One User Action, One State Transaction

Some state values are independent and deserve separate lanes. Others always move together and are easier to reason about as one object transition. If a preset, mode switch, or workflow step consistently updates several related fields, one object state often better matches the mental model of the UI.

This level is not about "objects are always better." It is about matching the state shape to the transition shape. When the user action is one coherent transaction, one coherent update can be the simplest code.

#### **Exercise 1**

A guest checkout preset should fill `name`, `email`, and move the flow to `review` in one click. The current hook replaces the checkout object three times from the same stale snapshot, so only the last replacement survives. Fix it so the preset produces one complete next checkout state. This is a good case for one object update because the user action is one transaction.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Opening a new editor item should update `selectedId`, load that item's title into the draft, and clear the dirty flag. Right now the draft title is looked up from the old `selectedId`, so the editor shows the previous item's text after the click. Fix the hook so the whole editor session changes coherently. You can solve it by deriving the next item first, and this is also the kind of transition that reads more clearly when you think of it as one session update.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

A saved dashboard preset should update `query`, `status`, and reset `page` to `1` as one view change. The current hook replaces the view object several times from the same stale snapshot, so earlier fields disappear. Fix it so applying a preset produces one stable view state. The question is not how many setters you can cram into the handler, it is how many fields truly belong to the same transition.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "If one action creates one coherent next screen, model it as one coherent next snapshot."

## Key Patterns

### Functional Updaters For Previous-State Logic

Reach for a functional updater when the next value depends on the current committed value.

- **When to use it:** repeated increments, queued appends, object merges, delayed callbacks
- **What it costs:** slightly more syntax and the discipline to think in update rules instead of direct assignments
- **What it prevents:** batched overwrites from reading the same old snapshot

### Local `nextValue` Variables For Coordinated Updates

Reach for a local `nextValue` when multiple setters or branches need to agree on the same next state during one handler.

- **When to use it:** selected item plus preview, count plus banner, value plus derived summary
- **What it costs:** one extra local variable and a bit of upfront derivation
- **What it prevents:** one-lane-ahead, one-lane-behind UI states caused by mixing old reads with new writes

### Object State For Real Transactions

Reach for one object when several fields always transition together as one concept in the UI.

- **When to use it:** workflow presets, view state, form sessions, multi-field mode switches
- **What it costs:** a broader update surface and a need to copy untouched fields carefully
- **What it prevents:** scattered handlers where one user action is implemented as several loosely related writes

### Keep Independent State Independent

Do not collapse everything into one object just because it is possible.

- **When to use separate state:** independent toggles, unrelated inputs, values with different lifecycles
- **What it costs:** more setters
- **What it prevents:** unnecessary coupling where unrelated updates now share the same object and mental surface area

---

## Decision Framework

Ask these questions in order:

1. Does the next value depend on previous state from the same lane?
   Use a functional updater.

2. Does one handler update several state values that must agree on the same next fact?
   Derive that next fact once in a local variable and reuse it.

3. Does one user action always move several fields together as one UI transition?
   Consider a single object state or a reducer-style transaction.

4. Are these fields actually independent and changed by different events?
   Keep them separate. Do not invent one big object without a transition reason.

5. Is a value entirely derivable from other state during render?
   Do not store it at all unless the lesson explicitly needs duplicated state for teaching.

## Common Gotchas & Edge Cases

- Calling a setter does not change the variable you already read inside the current handler.
- Batching is not the bug. Batching reveals that your handler asked for several updates from the same old snapshot.
- Replacing an object state several times in one event is the same stale-snapshot problem as repeating `setCount(count + 1)`.
- Duplicated derived state, like `count` plus `doubled`, is fine for teaching, but in real components you should prefer deriving during render unless persistence or performance gives you a real reason to store it.
- A single object state is cleaner only when the fields share one transition story. If the fields change independently, an object can hide boundaries instead of clarifying them.
