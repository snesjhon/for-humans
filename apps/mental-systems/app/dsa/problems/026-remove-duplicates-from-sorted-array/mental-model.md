# Remove Duplicates from Sorted Array - Mental Model

## The Problem

Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in-place** such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.

**Example 1:**
```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
```

**Example 2:**
```
Input: nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
```

---

## The Librarian's Two Hands Analogy

Imagine a librarian standing before a long sorted bookshelf where some titles appear more than once — perhaps three copies of *Dune*, two copies of *1984*, and a single copy of *Brave New World*. Her job: rearrange the shelf so that every unique title appears exactly once at the front, and report how many unique titles she found.

She uses two hands to accomplish this without touching any other shelf. Her **reading hand** slides along the shelf from left to right, examining each book in turn. Her **writing hand** advances more slowly — it only moves when the reading hand discovers a title that's genuinely different from the last title already placed in the curated section. When that happens, the writing hand places the new book in the next open slot and steps forward.

The books between the start and the writing hand form the **curated section** — a clean, duplicate-free catalog that grows one title at a time. The books behind the writing hand are the already-processed originals, still in their slots but no longer relevant to the count.

This is exactly the two-pointer technique for removing duplicates in-place. The reading hand is your fast pointer, the writing hand is your slow write-cursor, and the curated section at the front is the final answer.

---

## Understanding the Analogy

### The Setup

The shelf is already sorted — that's the crucial precondition. Because the books are in alphabetical order, all copies of any title sit together in one clump. You never need to search the whole shelf for duplicates; if the book in your reading hand matches the last title your writing hand placed, it's a duplicate. If it doesn't match, it's a new title.

The librarian doesn't need a separate notepad or a second shelf. She works entirely in-place, overwriting slots as she goes.

### The Two Hands

The **writing hand** (`k`) marks the boundary of the curated section. Everything to its left has already been deduplicated and is "final." It starts at position 1 — the very first book is always kept, because there's nothing before it to duplicate.

The **reading hand** (`i`) starts at position 1 as well and advances one book at a time, every single iteration. It has one job: inspect the current book and decide whether it's a new title.

The decision rule is simple: compare the book in the reading hand against the last book the writing hand placed — that's `nums[k-1]`. If they're the same title, the reading hand moves on and the writing hand stays put. If they differ, the writing hand copies the book into its current slot, then steps forward.

### Why This Approach

A naive approach would be to build an entirely new shelf — scan the original, copy unique titles into a fresh list, and return that. It works, but it costs extra space proportional to the number of unique titles.

The librarian's two-hands technique costs no extra shelf space at all. Because the shelf is sorted, duplicates are always adjacent, so the comparison is always just "does this book match the one I just placed?" — a single check, never a full scan. The curated section grows exactly as fast as new unique titles are discovered, and the writing hand never overtakes the reading hand (it can only move when the reading hand has already advanced).

---

## How I Think Through This

I start by recognizing the problem is asking me to partition the array in-place: unique elements go to the front, and I need to report how many there are. I use two variables: `k` (the writing hand, my write-cursor) and `i` (the reading hand, my scanner). Both start at `1` because the element at index 0 is always the first unique title — nothing comes before it to duplicate. The one invariant I maintain is: everything from index `0` up to but not including `k` is already deduplicated and in its final position. When the reading hand finds `nums[i] !== nums[k-1]`, I copy `nums[i]` into `nums[k]` and increment `k`. At the end, `k` holds exactly the count of unique titles.

Take `[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`.

:::trace-lr
[
  {"chars":[0,0,1,1,1,2,2,3,3,4],"L":1,"R":1,"action":null,"label":"k=1 (writing hand), i=1 (reading hand). nums[i]=0 matches nums[k-1]=0 — skip."},
  {"chars":[0,1,1,1,1,2,2,3,3,4],"L":1,"R":2,"action":"match","label":"i=2: nums[i]=1 ≠ nums[k-1]=0 → write 1 to nums[1], k=2."},
  {"chars":[0,1,1,1,1,2,2,3,3,4],"L":2,"R":3,"action":null,"label":"i=3: nums[i]=1 matches nums[k-1]=1 — skip."},
  {"chars":[0,1,2,1,1,2,2,3,3,4],"L":2,"R":5,"action":"match","label":"i=5: nums[i]=2 ≠ nums[k-1]=1 → write 2 to nums[2], k=3."},
  {"chars":[0,1,2,3,1,2,2,3,3,4],"L":3,"R":7,"action":"match","label":"i=7: nums[i]=3 ≠ nums[k-1]=2 → write 3 to nums[3], k=4."},
  {"chars":[0,1,2,3,4,2,2,3,3,4],"L":4,"R":9,"action":"match","label":"i=9: nums[i]=4 ≠ nums[k-1]=3 → write 4 to nums[4], k=5."},
  {"chars":[0,1,2,3,4,2,2,3,3,4],"L":4,"R":9,"action":"done","label":"Loop ends. Return k=5. Front: [0,1,2,3,4,...] ✓"}
]
:::

---

## Building the Algorithm

Each step introduces one concept from the Librarian's Two Hands, then a StackBlitz embed to try it.

### Step 1: Initialize the Writing Hand

Before scanning anything, we set up the writing hand. The first book on the shelf is always unique — there's nothing before it to duplicate. So the writing hand starts at position `1`, meaning "the curated section already contains one book, and the next open slot is at index 1."

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

### Step 2: Scan and Catalogue New Titles

Now the reading hand sweeps through every book from index `1` to the end. At each position, it checks one question: is this book's title different from the last title the writing hand placed (`nums[k-1]`)?

- **Same title**: duplicate — skip. Reading hand moves on; writing hand stays.
- **Different title**: new entry — copy to `nums[k]`, advance writing hand, then return the final count.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

---

## Tracing through an Example

Input: `[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]`

| Step | Reading Hand (i) | nums[i] | Writing Hand (k) | Last Placed (nums[k-1]) | New Title? | Action | Curated Section |
|------|-----------------|---------|-----------------|------------------------|------------|--------|-----------------|
| Start | 1 | 0 | 1 | 0 | — | initialize | [0, ...] |
| i=1 | 1 | 0 | 1 | 0 | No | skip | [0, ...] |
| i=2 | 2 | 1 | 1 | 0 | Yes | write 1 → nums[1], k=2 | [0, 1, ...] |
| i=3 | 3 | 1 | 2 | 1 | No | skip | [0, 1, ...] |
| i=4 | 4 | 1 | 2 | 1 | No | skip | [0, 1, ...] |
| i=5 | 5 | 2 | 2 | 1 | Yes | write 2 → nums[2], k=3 | [0, 1, 2, ...] |
| i=6 | 6 | 2 | 3 | 2 | No | skip | [0, 1, 2, ...] |
| i=7 | 7 | 3 | 3 | 2 | Yes | write 3 → nums[3], k=4 | [0, 1, 2, 3, ...] |
| i=8 | 8 | 3 | 4 | 3 | No | skip | [0, 1, 2, 3, ...] |
| i=9 | 9 | 4 | 4 | 3 | Yes | write 4 → nums[4], k=5 | [0, 1, 2, 3, 4] |
| Done | — | — | 5 | — | — | return 5 | [0, 1, 2, 3, 4] |

---

## Common Misconceptions

**"I need to actually delete the duplicate elements"** — The librarian never physically removes books from the shelf; she just overwrites slots. The problem only asks you to return `k` and ensure the first `k` elements are unique. What happens to the elements beyond index `k` doesn't matter. You're not shrinking the array — you're partitioning it.

**"The writing hand compares against the reading hand's current book"** — The writing hand doesn't look at what the reading hand is holding; it looks at the last book it *placed* (`nums[k-1]`). The reading hand could be several positions ahead. Comparing `nums[i]` to `nums[i-1]` instead of `nums[k-1]` would work only for this specific problem (since input is sorted), but misses the invariant: "everything before k is final." Understanding `nums[k-1]` as "the last catalogued title" is the correct mental model.

**"Both hands need to start at 0"** — The writing hand starts at `1`, not `0`. The first book is already in the curated section by definition — it has no predecessor to duplicate. Starting k at `0` would cause the writing hand to overwrite `nums[0]` with `nums[1]` on the first new title found, discarding the very first element.

**"This only works because the array is sorted"** — Exactly right, and it's worth understanding *why*. Because the shelf is sorted, all copies of a title are adjacent. The only comparison needed is against the immediately last-placed book. If the shelf were unsorted, the reading hand might encounter a title that appeared earlier but not most recently — a simple `nums[i] !== nums[k-1]` check would miss that duplicate entirely.

**"The writing hand can catch up to or pass the reading hand"** — It never can. The reading hand advances every single iteration. The writing hand only advances when it finds a new title, which requires the reading hand to have already moved past the last written position. So `i >= k` always holds, and `nums[k] = nums[i]` is always a safe overwrite — you're never stomping on a value you still need to read.

---

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
