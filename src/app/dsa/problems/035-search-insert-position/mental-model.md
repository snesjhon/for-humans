# Search Insert Position - Mental Model

## The Problem

Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with `O(log n)` runtime complexity.

**Example 1:**
```
Input: nums = [1,3,5,6], target = 5
Output: 2
```

**Example 2:**
```
Input: nums = [1,3,5,6], target = 2
Output: 1
```

**Example 3:**
```
Input: nums = [1,3,5,6], target = 7
Output: 4
```

**Example 4:**
```
Input: nums = [1,3,5,6], target = 0
Output: 0
```

## The Surveyor's First Valid Slot Analogy

Imagine a surveyor laying a new numbered marker onto an already sorted calibration rail. She is not just asking, "Is this exact number already here?" She is asking a slightly different question: "What is the first slot where this marker is allowed to stand without breaking the order?"

That first valid slot might already contain the exact target. It might contain a larger number, meaning the new marker belongs just before it. Or there might be no such occupied slot at all, which means the new marker belongs just past the end of the rail.

So the surveyor still uses Binary Search clamps and midpoint probes, but now she is hunting for a boundary. Whenever a midpoint is big enough, she has found a slot that could work. She records it as a certified candidate and keeps squeezing left to see whether an even earlier valid slot exists.

## Understanding the Analogy

### The Setup

The rail is sorted from smallest to largest. That order is what lets one midpoint tell the surveyor something about an entire half of the rail.

The target is not necessarily a mark that already exists. The real goal is the first index whose value is at least the target. If no value is that large, then the answer is the slot after the last mark, which is index `nums.length`.

That gives the surveyor a useful default candidate before the search even begins: "insert at the end unless I discover an earlier legal slot."

### Certified Slots

When the midpoint value is smaller than the target, that midpoint and everything to its left are too early. None of those positions can be the first valid slot, so the left clamp jumps to `mid + 1`.

When the midpoint value is greater than or equal to the target, the midpoint itself is a legal insertion slot. But the surveyor is looking for the first legal slot, not just any legal slot. So she records `mid` as the current best candidate and moves the right clamp to `mid - 1` to keep searching left.

That is the key idea: a passing midpoint is not the final answer yet. It is the best certified slot seen so far.

### Why This Approach

A linear scan would walk from left to right until it found the first value that was at least the target. That works, but it costs `O(n)` time.

Binary Search turns the same question into a boundary search. Each midpoint proves that one whole half is too early or that the answer is at the midpoint or earlier. Because the live range keeps getting cut in half, the runtime becomes `O(log n)`.

## How I Think Through This

I translate the problem into: "find the first index where `nums[index] >= target`." I keep `left` and `right` as the live range where that first valid slot could still begin. I also keep `answer = nums.length` as the fallback insertion slot in case every array value is smaller than the target.

Inside the loop, I probe `mid`. If `nums[mid]` is too small, the first valid slot has to be somewhere to the right, so I move `left` to `mid + 1`. If `nums[mid]` is big enough, then `mid` is a legal slot, so I record `answer = mid` and squeeze left by moving `right` to `mid - 1`.

When the clamps cross, the search is done. If I ever found a legal slot, `answer` holds the earliest one. If I never did, `answer` is still `nums.length`, which means the target belongs at the end.

Take `nums = [1, 3, 5, 6]`, `target = 2`.

:::trace-bs
[
  {"values":[1,3,5,6],"left":0,"mid":1,"right":3,"action":"check","label":"Clamp the full rail. Probe index 1, value 3. That value is already big enough, so index 1 becomes the current certified slot."},
  {"values":[1,3,5,6],"left":0,"mid":1,"right":0,"action":"candidate","label":"Record candidate index 1 and squeeze left. There might still be an earlier slot that works."},
  {"values":[1,3,5,6],"left":0,"mid":0,"right":0,"action":"check","label":"Probe index 0, value 1. Too small, so the first valid slot must be to the right."},
  {"values":[1,3,5,6],"left":1,"mid":null,"right":0,"action":"done","label":"The clamps cross. The earliest certified slot is still index 1, so that is the insert position."}
]
:::

---

## Building the Algorithm

### Step 1: Certify the First Passing Probe

Start with the Binary Search shell and a fallback answer of `nums.length`. That fallback means "if I never find a value big enough, the target belongs at the end."

For the first step, keep the rule narrow. Probe the midpoint once. If that midpoint is already big enough for the target, return that index immediately. Otherwise, for now, return the fallback end slot. This teaches the lower-bound idea without yet teaching how to keep squeezing left or right across multiple probes.

Take `nums = [1, 3, 5, 7, 9]`, `target = 4`.

:::trace-bs
[
  {"values":[1,3,5,7,9],"left":0,"mid":2,"right":4,"action":"check","label":"Step 1 probes the midpoint at index 2, value 5. That is already big enough for target 4."},
  {"values":[1,3,5,7,9],"left":0,"mid":2,"right":4,"action":"found","label":"Because the first probe already certifies a valid slot, Step 1 returns index 2 immediately."}
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Default to the end**: if every value is smaller than the target, the insert position is `nums.length`.
- **Big enough is enough to certify a slot**: use `nums[mid] >= target`, not just equality.
- **Keep this step narrow**: one successful midpoint can already teach the idea of a valid insertion slot before the full squeeze logic arrives.
</details>

### Step 2: Keep Squeezing to the Earliest Slot

Now complete the boundary search. A midpoint smaller than the target proves the first valid slot must be farther right, so move `left` to `mid + 1`.

A midpoint that is greater than or equal to the target proves something more subtle: this midpoint works, but there might be an earlier one. So record `answer = mid`, move `right` to `mid - 1`, and keep squeezing left until no earlier certified slot survives.

That is the full lower-bound loop. When the live range empties, `answer` is the first index where the target can stand without breaking the sorted order.

Take `nums = [1, 3, 5, 6]`, `target = 7`.

:::trace-bs
[
  {"values":[1,3,5,6],"left":0,"mid":1,"right":3,"action":"check","label":"Probe index 1, value 3. Too small, so the first valid slot must be to the right."},
  {"values":[1,3,5,6],"left":2,"mid":2,"right":3,"action":"discard-left","label":"Probe index 2, value 5. Still too small, so move the left clamp right again."},
  {"values":[1,3,5,6],"left":3,"mid":3,"right":3,"action":"check","label":"Probe index 3, value 6. Still too small. No occupied slot is big enough."},
  {"values":[1,3,5,6],"left":4,"mid":null,"right":3,"action":"done","label":"The clamps cross with no certified slot found, so the fallback answer `nums.length` survives. Insert at index 4."}
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Record before squeezing left**: when `nums[mid] >= target`, save `mid` into `answer` first.
- **A passing midpoint does not end the search**: it is only the best slot seen so far.
- **Crossed clamps mean the boundary is settled**: return the recorded candidate, or the end fallback if none was recorded.
</details>

## Common Misconceptions

- **"This is the same as exact-hit Binary Search"**: not quite. The real target is the first index where the value is at least `target`, even when the exact number is missing.
- **"If `nums[mid] >= target`, I can return immediately"**: that can miss an earlier legal slot. The correct mental model is to record the midpoint as a candidate and keep squeezing left.
- **"If nothing matches exactly, the answer should be `-1`"**: this problem never returns `-1`. If no value is big enough, the valid insertion slot is just after the last element.
- **"I should search for the last value smaller than the target"**: that is the mirror problem. This one wants the first value that is not smaller than the target.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
