# Daily Temperatures - Mental Model

## The Problem

Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.

**Example 1:**
```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

**Example 2:**
```
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
```

**Example 3:**
```
Input: temperatures = [30,60,90]
Output: [1,1,0]
```

**Constraints:**

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

## The Monotonic Bouncer Line Analogy

Imagine each future day lining up outside a club, and today's day is asking the bouncer one question: "Who is the first guest ahead of me who is strictly hotter than I am?"

The bouncer does not keep every future guest in line. That would make the line noisy and useless. Instead, the bouncer keeps only the guests who are still worth asking about. If a new guest arrives who is hotter than or equal to someone already standing closer to the front, that cooler guest gets turned away immediately. Any earlier day would always prefer the newer, hotter guest, so the cooler one has become dead weight.

That leaves a very disciplined line of future candidates. The guest at the front is always the nearest future day that still has a chance to help someone further left. If today's temperature is cooler than that front guest, the answer is immediate: count how many days away that guest is. If today's temperature is hotter or equal, the bouncer keeps kicking guests out until the front is finally hotter or the line goes empty.

## Understanding the Analogy

### The Setup

We are not asking whether some warmer day exists somewhere in the future. We are asking for the **first** warmer future day. That "first" requirement is what makes order matter.

So the line cannot just remember the hottest future day. It must remember future days in a way that still preserves the nearest valid answer for every earlier day we will inspect.

### Why Cooler Guests Get Turned Away

Suppose a future day with temperature `71` is already waiting in line, and then a nearer future day with temperature `72` arrives in front of it. The `71` day is now useless for every earlier day. Any earlier day that would have accepted `71` would also accept `72`, and `72` is closer.

Equal temperatures are useless too. If the current day is `70`, another future `70` is not warm enough to answer the question. And if a later `70` sits behind a nearer `70`, the farther one can never be the first warmer answer for anyone.

That is why the bouncer removes future days whose temperature is less than or equal to the current day's temperature. They can no longer help anyone to the left.

### Why This Approach

If each day scanned every future day until it found a warmer one, the work could blow up to O(n^2). The bouncer line avoids repeated scanning because each day enters the line once and can be kicked out at most once.

That gives us a monotonic stack of day indices and an O(n) solution. The stack stores the future days still worth asking about, and its top is always the nearest remaining candidate.

## How I Think Through This

I scan `temperatures` from right to left because the answer for day `i` depends only on days after `i`. I keep a stack named `futureLine` that stores **indices**, not temperatures. The invariant is: **after cleanup, the top of `futureLine` is the nearest future day that is strictly warmer than the current day**.

For each `day`, I first compare its temperature to the temperature at the top index in `futureLine`. While that future day is cooler than or equal to today, I pop it because it cannot help this day or any earlier day anymore. After that cleanup, if `futureLine` is non-empty, the top index is the first warmer future day, so `waitDays[day] = futureLine[futureLine.length - 1] - day`. If the stack is empty, no warmer day exists, so the default `0` stays in place. Then I push `day` onto `futureLine` so earlier days can ask about it.

Take `[73,74,75,71,69,72,76,73]`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": [], "color": "orange", "emptyLabel": "no future candidates yet" }
    ],
    "action": null,
    "label": "Start at the far right. There are no future days yet, so the line is empty."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["7:73"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "Day 7 is `73`. No warmer future day exists, so its answer stays `0`, and it joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["6:76"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Day 6 is `76`. The front guest `73` is not warmer, so the bouncer kicks it out. Day 6 also gets `0`, then joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["6:76", "5:72"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "Day 5 is `72`. The top guest `76` is warmer, so the answer is `6 - 5 = 1`. Then day 5 joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["6:76", "5:72", "3:71"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "Days 4 and 3 are `69` and `71`. Day 4 sees `72` immediately, so it waits `1`. Day 3 first kicks out `69`, then sees `72`, so it waits `2`."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["6:76", "2:75"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Day 2 is `75`. The bouncer removes `71` and `72` because neither is warmer than `75`. Now `76` is on top, so day 2 waits `4` days, then joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["6:76", "2:75", "1:74", "0:73"], "color": "orange", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "done",
    "label": "Day 1 sees `75` after kicking nobody, so it waits `1`. Day 0 sees `74`, so it also waits `1`. Final answers: `[1,1,4,2,1,1,0,0]`."
  }
]
:::

## Building the Algorithm

### Step 1: Start the Answer Sheet

Before the bouncer line can help, the function needs a place to write answers. Start by creating `waitDays` with one slot per day, all preset to `0`.

That default is not filler. It already matches the real meaning of "no warmer future day exists." So the first step is not algorithm scaffolding hidden by the author. It is the first structural line the learner genuinely owns.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": [], "color": "orange", "emptyLabel": "no future candidates yet" }
    ],
    "action": null,
    "label": "The future line has not been built yet, but the answer sheet already has one `0` slot ready for every day."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": [], "color": "orange", "emptyLabel": "still empty" }
    ],
    "action": "done",
    "label": "For inputs like `[80,75,70]`, those default zeroes are already the whole correct answer."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=4 solution="step1-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Own the first line**: do not skip straight to stacks and loops before the answer array exists.
  - **One slot per day**: the returned array must match the input length exactly.
  - **Zeros already mean something**: they are not placeholders; they are the correct result when no warmer day is found.
</details>

### Step 2: Build the Future Line Shell

Now add the physical bouncer line itself: a stack of future day indices and a right-to-left loop. For now, each inspected day simply joins the line after its turn.

This step does not answer any nonzero waits yet. Its job is to establish the direction of travel and the idea that earlier days are querying a structure built from the future.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": [], "color": "orange", "emptyLabel": "no future candidates yet" }
    ],
    "action": null,
    "label": "Start from the far right so the future line is empty before day 2 is inspected."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["2:70"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "push",
    "label": "On `[80,75,70]`, day 2 joins the line first because every earlier day will see it as part of the future."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["2:70", "1:75", "0:80"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "done",
    "label": "Days 1 and 0 join afterward. The answers are still `[0,0,0]`, but the future-facing traversal now exists."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=4 solution="step2-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Scan from right to left**: the stack is supposed to represent future days, so the future must already be built when you inspect a day.
  - **Store indices, not temperatures**: the final answer needs day gaps like `nextWarmerDay - day`.
  - **Push after inspection**: the current day should become part of the future only for earlier days.
</details>

### Step 3: Use an Obviously Warmer Top Day

Before the full cleanup rule exists, there is still one easy case you can already solve: if the top of `futureLine` is immediately warmer than the current day, that top index is the answer.

This step teaches how the stack turns an index into a wait count. It works on inputs where the nearest future day is already the right answer, like steadily rising temperature runs.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["3:60"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": null,
    "label": "Consider `[30,40,50,60]` from right to left. Day 3 is `60`, so it joins the line first."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["3:60", "2:50"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "push",
    "label": "Day 2 is `50`. The top guest `60` is already warmer, so the wait is `1`, then day 2 joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["3:60", "2:50", "1:40", "0:30"], "color": "orange", "activeIndices": [3], "pointers": [{ "index": 3, "label": "top" }] }
    ],
    "action": "done",
    "label": "The same pattern continues for days 1 and 0. Final answer: `[1,1,1,0]`."
  }
]
:::

:::stackblitz{file="step3-problem.ts" step=3 total=4 solution="step3-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Measure index distance**: the wait is `futureDayIndex - day`, not a temperature difference.
  - **Check that the top is truly warmer**: a future day that is cooler or equal cannot answer the question.
  - **This step is intentionally limited**: it handles direct warmer neighbors and rising runs, not blocked candidates yet.
</details>

### Step 4: Kick Out Blocked Days First

Now teach the full monotonic rule. Before reading the answer, pop every future day whose temperature is less than or equal to `temperatures[day]`. Those blocked days can never be the first warmer answer for this day or any earlier day.

After cleanup, the top of the line is finally trustworthy. If it exists, it is the nearest true warmer day. If the line is empty, the default `0` stays.

:::trace-sq
[
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["2:71"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": null,
    "label": "Consider `[70,72,71]` from right to left. Day 2 is `71`, so it joins the line first."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["1:72"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
    ],
    "action": "pop",
    "label": "Day 1 is `72`. The future `71` is not warmer, so it gets kicked out. Day 1 keeps `0` and joins the line."
  },
  {
    "structures": [
      { "kind": "stack", "label": "futureLine", "items": ["1:72", "0:70"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
    ],
    "action": "done",
    "label": "Day 0 is `70`. The surviving top guest `72` is now the nearest true warmer day, so the final answer is `[1,0,0]`."
  }
]
:::

:::stackblitz{file="step4-problem.ts" step=4 total=4 solution="step4-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

  - **Use `<=`, not `<`**: an equal-temperature future day is not warmer, so it must be removed too.
  - **Cleanup happens before reading the answer**: otherwise you may measure the gap to a day that is too cool to help.
  - **Push after answering**: the current day becomes part of the future line only for earlier days.
</details>

## Common Misconceptions

**"I should store temperatures directly in the stack."** That loses the day distance. The stack needs indices so you can compute `nextWarmerDay - day`.

**"An equal temperature should count as warmer enough."** The problem says warmer, not warmer-or-equal. Equal temperatures must be popped away just like cooler ones.

**"The stack should keep every future day."** No. The whole optimization comes from removing future days that have already been made irrelevant by a nearer, hotter day.

**"I should scan from left to right because the array is written that way."** Left-to-right makes you search for the future before you have organized it. Right-to-left lets the stack already represent the future when each day asks its question.

## Complete Solution

:::stackblitz{file="solution.ts" step=4 total=4 solution="solution.ts"}
