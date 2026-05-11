## The Problem

You are given a list of items. Build the functionality for a search input and a filter control that update the visible results in real time. Focus on state and behavior only: manage the search query, manage the active filter, derive the visible items from both, and handle empty queries and empty results cleanly.

## Overview

This can look like a UI problem at first because the screen has controls and a list. The harder part is not the controls themselves. The harder part is deciding what deserves its own state and what should be recomputed from the current state on every render.

The list does not need its own stored copy for every interaction. The user changes two control facts: the current query and the current filter. The visible rows are the result of applying those facts to the original list. If you store the controls and derive the rows, the behavior stays predictable. If you store both the controls and a second mutable copy of the visible list, the two can drift apart.

## Core Concept and Mental Model

### The control strip and the projection

Picture this component as two layers:

- the control strip, which stores the user's choices
- the projection, which shows which items survive those choices

The control strip owns facts:

- `query`
- `selectedCategory`

The projection owns no memory. It is just the result of asking every item two questions during render:

- does this item match the search query?
- does this item match the selected category?

If both answers are yes, the item stays visible. If either answer is no, it disappears from the projection.

### Why storing the visible list separately gets brittle

A tempting version looks like this:

```ts
const [query, setQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
const [visibleItems, setVisibleItems] = useState(items);
```

That feels explicit, but now every interaction has to keep `visibleItems` synchronized manually. Typing in the search box has to rebuild the list. Changing the category has to rebuild the list. Clearing one control while the other stays active has to rebuild the list correctly again. The more ways the controls can interact, the easier it is for one update path to miss a case.

The simpler model is to store the controls once, then derive the visible list from the current snapshot:

```ts
const visibleItems = items.filter((item) => {
  return matchesQuery(item, query) && matchesCategory(item, selectedCategory);
});
```

Now the list cannot drift from the controls because it is always computed from them.

### Two predicates, one decision

The key move in this problem is to keep search and category filtering as separate predicates that combine into one decision.

- search answers, "does the item text match the current query?"
- category filtering answers, "does this item belong to the active bucket?"

That separation matters because the controls can change independently. A user can clear the query while keeping the category filter. A user can switch the category while keeping the query. If the logic is written as one tangled special-case block, those combinations get harder to reason about. If the logic is two small predicates joined with `&&`, the combinations usually fall out naturally.

## How I Think Through This

Start from the original list and ask what the user is allowed to change. In this problem, the user is not editing the items. They are only changing how the list is viewed. That is usually a sign that the source collection should stay stable and the controls should be the stateful part.

Then test the interactions one axis at a time. If the query is empty, the category filter should still work. If the category is `all`, the search query should still work. If both are active, both should narrow the result together. If one of those cases feels awkward to express, the implementation is probably mixing control state with derived state.

The target feeling is that every interaction becomes boring. Typing updates `query`. Selecting a filter updates `selectedCategory`. Rendering decides which items survive. Empty results are not a special store to manage. They are just the natural outcome when no items satisfy both predicates.

---

## Building the Solution

### Step 1: Drive the visible list from the search query

Start with one control only: the search query. The first question is whether the component should keep a second copy of the filtered list in state. It should not. The user is changing one fact, the current query, so store that fact and derive the visible items from it.

One useful check is to imagine the query becoming empty again. If clearing the input means you have to reconstruct the list manually, the component is probably storing a derived value as if it were a source of truth. A cleaner version keeps the original items untouched and recomputes the visible slice from the current query every render.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- A blank query should mean "show everything."
- Normalize the query before matching so casing and stray spaces do not create fake misses.
- The list should be derived from `items` and `query`, not stored separately.

### Step 2: Layer the category filter on top without breaking search

Now add the second control. The category filter is another user choice, so it belongs in state alongside the query. The visible list is still derived, but now it must satisfy two independent checks: text match and category match.

The easiest way to reason about this step is to test the combination cases deliberately. If the query is `"tea"` and the category is `"snacks"`, only snack items whose names contain `"tea"` should remain. If the category goes back to `"all"`, the existing query should still narrow the list. That is the shape you want: two control facts, one derived projection.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Keep the search predicate and the category predicate separate in your head, even if you combine them in one `filter` call.
- `all` is not a real category, it is the instruction to skip category narrowing.
- Empty results are a valid derived outcome, not a state repair case.

### Final Solution

When you compare the finished version to the earlier scaffold, the important check is not just whether the tests pass. Check whether the state now contains only the control facts. If the source list stays stable and the visible list is always projected from `query` and `selectedCategory`, the behavior stays easier to trust as more interactions get layered on later.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
