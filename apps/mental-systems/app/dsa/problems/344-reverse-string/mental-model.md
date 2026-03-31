# Reverse an Array - Mental Model

## The Problem

You are given an array of integers `arr[]`. Your task is to reverse the given array in place.

**Example 1:**

```
Input:  arr = [1, 4, 3, 2, 6, 5]
Output: [5, 6, 2, 3, 4, 1]
```

**Example 2:**

```
Input:  arr = [4, 5, 2]
Output: [2, 5, 4]
```

**Example 3:**

```
Input:  arr = [1]
Output: [1]
```

---

## The Card Table Dealer Analogy

Imagine a long casino table with playing cards laid face-up in a row. The pit boss wants to reverse the order of the row — what was at the front should end up at the back, and vice versa. But there's a strict rule: no extra table space allowed. Every card must be rearranged right where it is.

Two dealers step up to opposite ends of the table. The front dealer stands at the very first card; the back dealer stands at the very last card. On the pit boss's signal, both dealers simultaneously pick up their card, cross the table, and place each other's card in the spot they just vacated — a perfect swap. Then both dealers take exactly one step toward the center and repeat.

Every swap exchanges one card at the front with its mirror counterpart at the back. When the dealers meet in the middle, every card is in its reversed position. The genius of this approach: you only ever need to hold two cards at once. No spare table, no staging area, no shuffling through the whole row — just two dealers walking inward, trading cards all the way to the center.

## Understanding the Analogy

### The Setup

You have a row of cards on the table, and you want the row — read from right to left — to be exactly what you currently read left to right. Two dealers take their starting positions at opposite ends: one at the far left end of the row, one at the far right end. Their job is simple: walk toward each other, swap what they're holding at each position, and stop when they meet.

### The Two Dealers Walking Inward

This is the heart of the technique. The front dealer starts at the very first card; the back dealer starts at the very last card. After each swap, the front dealer steps one position to the right and the back dealer steps one position to the left — marching toward each other. The row behind each of them is already finished: every card they've already touched is in its final reversed position.

The stopping rule is equally critical. The dealers stop the moment the front dealer's position is no longer to the left of the back dealer's. When they reach the same card in an odd-length row, that card is the center — its own mirror position — and doesn't need to move. When they cross in an even-length row, every card has already been swapped with its partner.

### Why This Approach

Why not take all the cards off the table, flip the whole row, and put them back? That works conceptually, but it requires a staging area proportional to the number of cards — space the pit boss has explicitly forbidden. The two-dealer method only needs one temporary grip per swap. One dealer briefly holds their card while they receive the other's — that's it. No holding pile, no scratch space.

Why not one dealer walking left to right, moving each card to its final position? That requires knowing in advance where each card belongs and tracking which spots are already filled — far more bookkeeping. The two-dealer approach exploits the symmetric structure of reversal directly: the card at the front always pairs with the card at the back, the second always pairs with the second-to-last, and so on. Two pointers from opposite ends naturally express this symmetry.

## How I Think Through This

The problem is asking me to flip the array in-place — no second array, just two positions reaching in from opposite sides. I set up `frontDealer` at index 0 (the leftmost card) and `backDealer` at index `arr.length - 1` (the rightmost card). The invariant I maintain: everything to the left of `frontDealer` and everything to the right of `backDealer` is already in its final reversed position. Each iteration I swap `arr[frontDealer]` with `arr[backDealer]` — using a temporary grip variable `heldCard` — then move `frontDealer` right and `backDealer` left. The loop runs while `frontDealer < backDealer` (strict less-than), so the center card of an odd-length array is never touched. When the loop ends the array has been reversed in-place.

Take `[1, 4, 3, 2, 6, 5]`.

:::trace-lr
[
  {"chars":[1,4,3,2,6,5],"L":0,"R":5,"action":"match","label":"frontDealer=0, backDealer=5. Swap arr[0]=1 ↔ arr[5]=5 → [5,4,3,2,6,1]. Both step inward."},
  {"chars":[5,4,3,2,6,1],"L":1,"R":4,"action":"match","label":"frontDealer=1, backDealer=4. Swap arr[1]=4 ↔ arr[4]=6 → [5,6,3,2,4,1]. Both step inward."},
  {"chars":[5,6,3,2,4,1],"L":2,"R":3,"action":"match","label":"frontDealer=2, backDealer=3. Swap arr[2]=3 ↔ arr[3]=2 → [5,6,2,3,4,1]. Both step inward."},
  {"chars":[5,6,2,3,4,1],"L":3,"R":2,"action":"done","label":"frontDealer(3) >= backDealer(2): dealers crossed. Done. Output: [5,6,2,3,4,1] ✓"}
]
:::

## Building the Algorithm

Each step introduces one concept from the Card Table Dealer analogy, then a StackBlitz embed to try it.

### Step 1: Station the Two Dealers

Before any swap can happen, we need to position our dealers at opposite ends of the table. The front dealer takes position 0 — the very first card. The back dealer takes position `arr.length - 1` — the very last card.

Why `arr.length - 1` specifically? Arrays are zero-indexed: a 6-card row occupies positions 0 through 5. The last card sits at position 5, which is 6 − 1. If the back dealer stood at position 6, they'd be standing off the edge of the table entirely — no card to hold.

After this setup we have everything we need: two positions that together define the full range of cards to be reversed. For an empty row or a single-card row, the front dealer is already at or past the back dealer — no swapping is needed, and the function can return immediately.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

### Step 2: March Inward, Swap at Every Stop

Now the dealers begin their walk toward the center. While the front dealer's position is strictly to the left of the back dealer's (`frontDealer < backDealer`), they perform a swap and each steps one position inward.

The swap itself needs a brief holding moment — like one dealer tucking their card under their arm while they take the other's. You store `arr[frontDealer]` into `heldCard`, move `arr[backDealer]` into `arr[frontDealer]`, then place `heldCard` into `arr[backDealer]`. After the swap, increment `frontDealer` and decrement `backDealer` so both dealers step inward.

The stopping condition `frontDealer < backDealer` is the key invariant. When the dealers meet at the same index (odd-length array), that card is the center — it's already in its own mirror position and doesn't need swapping. When they cross (even-length array), every card has been paired and swapped. Either way, strict less-than is the right call.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

---

## Tracing through an Example

| Step  | Front Dealer (frontDealer) | Card at Front | Back Dealer (backDealer) | Card at Back | Dealers Crossed? | Action                    | Array State        |
| ----- | -------------------------- | ------------- | ------------------------ | ------------ | ---------------- | ------------------------- | ------------------ |
| Start | 0                          | 1             | 5                        | 5            | No               | initialize                | [1, 4, 3, 2, 6, 5] |
| 1     | 0                          | 1             | 5                        | 5            | No               | swap 1↔5, front=1, back=4 | [5, 4, 3, 2, 6, 1] |
| 2     | 1                          | 4             | 4                        | 6            | No               | swap 4↔6, front=2, back=3 | [5, 6, 3, 2, 4, 1] |
| 3     | 2                          | 3             | 3                        | 2            | No               | swap 3↔2, front=3, back=2 | [5, 6, 2, 3, 4, 1] |
| Done  | 3                          | —             | 2                        | —            | Yes (3 > 2)      | stop, return              | [5, 6, 2, 3, 4, 1] |

## Common Misconceptions

**"I need a second array to hold the reversed elements"** — The pit boss explicitly forbids extra table space. The two-dealer method never needs it. You only hold one card at a time during each swap (the `heldCard` variable). Every card goes directly from one position to its mirror position — no staging area, no temporary row.

**"The back dealer should start at `arr.length`, not `arr.length - 1`"** — The last card sits at index `arr.length - 1` because arrays are zero-indexed. Starting the back dealer at `arr.length` puts them off the edge of the table — `arr[arr.length]` is `undefined`, not a card. Always start one step in from the conceptual boundary.

**"I need `frontDealer <= backDealer` to handle odd-length arrays correctly"** — Using `<=` for an odd-length array means the center card swaps with itself — harmless, but it reveals a misunderstanding. The center card's mirror position is itself: it's already where it belongs. Strict `<` is the correct condition. Stop when the dealers meet; there's no unswapped pair left.

**"Two pointers might double-swap a card that was already moved"** — The dealers only ever step inward: `frontDealer` only increments, `backDealer` only decrements. Every card they touch is immediately behind them after the step, and neither dealer ever steps backward. There is no risk of revisiting a position.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
