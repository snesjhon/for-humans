# Remove Element - Mental Model

## The Problem

Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.

Consider the number of elements in `nums` which are not equal to `val` be `k`. To get accepted, you need to do the following things: change the array `nums` such that the first `k` elements of `nums` contain the elements which are not equal to `val`. The remaining elements of `nums` are not important as well as the size of `nums`. Return `k`.

**Example 1:**

```
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
```

**Example 2:**

```
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,3,0,4,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 1, 3, 0, and 4.
```

## The Factory Quality Control Analogy

Imagine a factory assembly line where products come down a conveyor belt one by one. Your job is to staff a quality control station: a scanner inspects each product and a packer places approved products into a shipping container. The factory manager has handed you a sheet listing one defective product code — any product bearing that code gets pulled from the line. Everything else gets packed.

The scanner works left to right, never skipping anything. The packer only moves when a good product arrives. If the scanner finds a defective item, it just waves it aside — the packer doesn't move, and the next slot in the shipping container stays open for the next approved product. By the end of the belt, the packer's position tells you exactly how many products made it through.

What makes this approach elegant is that the packing happens inside the same container the products came from. The first few slots hold the approved products. The remaining slots? The factory manager doesn't care about them — the container will be sealed after slot `k`.

The key rule that makes everything work: **the packer only advances when the scanner approves something**. Scanner and packer stay in sync only on good products; defective ones cause the scanner to surge ahead while the packer waits.

## Understanding the Analogy

### The Setup

We have a conveyor belt of products (the `nums` array) and a defect code (`val`). Our goal is to consolidate all the good products at the front of the belt, in whatever order they naturally arrive. The factory manager will only look at the first `k` slots, so anything beyond position `k` is irrelevant — we don't need to clean it up.

We station two workers at the quality control desk: a scanner who checks every product, and a packer who places approved products into numbered slots starting at slot 0. The packer's current slot number is `k` — at the end, that number tells us how many products shipped.

### The Two-Hand Rule

The scanner (`i`) and the packer (`k`) both start at position 0. They move together through one decision:

- Product matches the defect code → scanner moves to the next product, packer stays put
- Product is good → packer places it in the current slot, then both advance

This means the packer can never get ahead of the scanner. In the worst case (all good products) they move in lockstep. In the best case (all defective products), the scanner races to the end while the packer never moves.

There's no scaffolding needed here — no dummy slot, no sentinel value. The packer position starts at 0 and the belt is processed left to right.

### Why This Approach

Sorting and then truncating would work but costs O(n log n). Going through twice — once to count, once to rearrange — wastes a full pass. This approach reads each product exactly once and writes each good product exactly once: O(n) time, O(1) space.

The trick is that we're allowed to use the source array as our own destination. We're packing into the belt itself, overwriting slots we've already scanned. Because the packer never outruns the scanner, we never overwrite a product before it's been inspected.

## How I Think Through This

I initialize two positions: `i` (scanner) starts at the beginning, `k` (packer) starts at slot 0. I walk `i` from left to right through every product.

For each product the scanner picks up: if it matches `val`, I wave it aside — `i` advances, `k` stays. If it doesn't match `val`, the packer places it at slot `k` and both `i` and `k` advance. At the end of the belt, `k` holds the number of approved products, and `nums[0..k-1]` holds the packed items.

Take `nums = [3, 2, 2, 3], val = 3`.

:::trace
[
{"array": [3,2,2,3], "reader": 0, "writer": 0, "action": null, "label": "Start: scanner at 0, packer at slot 0"},
{"array": [3,2,2,3], "reader": 0, "writer": 0, "action": "skip", "label": "Product 3 matches defect code — wave it aside, packer stays"},
{"array": [3,2,2,3], "reader": 1, "writer": 0, "action": "keep", "label": "Product 2 is good — packer places it in slot 0"},
{"array": [2,2,2,3], "reader": 2, "writer": 1, "action": "keep", "label": "Product 2 is good — packer places it in slot 1"},
{"array": [2,2,2,3], "reader": 3, "writer": 2, "action": "skip", "label": "Product 3 matches defect code — wave it aside, packer stays"},
{"array": [2,2,2,3], "reader": 3, "writer": 2, "action": "done", "label": "Belt done: k=2, first 2 slots hold [2,2]"}
]
:::

---

## Building the Algorithm

Each step introduces one concept from the Quality Control analogy, then a StackBlitz embed to try it.

### Step 1: The Scanner's Count

Before the packer places anything, let's understand what the scanner is deciding. The scanner's job is simple: walk every product and check if it matches the defect code (`val`). For every product that passes, increment `k`. At the end, `k` tells us exactly how many products would ship.

This step is the gate: `if (nums[i] !== val)` — everything that passes through this gate is a product we care about. Products that don't pass the gate are ignored entirely.

What should `k` start at? It hasn't packed anything yet, so slot 0. What happens when you find a good product in this step? You count it (increment `k`). What happens when you find a defective one? Nothing — `k` stays, `i` moves.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

<details>
<summary>Hints & gotchas</summary>

- **The gate condition**: You're checking `nums[i] !== val` — not equality. You want to count products that are NOT defective, so the condition is "not equal to the defect code."
- **k starts at zero**: The packer hasn't placed anything yet. `k = 0` before the loop.
- **Only k increments here**: In this step we're just counting — no array writes yet. The packer increments their counter whenever the gate passes.

</details>

### Step 2: The Packer's Hand

Now that we know how to identify good products, the packer needs to actually place them. Each time the scanner approves a product (step 1's gate passes), the packer writes it into slot `k` before incrementing.

The write is a single line inside the `if` block: `nums[k] = nums[i]`. This is the packer's hand reaching into the belt and placing the product in the next available slot. After writing, `k` advances to the next open slot — exactly as in step 1, but now the product is physically moved.

The beautiful thing: because `k` can never pass `i`, we're always writing to a slot we've already finished scanning. We're never overwriting something we haven't inspected yet.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

<details>

<summary>Hints & gotchas</summary>

- **Write before incrementing**: The order matters — `nums[k] = nums[i]` first, then `k++`. If you increment first, you write to the wrong slot.
- **k ≤ i always**: The packer can never get ahead of the scanner. If you find yourself writing to a slot ahead of `i`, something's off.
- **The defective items linger**: After the loop, `nums[k..end]` still has old data. That's fine — the problem says those slots don't matter.

</details>

---

## Tracing through an Example

Using `nums = [0,1,2,2,3,0,4,2], val = 2`:

| Step  | Scanner (i) | Product (nums[i]) | Packer Slot (k) | Defective? | Action               | nums[0..k]        |
| ----- | ----------- | ----------------- | --------------- | ---------- | -------------------- | ----------------- |
| Start | 0           | 0                 | 0               | No         | Place in slot 0, k→1 | [0]               |
| 1     | 1           | 1                 | 1               | No         | Place in slot 1, k→2 | [0,1]             |
| 2     | 2           | 2                 | 2               | Yes        | Wave aside           | [0,1]             |
| 3     | 3           | 2                 | 2               | Yes        | Wave aside           | [0,1]             |
| 4     | 4           | 3                 | 2               | No         | Place in slot 2, k→3 | [0,1,3]           |
| 5     | 5           | 0                 | 3               | No         | Place in slot 3, k→4 | [0,1,3,0]         |
| 6     | 6           | 4                 | 4               | No         | Place in slot 4, k→5 | [0,1,3,0,4]       |
| 7     | 7           | 2                 | 5               | Yes        | Wave aside           | [0,1,3,0,4]       |
| Done  | —           | —                 | 5               | —          | return 5             | [0,1,3,0,4,_,_,_] |

---

## Common Misconceptions

**"I need to shift all elements left when I remove one"** — The classic "delete from array" mental model suggests sliding every remaining element one position to the left. That would work but costs O(n²). The quality control line doesn't shuffle — the packer grabs each good product and drops it directly into the next open slot, regardless of where it came from on the belt.

**"k and i should always be at the same position"** — They start together, but as soon as the first defective product appears the scanner races ahead. The packer stays put until the next good product arrives. If your belt was `[val, val, val, 1]`, the scanner reaches position 3 before the packer moves once.

**"I need to clean up the end of the array"** — After packing, `nums[k..end]` still has old data. The problem explicitly says those slots are irrelevant — the judge only checks `nums[0..k-1]`. Fighting to zero out the tail is extra work for no benefit.

**"The packer should write first, then check if the product is good"** — The gate check (`if nums[i] !== val`) must come before the write. The whole point is that defective products never reach the packer's hand; they're rejected before any placement happens.

**"Since order doesn't matter, I should swap instead of overwrite"** — Swapping would also work (two-pointer from both ends), but it's more complex. Overwriting is simpler: the packer doesn't need to swap the rejected product anywhere — they just leave it behind. The problem says order may change, which means we don't have to swap to preserve relative order; but our left-to-right compaction naturally preserves it anyway.

---

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
