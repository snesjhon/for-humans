## Overview

Data parsing and cross-reference problems appear constantly in frontend work: transforming API responses, computing derived metrics, joining lookup tables to display data. The bugs these problems produce are usually performance bugs or correctness bugs that stem from the same mistake — iterating over one dataset and scanning the other from scratch on every iteration. This guide builds fluency in three levels: **Flat Lookup**, where you group or count items from a single array using a Map; **Cross-Reference**, where you join two arrays by ID by indexing one and walking the other; and **Filter + Aggregate**, where you first determine which items are relevant across two datasets before accumulating any metrics. Mastering the separation between indexing and iterating is the move that makes data problems tractable.

## Core Concept & Mental Model

### The CI Requirements Gate

When a pull request opens and CI starts, the runner loads the required checks from the pipeline configuration. Then it walks each job result and resolves it against that list. The runner does not re-read the full requirements list for each result that comes in. It builds the index once at the start, then each lookup costs constant time.

That is the exact shape of a well-structured data problem.

- **requirements list** = the source dataset you index into a Set or Map
- **requirements index** = the Set or Map lookup structure itself
- **job results** = the target dataset you walk
- **the gate** = the iteration loop that checks each item
- **the status report** = the accumulated result, whether that is a count, a sum, or a percentage

When you think in these terms, the three-step pattern becomes a process you can follow without guessing.

### The Three-Step Pattern: Index, Walk, Accumulate

Every data problem in this guide follows the same three moves.

**Step 1: Index the source.** Build a Set or Map from the dataset that will be consulted repeatedly. This is the requirements index. You pay O(n) once.

**Step 2: Walk the target.** Iterate over the other dataset. This is the job results list. Each item gets one pass through the gate.

**Step 3: Accumulate the result.** Inside the walk, look up the current item in your indexed structure and update whatever you are tracking. This is the status report. Each lookup costs O(1).

The whole pipeline runs in O(n + m) instead of O(n * m). But the more important gain is conceptual: once you separate the index step from the walk step, the logic for each step becomes much simpler to read and reason about.

### What the Code Shape Looks Like

The three steps map directly to code. Line one builds the index before the loop. Lines two through N are the loop body: look up, check, accumulate.

```ts
function computeRevenue(orders: Order[], products: Product[]): Map<string, number> {
  const productById = new Map(products.map(p => [p.id, p])); // index: built once
  const revenue = new Map<string, number>();
  for (const order of orders) {                              // walk: one pass
    const product = productById.get(order.productId);
    if (product) {
      revenue.set(product.name, (revenue.get(product.name) ?? 0) + order.quantity * product.price);
    }
  }
  return revenue;                                            // accumulate: updated per iteration
}
```

The indexing line lives before the loop. The walk and accumulation live inside it. Those two zones stay separate.

### Why Keeping the Steps Separate Matters

When index, walk, and accumulate collapse into one loop, there is no clear place to add a filter, no clean way to change what you are accumulating, and no obvious boundary for debugging. Keeping them separate gives each step one job. Adding a relevance filter before the accumulation becomes a single guard clause in the walk. Changing the accumulation target is isolated to one block. The gate only has to make one decision per item.

---

## Reading the Problem

The algorithm for data problems is almost always the same three moves: index, walk, accumulate. The hard part is not the algorithm. It is reading the problem carefully enough to know what to index, what to walk, and what counts as a match.

This section works through a complete example from problem statement to code shape using a warehouse inventory scenario. The goal is to show the reasoning process, not just the answer.

### The Problem Statement

Read this the way you would see it in a real codebase:

```
/**
 * Warehouse managers report their current stock levels daily.
 * Your job is to identify which products are understocked at which locations.
 *
 * @param inventory   A list of current stock records. Each record has a warehouseId,
 *                    a productId, and a currentQuantity.
 *
 * @param thresholds  A list of minimum stock requirements. Each threshold has a
 *                    warehouseId, a productId, and a minQuantity. Not every
 *                    warehouse/product combination has a threshold — those without
 *                    one can be ignored.
 *
 * @returns           An array of shortage records — { warehouseId, productId, shortage } —
 *                    for every inventory record where currentQuantity falls below minQuantity.
 *                    shortage is minQuantity minus currentQuantity.
 */
function findShortages(inventory, thresholds)
```

### The Sample Data

```js
const inventory = [
  { warehouseId: 'wh-east', productId: 'bolt-m6',     currentQuantity: 500 },
  { warehouseId: 'wh-east', productId: 'washer-10mm', currentQuantity: 20  },
  { warehouseId: 'wh-west', productId: 'bolt-m6',     currentQuantity: 150 },
  { warehouseId: 'wh-west', productId: 'nut-m6',      currentQuantity: 300 },
]

const thresholds = [
  { warehouseId: 'wh-east', productId: 'bolt-m6',     minQuantity: 400 },
  { warehouseId: 'wh-east', productId: 'washer-10mm', minQuantity: 100 },
  { warehouseId: 'wh-west', productId: 'bolt-m6',     minQuantity: 200 },
  // no threshold for wh-west / nut-m6
]
```

### Step 1: Start With the Return Value

Before looking at the inputs, read what the function is supposed to return. Here it returns an array of `{ warehouseId, productId, shortage }` objects.

That tells you immediately: this is not a grouping problem. You are not building a `Map<string, number>` of totals. You are filtering and transforming a flat list, producing one output record per qualifying input record. One dataset produces results. The other dataset exists only to inform the filter.

That distinction — one dataset drives the output, the other provides the lookup — is the first thing to settle before you touch any code.

### Step 2: Find the Join Key

Look at both datasets and identify what field connects them. In this problem, both `inventory` and `thresholds` have `warehouseId` and `productId`.

Now ask: is either field unique on its own?

- `bolt-m6` appears in both `wh-east` and `wh-west`. Not unique.
- `wh-east` holds both `bolt-m6` and `washer-10mm`. Not unique.

Neither field alone identifies a single record. The join key is composite: `warehouseId` and `productId` together. When you see a composite key, the Map key becomes a concatenated string: `warehouseId + ':' + productId`. One string per location/product pair, unique across both datasets.

| Inventory record | Composite key | Has a threshold? |
|---|---|---|
| wh-east, bolt-m6 | `'wh-east:bolt-m6'` | yes, min: 400 |
| wh-east, washer-10mm | `'wh-east:washer-10mm'` | yes, min: 100 |
| wh-west, bolt-m6 | `'wh-west:bolt-m6'` | yes, min: 200 |
| wh-west, nut-m6 | `'wh-west:nut-m6'` | no entry |

The table also tells you something important: the datasets are not the same size. `thresholds` has 3 records, `inventory` has 4. One inventory record has no threshold at all. You need to handle that case explicitly.

### Step 3: Decide Which Side to Index and Which to Walk

Index the side you look things up against. Walk the side you iterate to produce results.

You check each inventory record against the thresholds to see if a minimum stock requirement exists. Thresholds are what you consult — they become the Map. You walk inventory records one at a time and decide what to emit for each. Inventory is what you iterate.

```
thresholds  →  build Map keyed by 'warehouseId:productId'  →  look things up against this
inventory   →  for...of loop                               →  one decision per record
```

This direction also makes sense for another reason: the return value is shaped around inventory records. Each shortage object contains the `warehouseId` and `productId` from an inventory entry, with the shortage amount computed by consulting the threshold. If you walked thresholds instead, you would have to look up the inventory side to find the current quantity, which reverses the structure without gaining anything.

### Step 4: Enumerate What Can Happen at Each Step

Before writing the loop, sketch every possible outcome for a single inventory record. There are four in this problem:

**No threshold for this location/product.** `wh-west:nut-m6` has no entry in the Map. No minimum requirement exists here — skip without emitting anything.

**Threshold found, stock is sufficient.** `wh-east:bolt-m6` has 500 units against a minimum of 400. Stock is fine — skip without emitting anything.

**Threshold found, stock is insufficient.** `wh-east:washer-10mm` has 20 units against a minimum of 100. Shortage of 80 — emit a record.

**Threshold found, stock is insufficient (second case).** `wh-west:bolt-m6` has 150 against 200. Shortage of 50 — emit a record.

Notice that two different outcomes both result in "skip." One skips because the record is irrelevant (no threshold). The other skips because it passed the check (sufficient stock). These are two separate guard clauses, not one. Enumerating outcomes before writing the loop means your conditionals are planned, not discovered mid-implementation.

### Step 5: See It in the Data

The trace below steps through every inventory record against the threshold Map built from the sample data.

:::trace-graph
[
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",     "x": 12, "y": 18, "tone": "frontier"},
      {"id": "t2", "label": "e:washer min:100",   "x": 12, "y": 40, "tone": "frontier"},
      {"id": "t3", "label": "w:bolt min:200",     "x": 12, "y": 62, "tone": "frontier"},
      {"id": "tMap", "label": "thresholdMap",     "x": 45, "y": 40, "tone": "muted"},
      {"id": "i1", "label": "e:bolt cur:500",     "x": 72, "y": 18, "tone": "muted"},
      {"id": "i2", "label": "e:washer cur:20",    "x": 72, "y": 38, "tone": "muted"},
      {"id": "i3", "label": "w:bolt cur:150",     "x": 72, "y": 58, "tone": "muted"},
      {"id": "i4", "label": "w:nut cur:300",      "x": 72, "y": 78, "tone": "muted"},
      {"id": "result", "label": "shortages: []",  "x": 92, "y": 48, "tone": "muted"}
    ],
    "edges": [],
    "facts": [
      {"name": "thresholds", "value": "3 records",                         "tone": "blue"},
      {"name": "inventory",  "value": "4 records — datasets are not the same size", "tone": "blue"},
      {"name": "join key",   "value": "warehouseId + ':' + productId",     "tone": "orange"}
    ],
    "action": "visit",
    "label": "Two datasets, different sizes. The join key is composite — warehouseId and productId together identify a unique location/product pair. Neither field alone is sufficient."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",     "x": 12, "y": 18, "tone": "visited"},
      {"id": "t2", "label": "e:washer min:100",   "x": 12, "y": 40, "tone": "visited"},
      {"id": "t3", "label": "w:bolt min:200",     "x": 12, "y": 62, "tone": "visited"},
      {"id": "tMap", "label": "thresholdMap",     "x": 45, "y": 40, "tone": "current", "badge": "built"},
      {"id": "i1", "label": "e:bolt cur:500",     "x": 72, "y": 18, "tone": "frontier"},
      {"id": "i2", "label": "e:washer cur:20",    "x": 72, "y": 38, "tone": "frontier"},
      {"id": "i3", "label": "w:bolt cur:150",     "x": 72, "y": 58, "tone": "frontier"},
      {"id": "i4", "label": "w:nut cur:300",      "x": 72, "y": 78, "tone": "frontier"},
      {"id": "result", "label": "shortages: []",  "x": 92, "y": 48, "tone": "muted"}
    ],
    "edges": [
      {"from": "t1", "to": "tMap", "tone": "traversed"},
      {"from": "t2", "to": "tMap", "tone": "traversed"},
      {"from": "t3", "to": "tMap", "tone": "traversed"}
    ],
    "facts": [
      {"name": "step",        "value": "index thresholds into a Map",             "tone": "blue"},
      {"name": "key format",  "value": "warehouseId + ':' + productId",           "tone": "blue"},
      {"name": "entries",     "value": "3 composite keys mapped to minQuantity",  "tone": "blue"},
      {"name": "w:nut",       "value": "no entry — no threshold for this product","tone": "orange"}
    ],
    "action": "expand",
    "label": "Index thresholds into a Map. The composite string is the key, minQuantity is the value. wh-west:nut-m6 has no entry and will never appear here."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",     "x": 12, "y": 18, "tone": "current"},
      {"id": "t2", "label": "e:washer min:100",   "x": 12, "y": 40, "tone": "visited"},
      {"id": "t3", "label": "w:bolt min:200",     "x": 12, "y": 62, "tone": "visited"},
      {"id": "tMap", "label": "thresholdMap",     "x": 45, "y": 40, "tone": "active"},
      {"id": "i1", "label": "e:bolt cur:500",     "x": 72, "y": 18, "tone": "current", "badge": "no shortage"},
      {"id": "i2", "label": "e:washer cur:20",    "x": 72, "y": 38, "tone": "frontier"},
      {"id": "i3", "label": "w:bolt cur:150",     "x": 72, "y": 58, "tone": "frontier"},
      {"id": "i4", "label": "w:nut cur:300",      "x": 72, "y": 78, "tone": "frontier"},
      {"id": "result", "label": "shortages: []",  "x": 92, "y": 48, "tone": "muted"}
    ],
    "edges": [
      {"from": "i1", "to": "tMap", "tone": "active", "label": "min: 400 found"}
    ],
    "facts": [
      {"name": "record",      "value": "wh-east:bolt-m6 · current: 500", "tone": "blue"},
      {"name": "threshold",   "value": "min: 400",                       "tone": "blue"},
      {"name": "500 >= 400?", "value": "yes — no shortage",              "tone": "blue"},
      {"name": "shortages",   "value": "[] (unchanged)",                 "tone": "orange"}
    ],
    "action": "visit",
    "label": "wh-east:bolt-m6 has a threshold. Current stock (500) meets the minimum (400). No shortage — skip this record without writing to the result."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",       "x": 12, "y": 18, "tone": "done"},
      {"id": "t2", "label": "e:washer min:100",     "x": 12, "y": 40, "tone": "current"},
      {"id": "t3", "label": "w:bolt min:200",       "x": 12, "y": 62, "tone": "visited"},
      {"id": "tMap", "label": "thresholdMap",       "x": 45, "y": 40, "tone": "active"},
      {"id": "i1", "label": "e:bolt cur:500",       "x": 72, "y": 18, "tone": "done"},
      {"id": "i2", "label": "e:washer cur:20",      "x": 72, "y": 38, "tone": "current", "badge": "shortage"},
      {"id": "i3", "label": "w:bolt cur:150",       "x": 72, "y": 58, "tone": "frontier"},
      {"id": "i4", "label": "w:nut cur:300",        "x": 72, "y": 78, "tone": "frontier"},
      {"id": "result", "label": "shortages: [1]",   "x": 92, "y": 48, "tone": "current"}
    ],
    "edges": [
      {"from": "i2", "to": "tMap",   "tone": "active", "label": "min: 100 found"},
      {"from": "i2", "to": "result", "tone": "active", "label": "shortage: 80"}
    ],
    "facts": [
      {"name": "record",     "value": "wh-east:washer-10mm · current: 20", "tone": "blue"},
      {"name": "threshold",  "value": "min: 100",                          "tone": "blue"},
      {"name": "20 >= 100?", "value": "no — shortage of 80",              "tone": "orange"},
      {"name": "shortages",  "value": "1 record added",                   "tone": "orange"}
    ],
    "action": "visit",
    "label": "wh-east:washer-10mm falls below its minimum. shortage = 100 - 20 = 80. Emit a shortage record and continue."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",       "x": 12, "y": 18, "tone": "done"},
      {"id": "t2", "label": "e:washer min:100",     "x": 12, "y": 40, "tone": "done"},
      {"id": "t3", "label": "w:bolt min:200",       "x": 12, "y": 62, "tone": "current"},
      {"id": "tMap", "label": "thresholdMap",       "x": 45, "y": 40, "tone": "active"},
      {"id": "i1", "label": "e:bolt cur:500",       "x": 72, "y": 18, "tone": "done"},
      {"id": "i2", "label": "e:washer cur:20",      "x": 72, "y": 38, "tone": "done"},
      {"id": "i3", "label": "w:bolt cur:150",       "x": 72, "y": 58, "tone": "current", "badge": "shortage"},
      {"id": "i4", "label": "w:nut cur:300",        "x": 72, "y": 78, "tone": "frontier"},
      {"id": "result", "label": "shortages: [2]",   "x": 92, "y": 48, "tone": "current"}
    ],
    "edges": [
      {"from": "i3", "to": "tMap",   "tone": "active", "label": "min: 200 found"},
      {"from": "i3", "to": "result", "tone": "active", "label": "shortage: 50"}
    ],
    "facts": [
      {"name": "record",      "value": "wh-west:bolt-m6 · current: 150", "tone": "blue"},
      {"name": "threshold",   "value": "min: 200",                       "tone": "blue"},
      {"name": "150 >= 200?", "value": "no — shortage of 50",            "tone": "orange"},
      {"name": "shortages",   "value": "2 records total",                "tone": "orange"}
    ],
    "action": "visit",
    "label": "wh-west:bolt-m6 also falls short. shortage = 200 - 150 = 50. Emit a second record."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",       "x": 12, "y": 18, "tone": "done"},
      {"id": "t2", "label": "e:washer min:100",     "x": 12, "y": 40, "tone": "done"},
      {"id": "t3", "label": "w:bolt min:200",       "x": 12, "y": 62, "tone": "done"},
      {"id": "tMap", "label": "thresholdMap",       "x": 45, "y": 40, "tone": "active"},
      {"id": "i1", "label": "e:bolt cur:500",       "x": 72, "y": 18, "tone": "done"},
      {"id": "i2", "label": "e:washer cur:20",      "x": 72, "y": 38, "tone": "done"},
      {"id": "i3", "label": "w:bolt cur:150",       "x": 72, "y": 58, "tone": "done"},
      {"id": "i4", "label": "w:nut cur:300",        "x": 72, "y": 78, "tone": "current", "badge": "no threshold"},
      {"id": "result", "label": "shortages: [2]",   "x": 92, "y": 48, "tone": "muted"}
    ],
    "edges": [
      {"from": "i4", "to": "tMap", "tone": "queued", "label": "no entry found"}
    ],
    "facts": [
      {"name": "record",    "value": "wh-west:nut-m6 · current: 300",  "tone": "blue"},
      {"name": "threshold", "value": "no entry in Map",                 "tone": "orange"},
      {"name": "action",    "value": "skip — no minimum requirement",   "tone": "orange"},
      {"name": "shortages", "value": "2 records (unchanged)",           "tone": "blue"}
    ],
    "action": "visit",
    "label": "wh-west:nut-m6 has no threshold entry. No minimum stock requirement exists for this product at this location. Skip without emitting anything."
  },
  {
    "nodes": [
      {"id": "t1", "label": "e:bolt min:400",       "x": 12, "y": 18, "tone": "done"},
      {"id": "t2", "label": "e:washer min:100",     "x": 12, "y": 40, "tone": "done"},
      {"id": "t3", "label": "w:bolt min:200",       "x": 12, "y": 62, "tone": "done"},
      {"id": "tMap", "label": "thresholdMap",       "x": 45, "y": 40, "tone": "done"},
      {"id": "i1", "label": "e:bolt cur:500",       "x": 72, "y": 18, "tone": "done"},
      {"id": "i2", "label": "e:washer cur:20",      "x": 72, "y": 38, "tone": "done"},
      {"id": "i3", "label": "w:bolt cur:150",       "x": 72, "y": 58, "tone": "done"},
      {"id": "i4", "label": "w:nut cur:300",        "x": 72, "y": 78, "tone": "muted"},
      {"id": "result", "label": "shortages: [2]",   "x": 92, "y": 48, "tone": "done"}
    ],
    "edges": [],
    "facts": [
      {"name": "shortages",         "value": "2 records",                                  "tone": "orange"},
      {"name": "wh-east:washer",    "value": "shortage: 80",                               "tone": "orange"},
      {"name": "wh-west:bolt",      "value": "shortage: 50",                               "tone": "orange"},
      {"name": "skipped (2)",       "value": "sufficient stock · no threshold",             "tone": "blue"}
    ],
    "action": "done",
    "label": "Walk complete. Two shortages found. Two records were skipped — one for sufficient stock, one for no threshold. Both skips happened before any write to the result array."
  }
]
:::

### From Trace to Code

The trace maps directly to code shape. Three things you decided before writing the loop:

**Thresholds go in a Map.** The key is the composite string `warehouseId + ':' + productId`. The value is `minQuantity`. Built once, O(m).

**Inventory gets walked.** One iteration per record, each resolved in O(1).

**Two skip conditions, in order.** Guard 1: no threshold entry — skip immediately. Guard 2: current quantity is sufficient — skip without emitting. Only records that clear both guards reach the emit step.

The loop has two guard clauses at the top and one push at the bottom. That structure was visible in the trace before a single line of code was written. When you can enumerate what happens at each step before you start, the implementation becomes a transcription, not a discovery.

## Building Blocks: Progressive Learning

### Level 1: Flat Lookup

When a problem gives you a single array and asks you to group or count by a field, start by reading the return value. It is a `Map` from some key field to an accumulated value. That shape tells you everything about how the loop works: each record contributes to exactly one key, and you update that key's running value on every iteration.

The loop body has three lines: get the current value for this key, compute the new value, write it back. That is the entire pattern.

The one thing to internalize before writing: `Map.get()` returns `undefined` for keys it has never seen. Guard that first encounter with a nullish coalescing default that matches what you are accumulating. `?? 0` for a count, `?? []` when you are collecting an array of records.

```ts
function countByDepartment(employees: Employee[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const employee of employees) {
    counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1);
  }
  return counts;
}
```

The exercises at this level each give you a problem statement and a dataset. Read the return type, decide what to accumulate per key, and write the loop. The `?? defaultValue` is the only new mechanic.

#### **Exercise 1**

Given a flat list of employees, return a count of how many belong to each department. The return type tells you the key (department name) and the accumulated value (a number). From there, the loop writes itself.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

Given a flat list of products, return each category mapped to the full list of products in it. The return type changes: the accumulated value is now an array of records instead of a number. The initialization and update change accordingly, but the loop structure stays identical.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

Given a flat list of products, return each category mapped to the single highest-priced product in it. The update is now conditional: you only replace the stored record when the current one beats it. Read the return type first — `Map<string, Product>` — and let that shape the guard condition.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "Read the return type first. The key tells you what to group by. The value tells you what to accumulate."

**Bridge to Level 2**: A single-array problem has one source of truth and one pass. When you add a second dataset joined by a shared ID, you need to decide which one drives the output and which one provides the lookup — before the loop starts.

### Level 2: Cross-Reference

When a problem gives you two arrays that share an ID field and asks you to produce output combining data from both, your first question is: which dataset drives the output, and which provides the lookup?

The one that drives the output gets walked. The one you look things up against gets indexed into a Map before the loop starts.

```ts
const productById = new Map(products.map(p => [p.id, p]));
```

That one line is the entire indexing phase. Everything inside the loop is the walk phase. The two phases stay separate — the indexing phase owns the source, the walk phase owns the accumulation. When something is wrong, you know which half to look at.

Inside the walk, each record from the iterated dataset has one field that references an ID in the indexed source. A single `get()` call retrieves the full source record, and from there you accumulate exactly like Level 1.

```ts
function computeRevenue(orders: Order[], products: Product[]): Map<string, number> {
  const productById = new Map(products.map(p => [p.id, p]));
  const revenue = new Map<string, number>();
  for (const order of orders) {
    const product = productById.get(order.productId);
    if (product) {
      revenue.set(product.name, (revenue.get(product.name) ?? 0) + order.quantity * product.price);
    }
  }
  return revenue;
}
```

The exercises at this level each give you two datasets and a return type. Decide which side to index and which to walk. The indexing line comes before the loop. The rest is accumulation.

#### **Exercise 1**

Given a list of orders and a product catalog, return the total revenue per product name. The return type tells you the key (product name, not product ID — you need the catalog to resolve it) and the accumulated value (a number). Which dataset do you index? Which do you walk?

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

Given a list of audit log entries and a user roster, return each log entry enriched with the user's display name. The return type is an array of transformed objects, not a Map — this is a flat transform, not a grouping. You still index one dataset and walk the other, but the accumulation writes to an output array instead of updating a running value.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

Given a list of posts and a tag catalog, return each post mapped to the display names of its tags. Each post holds an array of tag IDs, so the inner loop iterates a sub-array. The return type specifies no duplicate tag names per post — use a `Set<string>` during the walk and convert at the end. The indexing decision is the same as before; the sub-array and deduplication are the new pieces.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Decide which side to index and which to walk before writing the loop. The indexing line lives outside the loop. The walk and accumulation live inside it."

**Bridge to Level 3**: At Level 2, relevance is binary: a lookup either finds a match or does not. Level 3 problems introduce a harder filter — an item is only relevant if its internal list overlaps with the source set. That overlap check has to happen before any accumulation, not interleaved with it.

### Level 3: Filter + Aggregate

Level 3 problems have an item in the walked dataset that carries its own internal list of IDs, and you need to check whether any of those IDs appear in the indexed source before you accumulate anything. The filter and the accumulation are two separate steps, and the order matters: filter first, then accumulate only if the filter passes.

The structure looks like this every time. Build a Set from the source. Walk the target. For each item, compute the intersection of its internal ID list against the Set. If the intersection is empty, skip. If it is not, accumulate.

```ts
const frameworkReqIds = new Set(framework.requirements.map(r => r.id));

let totalCost = 0;
const coveredReqIds = new Set<string>();

for (const control of implementedControls) {
  const relevantReqs = control.requirements.filter(reqId => frameworkReqIds.has(reqId));
  if (relevantReqs.length === 0) continue;

  totalCost += control.cost;
  for (const reqId of relevantReqs) {
    coveredReqIds.add(reqId);
  }
}

const coverage = (coveredReqIds.size / framework.requirements.length) * 100;
```

Two things to notice. First, the guard clause — `if (relevantReqs.length === 0) continue` — sits at the top of the loop body. Everything that follows it only runs for relevant items. Second, `coveredReqIds` is a `Set`, not a counter, because the same requirement ID can appear across multiple controls. The Set deduplicates automatically; you get the correct distinct count from `coveredReqIds.size` after the walk.

The exercises at this level each give you a problem statement with an intersection-based relevance condition. Before writing the loop, identify: what is the Set built from? What is the intersection filter? What are the accumulators?

#### **Exercise 1**

Given a compliance framework and a list of implemented controls, return the total cost of relevant controls and the percentage of framework requirements they cover. A control is relevant only if at least one of its requirement IDs belongs to this framework. Work through the sample data by hand first: mark each control as relevant or not, sum the relevant costs, list the distinct covered IDs. The code should match that manual pass exactly.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Given a list of feature flags and a list of required checks, return the total weight of flags that satisfy at least one required check, and what percentage of required checks are covered. The problem shape is the same as Exercise 1 — Set of required IDs, walk flags, filter by intersection, accumulate weight and coverage. The domain is different, which is the point: once you can identify the intersection-first structure, domain details stop mattering.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Given multiple frameworks and a shared pool of controls, return the cost and coverage for each framework independently. The per-framework logic is the same as Exercise 1, but it now runs inside an outer loop. Each iteration of the outer loop builds its own Set, runs its own walk, and writes its own accumulators. A control relevant to one framework must not affect another's totals. The structural question is: what state resets per framework, and what persists across the outer loop?

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Filter first, then accumulate. The guard clause at the top of the loop is a correctness boundary — nothing below it runs for an irrelevant item."

## Key Patterns

### Pattern 1: Set for Membership Testing

**When to use:** use a Set when the only question is "is this ID present in the other dataset?" You do not need to retrieve any data from the source — only confirm presence.

**What it costs:** O(n) to build, O(1) per lookup. A Set stores no associated values, so it only applies when presence is the entire answer. If you need to retrieve a field from the matched record, you need a Map instead.

**How to think about it:** the source dataset in this case contributes nothing to the output except a yes/no answer. Build the Set from it before the loop, then call `.has()` per iteration. Nothing else is needed.

**Complexity:** O(n) to build, O(1) per lookup, O(1) space overhead per entry.

```ts
const implementedIds = new Set(implementedControls.map(c => c.id));

for (const req of framework.requirements) {
  if (implementedIds.has(req.id)) {
    coveredCount++;
  }
}
```

### Pattern 2: Map for Keyed Aggregation

**When to use:** use a Map when you need to accumulate a value per key across the walk. Revenue per product, count per department, total hours per user — all keyed aggregations follow this shape.

**What it costs:** O(n) to build the index, O(1) per read or write inside the loop. The cost you accept is the upfront build pass. The benefit is that every subsequent operation in the walk is constant time.

**How to think about it:** the output Map and the lookup Map are two separate structures with two separate jobs. Build the lookup Map before the loop. Build the output Map during the loop. Keep them distinct or the purpose of each becomes unclear.

**Complexity:** O(n) to build the index, O(m) to walk the target, O(n + m) total. Accumulation at each step is O(1).

```ts
// Index products by ID (build manifest)
const productById = new Map(products.map(p => [p.id, p]));

// Accumulate revenue per product name (build tally)
const revenue = new Map<string, number>();
for (const order of orders) {
  const product = productById.get(order.productId);
  if (product) {
    revenue.set(product.name, (revenue.get(product.name) ?? 0) + order.quantity * product.price);
  }
}
```

### Pattern 3: Intersection-First Filtering

**When to use:** use this pattern when an item in the target dataset is only relevant if some part of it matches the source dataset, and you need to validate relevance before accumulating. This is the filter step that must come before the accumulate step, not mixed into it.

**What it costs:** building the intersection set costs O(n). The relevance check per item costs O(1). Accumulation per relevant item costs O(1). The discipline cost is keeping the filter condition separate from the accumulation logic, which requires slightly more deliberate structuring.

**What it prevents:** when filter and accumulate collapse into one expression, it becomes easy to count the wrong items, accumulate against the wrong key, or miss the case where an item is partially relevant. Separating the steps means each one has one job and one place to be wrong.

**How to think about it:** not every item in the target needs to reach the accumulation step. The gate first checks whether the item's internal list intersects with the requirements index. If there is no intersection, the gate skips it without tallying anything. Only items with a relevant intersection reach the accumulation step.

**Complexity:** O(n) to build the source index, O(m * k) to check intersection where k is the number of sub-items per target item, O(1) per accumulation. For most real data, k is small and bounded.

```ts
// Build the Set of framework requirement IDs (the manifest)
const frameworkReqIds = new Set(framework.requirements.map(r => r.id));

let totalCost = 0;
const coveredReqIds = new Set<string>();

for (const control of implementedControls) {
  // Intersection-first: is any requirement in this control covered by the framework?
  const relevantReqs = control.requirements.filter(reqId => frameworkReqIds.has(reqId));
  if (relevantReqs.length === 0) continue; // not relevant, skip before accumulating

  totalCost += control.cost;
  for (const reqId of relevantReqs) {
    coveredReqIds.add(reqId);
  }
}

const coverage = (coveredReqIds.size / framework.requirements.length) * 100;
```

---

## Decision Framework

```mermaid
flowchart TD
  A[Data problem] --> B{How many datasets?}
  B -->|One| C[Build a Map and walk it once]
  B -->|Two| D{What do you need from the second dataset?}
  D -->|Just presence| E[Index as Set, walk target, check membership]
  D -->|Associated data| F{Do items need a relevance check first?}
  F -->|No| G[Index one as Map, walk the other, accumulate]
  F -->|Yes| H[Build Set of valid IDs, walk target, filter by intersection, then accumulate]
```

| Situation | Structure to build | What lives before the loop | What lives inside the loop |
|---|---|---|---|
| Group or count items from one array | Output Map keyed by group field | Nothing — the output Map starts empty | Read, update, write back per record |
| Two arrays joined by a shared ID | Lookup Map from source array | `new Map(source.map(item => [item.id, item]))` | `lookupMap.get(foreignId)` then accumulate |
| Two arrays where one side has a relevance filter | Set from source IDs | `new Set(source.map(item => item.id))` | Intersection check, guard clause, then accumulate |
| Check presence only, no data retrieval needed | Set from source IDs | `new Set(source.map(item => item.id))` | `set.has(id)` — no record needed |

### When NOT to use

Do not reach for a Map or Set just because the data happens to have IDs. If you only need one item from one array (a simple find), a linear scan is fine and the upfront indexing pass is wasted work. Do not pre-build a Map inside a loop, that recreates the structure on every iteration and erases the performance benefit. Do not store render-visible values in a local Map and then derive state from it without going through React state, because that hides the source of truth from the component.

## Common Gotchas & Edge Cases

**Gotcha 1: Building the index Map inside the loop instead of before it**

Why it happens: in multi-pass or multi-framework problems it is easy to construct the lookup structure inside the outer loop body, treating it as setup for each iteration. Each rebuild throws away the previous structure and recreates it from scratch.

Fix: anything derived from a dataset that does not change per iteration belongs before the loop. Ask yourself: does this structure need to be rebuilt every time through, or does it only need to be built once? If once, move it above the loop.

**Gotcha 2: Forgetting `?? 0` or `?? []` when initializing a Map entry for the first time**

Why it is tempting: the code `map.set(key, map.get(key) + 1)` looks correct until the first time `key` has never been set. `map.get(key)` returns `undefined`, and `undefined + 1` evaluates to `NaN` in JavaScript without a TypeScript error in loose configurations.

Fix: always guard the first read with a nullish coalescing default that matches what you are accumulating: `(map.get(key) ?? 0) + 1` for counts, `(map.get(key) ?? [])` for arrays. TypeScript in strict mode will usually surface the type mismatch, but the explicit default also documents the intended initial state clearly.

**Gotcha 3: Accumulating before checking intersection relevance**

Why it is tempting: it feels efficient to combine the intersection check and the accumulation into one step, a single loop body with a conditional deep inside. The code appears shorter and the result is sometimes correct for basic cases.

Fix: place the relevance check as a guard clause at the top of the loop body and `continue` immediately if the item is not relevant. All accumulation statements must appear after the guard. This structure makes it visually obvious that an irrelevant item never touches the accumulators, which is both easier to audit and easier to extend when requirements change.

**Gotcha 4: Using a counter instead of a Set to track unique coverage**

Why it is tempting: if you think of coverage as "how many requirements did I satisfy," it is natural to write `coveredCount++` inside the inner loop each time a matching requirement is found. This overcounts when a single requirement is covered by two different controls.

Fix: accumulate covered requirement IDs into a `Set<string>`, not a number. The Set discards duplicates automatically. After the walk, `coveredSet.size` gives the correct count of distinct covered IDs. The percentage is then `(coveredSet.size / total) * 100`.

**Gotcha 5: Building the index Map inside the outer loop instead of before it**

Why it is tempting: in multi-framework or multi-pass problems, it is easy to move the source index construction into the outer loop body alongside the per-framework Set. Each inner rebuild costs O(m) and partially erases the savings from the Map lookup strategy.

Fix: separate what belongs to the outer loop from what belongs to the inner loop. Any structure derived from the full controls or users array that does not change per-framework iteration should be built once before the outer loop begins. Only per-iteration Sets and accumulators belong inside the outer loop body.
