# Product of Array Except Self - Mental Model

## The Problem

Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.

**Example 1:**

```
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
```

**Example 2:**

```
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
```

---

## The Two Messengers Analogy

Imagine a row of villages along a single road. Each village has a harvest number posted on a sign. Every village needs to know the **combined product of every other village's harvest** — but not its own. The village elders solve this by sending out two messengers: one walks east (left to right), one walks west (right to left). Each carries a running tally — the product of all harvests they've absorbed so far.

Both messengers follow one strict rule at every village: **write your current tally on the village's board first, then absorb this harvest into your tally.** Writing before absorbing guarantees that no village ever sees its own harvest in the tally left for it.

After both messengers have completed their journeys, each village's board holds: "everything to my left" × "everything to my right" — which is exactly the product of every other village. No messenger ever needed to see the full product. No division was required. Each messenger only ever looked forward.

## Understanding the Analogy

### The Setup

There are four villages in a row, each with a harvest posted on a sign: `[1, 2, 3, 4]`. Every village needs to display the product of all _other_ harvests. Village 2 (harvest 3), for example, needs to display `1 × 2 × 4 = 8`. We can't just compute the total product and divide it out — what if a village's harvest is zero? Instead we split each village's answer into two natural groups: everything before me, and everything after me.

### The Messenger Rule

Both messengers follow the same rule: write tally first, absorb after. This ordering is everything. If a messenger absorbed first and then wrote their tally, the number they left on the board would already include the current village's harvest. By writing their tally down _before_ picking up the current harvest, each messenger leaves a clean record of every village they passed through on the way _here_ — and nothing more.

The **eastbound messenger** starts at the western edge with a tally of 1 (the product of nothing). At each village they write their tally onto the board, then multiply the current harvest into their tally before continuing east. When they're done, every board slot holds the product of everything to that village's left.

The **westbound messenger** starts at the eastern edge, also with a tally of 1. At each village they multiply their tally _into_ whatever the eastbound messenger already wrote on the board, then absorb the current harvest before continuing west. When they're done, every board slot has been updated to hold the product of all villages except itself.

The westbound messenger doesn't need a separate board — they combine their right-side tally directly with the left-side tally already written there. Multiplying in rather than replacing is what stitches both halves together.

### Why This Approach

Every village's answer is missing exactly one thing from the full product: itself. That one missing piece splits naturally into two sides. Two passes, one for each side, cover every element exactly once. Neither pass needs to know about the other — the eastbound messenger has no idea a westbound messenger is coming, and vice versa. Their work combines at the very end in a single multiplication per village.

The naive alternative — compute the total product, divide each element out — fails the moment any harvest is zero. This approach never divides. It never even computes a total. Each village's answer is assembled from two sub-products that were naturally computed without ever touching that village.

## How I Think Through This

Each position's answer is the product of every element except itself, which splits into two natural groups: everything to my left and everything to my right. First I walk left to right keeping a `leftTally` that starts at 1. At each position I write `leftTally` into the output board, then multiply the current element into it before moving on. The write-before-absorb order is the core invariant: every slot ends up holding the compressed product of everything before it, never including itself.

Then I walk right to left with a `rightTally` that also starts at 1. At each position I multiply `rightTally` into the board slot — the slot already holds the left product, so after the multiply it holds both halves combined. Then I multiply the current element into `rightTally` before stepping left.

Take `[1, 2, 3, 4]`.

:::trace-ps
[
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":-1,"pass":"forward","accumulator":1,"accName":"prefix","label":"Left pass begins — board initialized, leftTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":0,"pass":"forward","accumulator":1,"accName":"prefix","label":"Position 0: write leftTally=1 → board[0]=1, absorb → leftTally = 1×1 = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":1,"pass":"forward","accumulator":2,"accName":"prefix","label":"Position 1: write leftTally=1 → board[1]=1, absorb → leftTally = 1×2 = 2."},
{"nums":[1,2,3,4],"result":[1,1,2,1],"currentI":2,"pass":"forward","accumulator":6,"accName":"prefix","label":"Position 2: write leftTally=2 → board[2]=2, absorb → leftTally = 2×3 = 6."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"forward","accumulator":24,"accName":"prefix","label":"Position 3: write leftTally=6 → board[3]=6. Left pass done. Board = [1,1,2,6]."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":-1,"pass":"backward","accumulator":1,"accName":"suffix","label":"Right pass begins — board holds left products, rightTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"backward","accumulator":4,"accName":"suffix","label":"Position 3: board[3]×rightTally=1 → 6×1=6, absorb → rightTally = 1×4 = 4."},
{"nums":[1,2,3,4],"result":[1,1,8,6],"currentI":2,"pass":"backward","accumulator":12,"accName":"suffix","label":"Position 2: board[2]×rightTally=4 → 2×4=8, absorb → rightTally = 4×3 = 12."},
{"nums":[1,2,3,4],"result":[1,12,8,6],"currentI":1,"pass":"backward","accumulator":24,"accName":"suffix","label":"Position 1: board[1]×rightTally=12 → 1×12=12, absorb → rightTally = 12×2 = 24."},
{"nums":[1,2,3,4],"result":[24,12,8,6],"currentI":0,"pass":"backward","accumulator":24,"accName":"suffix","label":"Position 0: board[0]×rightTally=24 → 1×24=24. Final board: [24,12,8,6] ✓"}
]
:::

## Building the Algorithm

Each step introduces one concept from the two-messenger analogy, then a StackBlitz embed to try it.

### Step 1: Eastbound Messenger — Left Products

Before either messenger sets out, every village needs a board to record tallies. The board starts empty — one slot per village. Then the eastbound messenger begins their journey with a tally of 1 (the product of nothing seen yet). At each village, the messenger writes their current tally to the board _before_ absorbing the harvest. Ask yourself: why does writing before absorbing ensure the slot never includes the current village? What does the board hold after the eastbound messenger finishes?

:::trace-ps
[
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":-1,"pass":"forward","accumulator":1,"accName":"prefix","label":"Eastbound messenger sets out — board initialized, eastTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":0,"pass":"forward","accumulator":1,"accName":"prefix","label":"Village 0 (harvest 1): write eastTally=1 → board[0]=1, absorb → eastTally = 1×1 = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":1,"pass":"forward","accumulator":2,"accName":"prefix","label":"Village 1 (harvest 2): write eastTally=1 → board[1]=1, absorb → eastTally = 1×2 = 2."},
{"nums":[1,2,3,4],"result":[1,1,2,1],"currentI":2,"pass":"forward","accumulator":6,"accName":"prefix","label":"Village 2 (harvest 3): write eastTally=2 → board[2]=2, absorb → eastTally = 2×3 = 6."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"forward","accumulator":24,"accName":"prefix","label":"Village 3 (harvest 4): write eastTally=6 → board[3]=6, absorb → eastTally = 6×4 = 24."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":-1,"pass":"done","accumulator":0,"accName":"","label":"Eastbound complete — board[i] holds the product of every village to the left of i."}
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

### Step 2: Westbound Messenger — Combined Products

The board now holds the left product at every slot. The westbound messenger starts at the eastern edge with a tally of 1 and walks west. At each village, they multiply their tally _into_ the board slot — not replace it — so the slot's left product and the messenger's right-side tally are combined. Then they absorb the current harvest before stepping left. After both messengers have passed through, every slot holds the product of everything except itself.

Consider: why does the westbound messenger multiply into the board rather than write a fresh value? What would happen if they replaced the slot instead?

:::trace-ps
[
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":-1,"pass":"backward","accumulator":1,"accName":"suffix","label":"Westbound messenger sets out — board holds left products from Step 1, westTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"backward","accumulator":4,"accName":"suffix","label":"Village 3 (harvest 4): board[3]×westTally=1 → 6×1=6, absorb → westTally = 1×4 = 4."},
{"nums":[1,2,3,4],"result":[1,1,8,6],"currentI":2,"pass":"backward","accumulator":12,"accName":"suffix","label":"Village 2 (harvest 3): board[2]×westTally=4 → 2×4=8, absorb → westTally = 4×3 = 12."},
{"nums":[1,2,3,4],"result":[1,12,8,6],"currentI":1,"pass":"backward","accumulator":24,"accName":"suffix","label":"Village 1 (harvest 2): board[1]×westTally=12 → 1×12=12, absorb → westTally = 12×2 = 24."},
{"nums":[1,2,3,4],"result":[24,12,8,6],"currentI":0,"pass":"backward","accumulator":24,"accName":"suffix","label":"Village 0 (harvest 1): board[0]×westTally=24 → 1×24=24, absorb → westTally = 24×1 = 24."},
{"nums":[1,2,3,4],"result":[24,12,8,6],"currentI":-1,"pass":"done","accumulator":0,"accName":"","label":"Westbound complete — every slot now holds left × right = product of all except itself."}
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

---

## Tracing through an Example

**Input:** `[1, 2, 3, 4]`

:::trace-ps
[
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":-1,"pass":"forward","accumulator":1,"accName":"prefix","label":"Eastbound pass begins — board initialized, eastTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":0,"pass":"forward","accumulator":1,"accName":"prefix","label":"Village 0 (harvest 1): write eastTally=1 to board[0], absorb → eastTally = 1×1 = 1."},
{"nums":[1,2,3,4],"result":[1,1,1,1],"currentI":1,"pass":"forward","accumulator":2,"accName":"prefix","label":"Village 1 (harvest 2): write eastTally=1 to board[1], absorb → eastTally = 1×2 = 2."},
{"nums":[1,2,3,4],"result":[1,1,2,1],"currentI":2,"pass":"forward","accumulator":6,"accName":"prefix","label":"Village 2 (harvest 3): write eastTally=2 to board[2], absorb → eastTally = 2×3 = 6."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"forward","accumulator":24,"accName":"prefix","label":"Village 3 (harvest 4): write eastTally=6 to board[3], absorb → eastTally = 6×4 = 24. Eastbound complete."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":-1,"pass":"backward","accumulator":1,"accName":"suffix","label":"Westbound pass begins — board holds left products, westTally = 1."},
{"nums":[1,2,3,4],"result":[1,1,2,6],"currentI":3,"pass":"backward","accumulator":4,"accName":"suffix","label":"Village 3 (harvest 4): board[3]×westTally=1 → 6×1=6, absorb → westTally = 1×4 = 4."},
{"nums":[1,2,3,4],"result":[1,1,8,6],"currentI":2,"pass":"backward","accumulator":12,"accName":"suffix","label":"Village 2 (harvest 3): board[2]×westTally=4 → 2×4=8, absorb → westTally = 4×3 = 12."},
{"nums":[1,2,3,4],"result":[1,12,8,6],"currentI":1,"pass":"backward","accumulator":24,"accName":"suffix","label":"Village 1 (harvest 2): board[1]×westTally=12 → 1×12=12, absorb → westTally = 12×2 = 24."},
{"nums":[1,2,3,4],"result":[24,12,8,6],"currentI":0,"pass":"backward","accumulator":24,"accName":"suffix","label":"Village 0 (harvest 1): board[0]×westTally=24 → 1×24=24, absorb → westTally = 24×1 = 24. Westbound complete."},
{"nums":[1,2,3,4],"result":[24,12,8,6],"currentI":-1,"pass":"done","accumulator":0,"accName":"","label":"Done — board = [24, 12, 8, 6] ✓"}
]
:::

---

## Common Misconceptions

**"The messenger should absorb the harvest before writing on the board."** — If the messenger picks up the harvest first, the tally they write already contains the current village's contribution. That village's board slot would then reflect its own harvest, not just everyone else's. The strict rule is: write the clean tally first, then absorb.

**"The westbound messenger should write their tally to the board, not multiply into it."** — By the time the westbound messenger arrives, the board already holds the eastbound messenger's work — the product of everything to the left. Writing a fresh value would erase that. The westbound messenger's job is to combine both halves, not replace one with the other.

**"This approach breaks when the array contains zeros."** — Zeros are handled naturally. Once the eastbound messenger absorbs a zero harvest, their tally becomes zero and stays zero for every village further east. Those villages correctly receive a zero left-product, because the element at that zero position IS one of the elements they should multiply. No special casing is needed.

**"Starting both tallies at 0 would be equivalent to starting at 1."** — The product of an empty set of villages is 1 — the multiplicative identity. Village 0 has nothing to its left, so its left product should be 1. Starting at 0 would make every tally zero immediately, producing an all-zeros board regardless of the input.

**"You need a separate left-products array and a separate right-products array."** — That's the natural first instinct, and it works — but it requires O(n) extra space. The key insight is that the eastbound pass fills the board, and the westbound pass updates it in place. The board serves both purposes because the westbound pass reads and updates from right to left, so by the time it reaches position i, every slot to the right of i has already been finalized and no slot to the left has been touched yet.

---

## Complete Solution

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
