## The Problem

A publication plan defines the editorial categories an issue must cover. Given that plan and a list of available content packages, compute two things: the total production cost of packages that contribute at least one required category, and the percentage of required categories covered by any relevant package.

The core question is how to separate the relevance check from the accumulation -- and why the coverage tracker needs to record distinct IDs rather than match events.

## Overview

The return type is `{ totalCost: number; coverage: number }`. Neither field is an array. Neither is keyed by anything. Both are scalars summarizing the full dataset.

That shape rules out grouping (you would see a Map or Record in the output) and per-record transforms (you would see an output array). What remains is filter + aggregate: walk one dataset, use the other as a membership index, and accumulate two summary fields for the records that pass the filter.

The two accumulators are not symmetric. `totalCost` grows once per relevant package. `coverage` grows once per unique required category ID a relevant package covers. A package can cover more than one required category, but its production cost still counts only once. That asymmetry is the main thing this problem teaches.

## Core Concept and Mental Model

### The Three-Step Pattern

Every filter + aggregate problem follows the same structure.

**Index the source.** Build a Set from the dataset that defines what is required. You pay O(n) once. Every subsequent membership check costs O(1).

**Walk the target.** Iterate over the other dataset. Each record gets one pass. The filter runs first; accumulation only runs for records that pass the filter.

**Accumulate separately.** `totalCost` grows by the package's `productionCost` when the package is relevant. `coverage` grows by each required category ID the package covers -- tracked in a `Set<string>` so the same ID does not inflate the count twice.

```ts
const requiredIds = new Set(plan.requiredCategories.map(c => c.id));

let totalCost = 0;
const coveredIds = new Set<string>();

for (const pkg of packages) {
  const relevantIds = pkg.categoryIds.filter(id => requiredIds.has(id));
  if (relevantIds.length === 0) continue;

  totalCost += pkg.productionCost;
  for (const id of relevantIds) {
    coveredIds.add(id);
  }
}

const coverage = (coveredIds.size / plan.requiredCategories.length) * 100;
```

The indexing line lives before the loop. The walk and accumulation live inside it. Those two zones stay separate.

### Why the Filter Must Come First

Mixing the relevance check and accumulation into one expression makes it easy to count a package that touches zero required categories. A guard clause at the top of the loop body makes the boundary between "is this record relevant?" and "what do I do with it?" explicit. Everything below the guard only runs for relevant packages.

### Why Coverage Needs a Set

Coverage measures distinct required category IDs, not match events. If two packages both cover `cat-tech`, that category should count once. A counter would produce two; a `Set` discards the duplicate automatically. After the walk, `coveredIds.size` gives the correct distinct count.

## How I Think Through This

When I see a function signature with two scalar summary fields and two input datasets, I immediately expect filter + aggregate.

I start with the return type. `{ totalCost, coverage }` -- both fields summarize the walk. That means one loop, two accumulators, one filter gate.

I find the shared ID space. `plan.requiredCategories` owns the required IDs. Each package carries a `categoryIds` array drawn from that same ID space. The required list gets indexed as a Set; the packages get walked.

Before writing the loop, I trace what can happen per package:

- **No intersection** -- none of the package's category IDs are in the required Set. Skip. No cost, no coverage update.
- **One match** -- the package covers exactly one required category. Add its cost once, mark one ID as covered.
- **Multiple matches** -- the package covers several required categories. Add its cost once, mark each matched ID as covered. Cost is per-package, coverage is per-ID.
- **A required category no package covers** -- it stays uncovered and lowers the final percentage.

After tracing those four cases, the code shape is decided before I write a line.

---

## Building the Solution

### Step 1: Filter for relevant packages and sum their cost

Start with `totalCost` only. Build the required category index and use it to identify which packages are relevant. A package is relevant if at least one of its `categoryIds` appears in the required Set.

The goal here is to earn the filter mechanic: knowing what to index, what to walk, and how to check intersection.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- Build the Set from `plan.requiredCategories`, not from `packages`.
- The relevance check inspects a package's `categoryIds` array against that Set.
- Each relevant package contributes its `productionCost` exactly once.

### Step 2: Track which required categories get covered

Extend the return type to include `coverage`. The `totalCost` logic does not change. The new work is tracking which required category IDs were actually touched -- and computing the percentage at the end.

The key decision is the data structure for that tracking. Ask whether the same required category ID could appear in more than one package before choosing.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Switch from a boolean relevance check to a filtered array so you have the actual matched IDs.
- Track covered IDs in a `Set<string>`, not a number.
- Compute the percentage after the walk ends, not inside it.

### Final Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
