# Reverse String - Mental Model

## The Problem

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array **in-place** with O(1) extra memory.

**Example 1:**

```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

**Example 2:**

```
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
```

---

## The Card Table Dealer Analogy

Imagine a casino table with playing cards laid face-up in a row. The pit boss wants to reverse the order of the row — what was at the front should end up at the back, and vice versa. But there's a strict rule: no extra table space allowed. Every card must be rearranged right where it is.

Two dealers step up to opposite ends of the table. The front dealer stands at the very first card; the back dealer stands at the very last card. On the pit boss's signal, both dealers simultaneously pick up their card, cross the table, and place each other's card in the spot they just vacated — a perfect swap. Then both dealers take exactly one step toward the center and repeat.

Every swap exchanges one card at the front with its mirror counterpart at the back. When the dealers meet in the middle, every card is in its reversed position. The genius of this approach: you only ever need to hold two cards at once. No spare table, no staging area, no shuffling through the whole row — just two dealers walking inward, trading cards all the way to the center.

## Understanding the Analogy

### The Setup

You have a row of character cards on the table, and you want the row — read from right to left — to be exactly what you currently read left to right. Two dealers take their starting positions at opposite ends: one at the far left end of the row, one at the far right end.

> Their job is simple: **walk toward each other, swap what they're holding at each position, and stop when they meet**.

### The Two Dealers Walking Inward

This is the heart of the technique. The front dealer starts at the very first card (index 0); the back dealer starts at the very last card (index `s.length - 1`). After each swap, the front dealer steps one position to the right and the back dealer steps one position to the left — marching toward each other. The row behind each of them is already finished: every card they've already touched is in its final reversed position.

The stopping rule is equally critical. The dealers stop the moment the front dealer's position is no longer to the left of the back dealer's. When they reach the same card in an odd-length row, that card is the center — its own mirror position — and doesn't need to move. When they cross in an even-length row, every card has already been swapped with its partner.

### Why This Approach

Why not take all the cards off the table, flip the whole row, and put them back? That works conceptually, but it requires a staging area proportional to the number of cards — the O(1) rule forbids it. The two-dealer method only needs one temporary grip per swap: one dealer briefly holds their card while they receive the other's.

Why not one dealer walking left to right, moving each card to its final position? That requires knowing in advance where each card belongs and tracking which spots are already filled. The two-dealer approach exploits the symmetric structure of reversal directly: the card at the front always pairs with the card at the back. Two pointers from opposite ends naturally express this symmetry.

## How I Think Through This

The problem is asking me to flip the character array in-place — no second array, just two positions reaching in from opposite sides. I set up `frontDealer` at index 0 (the leftmost card) and `backDealer` at index `s.length - 1` (the rightmost card). The invariant I maintain: everything to the left of `frontDealer` and everything to the right of `backDealer` is already in its final reversed position. Each iteration I swap `s[frontDealer]` with `s[backDealer]` — using a temporary grip variable `heldCard` — then move `frontDealer` right and `backDealer` left. The loop runs while `frontDealer < backDealer` (strict less-than), so the center card of an odd-length array is never touched. When the loop ends the array has been reversed in-place.

Take `["h","e","l","l","o"]`.

:::trace-lr
[
{"chars":["h","e","l","l","o"],"L":0,"R":4,"action":"match","label":"frontDealer=0 ('h'), backDealer=4 ('o'). Swap → ['o','e','l','l','h']. Both step inward."},
{"chars":["o","e","l","l","h"],"L":1,"R":3,"action":"match","label":"frontDealer=1 ('e'), backDealer=3 ('l'). Swap → ['o','l','l','e','h']. Both step inward."},
{"chars":["o","l","l","e","h"],"L":2,"R":2,"action":"done","label":"frontDealer(2) === backDealer(2): center card, no swap needed. Done. Output: ['o','l','l','e','h'] ✓"}
]
:::

## Building the Algorithm

Each step introduces one concept from the Card Table Dealer analogy, then a StackBlitz embed to try it.

### Step 1: Station the Two Dealers

Before any swap can happen, we need to position our dealers at opposite ends of the table. The front dealer takes position 0 — the very first card. The back dealer takes position `s.length - 1` — the very last card.

Why `s.length - 1` specifically? Arrays are zero-indexed: a 5-character row occupies positions 0 through 4. The last card sits at position 4, which is 5 − 1. If the back dealer stood at position 5, they'd be off the edge of the table entirely — `s[5]` is `undefined`, not a character.

After this setup, for an empty row or a single-card row, the front dealer is already at or past the back dealer — no swapping is needed and the function is done immediately. The two pointer positions alone encode this: `0 < -1` is false for an empty array; `0 < 0` is false for a single character.

:::trace-lr
[
{"chars":["h","e","l","l","o"],"L":0,"R":4,"action":"match","label":"frontDealer=0, backDealer=4. Dealers stationed at opposite ends — ready to march."},
{"chars":["a"],"L":0,"R":0,"action":"done","label":"Single card: frontDealer=0, backDealer=0. Not frontDealer < backDealer — loop will never run."}
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

<details>
<summary>Hints</summary>

- The front dealer always starts at the first index, regardless of array length.
- The back dealer's starting index depends directly on the array length — off by one is the most common mistake.
- For an empty array, `s.length - 1` evaluates to `-1`. Ask yourself: is `0 < -1` true? What does that mean for the loop you'll add next?

</details>

### Step 2: March Inward, Swap at Every Stop

Now the dealers begin their walk toward the center. While the front dealer's position is strictly to the left of the back dealer's (`frontDealer < backDealer`), they perform a swap and each steps one position inward.

The swap itself needs a brief holding moment — like one dealer tucking their card under their arm while they take the other's. You store `s[frontDealer]` into `heldCard`, move `s[backDealer]` into `s[frontDealer]`, then place `heldCard` into `s[backDealer]`. After the swap, increment `frontDealer` and decrement `backDealer` so both dealers step inward together.

The stopping condition `frontDealer < backDealer` (strict) is the key invariant. When the dealers meet at the same index in an odd-length array, that card is the center — it's already in its own mirror position. When they cross in an even-length array, every card has been paired and swapped. Either way, strict less-than is the right call.

:::trace-lr
[
{"chars":["h","e","l","l","o"],"L":0,"R":4,"action":"match","label":"Swap s[0]='h' ↔ s[4]='o' via heldCard. Result: ['o','e','l','l','h']. frontDealer→1, backDealer→3."},
{"chars":["o","e","l","l","h"],"L":1,"R":3,"action":"match","label":"Swap s[1]='e' ↔ s[3]='l' via heldCard. Result: ['o','l','l','e','h']. frontDealer→2, backDealer→2."},
{"chars":["o","l","l","e","h"],"L":2,"R":2,"action":"done","label":"frontDealer(2) not < backDealer(2): loop exits. Output: ['o','l','l','e','h'] ✓"}
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

<details>
<summary>Hints</summary>

- The swap requires a temporary variable — writing `s[frontDealer] = s[backDealer]` directly loses the original value before you can place it at the other end.
- After each swap, both pointers must move: `frontDealer++` and `backDealer--`. Forgetting either means an infinite loop.
- Strict `<` not `<=`: the center card of an odd-length array is already in its mirror position. `<=` would swap it with itself — harmless but reveals a misunderstanding of the stopping rule.

</details>

---

## Common Misconceptions

**"I need a second array to hold the reversed characters"** — The pit boss explicitly forbids extra table space. The two-dealer method never needs it. You only hold one card at a time during each swap (the `heldCard` variable). Every character goes directly from one position to its mirror position.

**"The back dealer should start at `s.length`, not `s.length - 1`"** — The last card sits at index `s.length - 1` because arrays are zero-indexed. Starting the back dealer at `s.length` puts them off the edge of the table — `s[s.length]` is `undefined`, not a character.

**"I need `frontDealer <= backDealer` to handle odd-length arrays correctly"** — Using `<=` for an odd-length array means the center card swaps with itself — harmless, but it reveals a misunderstanding. The center card is already in its own mirror position. Strict `<` is correct.

**"Two pointers might double-swap a card that was already moved"** — The dealers only ever step inward: `frontDealer` only increments, `backDealer` only decrements. Every card they touch is immediately behind them after the step — there is no risk of revisiting a position.

**"I should just use JavaScript's built-in `.reverse()` method"** — The problem asks for O(1) extra memory using the in-place swap technique. `.reverse()` bypasses the learning goal entirely. The two-dealer swap is the intended technique, and it generalizes to contexts where built-in methods aren't available.

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
