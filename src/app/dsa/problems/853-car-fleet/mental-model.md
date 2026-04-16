# Car Fleet - Mental Model

## The Problem

There are `n` cars going to the same destination along a one-lane road. The destination is `target` miles away.

You are given two integer arrays `position` and `speed`, both of length `n`, where `position[i]` is the position of the `i`th car and `speed[i]` is the speed of the `i`th car.

A car can never pass another car ahead of it, but it can catch up to it and drive bumper to bumper at the slower car's speed.

A car fleet is a non-empty set of cars driving at the same position and the same speed. A single car is also a fleet.

If a car catches up to a fleet exactly at the destination, it is still part of that fleet.

Return the number of car fleets that will arrive at the destination.

**Example 1:**
```
Input: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]
Output: 3
```

**Example 2:**
```
Input: target = 10, position = [3], speed = [3]
Output: 1
```

**Example 3:**
```
Input: target = 100, position = [0,2,4], speed = [4,2,1]
Output: 1
```

**Constraints:**

- `n == position.length == speed.length`
- `1 <= n <= 10^5`
- `0 < target <= 10^6`
- `0 <= position[i] < target`
- All values of `position` are unique
- `0 < speed[i] <= 10^6`

## The Toll Booth Convoy Analogy

Imagine every car is driving toward a single toll booth at the end of a one-lane road. Because the road has only one lane, nobody is allowed to overtake. A faster car behind can only do one thing: catch the slower traffic in front of it and become part of that same convoy.

That means the only question that matters is not "which car is faster?" It is "would this rear car reach the toll booth before the convoy in front of it gets there?" If yes, then it eventually closes the gap and joins that convoy before the booth. If it would arrive later, it never catches up, so it remains its own convoy.

So each front-most surviving convoy creates a kind of arrival deadline for the cars behind it. A rear car compares its own booth arrival time to the convoy ahead. If the rear car's time is earlier or equal, it gets absorbed. If its time is later, it starts a brand-new convoy with a later arrival time.

## Understanding the Analogy

### The Setup

The road order matters more than the input order. A car at mile `8` influences a car at mile `5`, but not the other way around. So before we can reason correctly, we have to line the cars up by position from back to front or front to back.

Once the cars are in road order, we stop thinking about individual speed races. The toll booth only cares about **arrival times**. A car with a shorter arrival time would eventually run into the traffic ahead because it is trying to reach the same booth sooner on a road where passing is forbidden.

### The Convoy Frontier

Start from the car closest to the toll booth. That car cannot be blocked by anyone in front, so it always forms a convoy by itself at first. Its arrival time becomes the current convoy frontier.

Now move one car backward along the road. Compute how long that car would take to reach the booth on its own.

- If this rear car would arrive **later** than the frontier, it cannot catch the convoy ahead. It becomes a new convoy, and its later arrival time becomes the new frontier.
- If this rear car would arrive **earlier or at the same time** as the frontier, it must run into the convoy ahead before or exactly at the booth. It disappears into that convoy, so the frontier does not change.

This is why the surviving convoy arrival times form a monotonic stack: as we scan backward, every new surviving convoy has a strictly later arrival time than the convoy ahead of it.

### Why This Approach

If each car simulated its movement against every car ahead, the work would explode. But once cars are sorted by position, each car only needs to compare itself against the current convoy frontier.

That turns the problem into:

1. sort cars by position
2. scan from closest to farthest
3. keep only convoy arrival times that survive

Sorting costs `O(n log n)`, and the scan is `O(n)`.

## How I Think Through This

I first zip each `position[i]` with its matching `speed[i]`, then sort those cars by position so they match the road from back to front. After that, I scan from the end of that sorted list because the car closest to `target` sets the first convoy frontier.

I keep a stack called `fleetArrivalTimes`. Its top represents the arrival time of the nearest convoy ahead of the current car. For each car, I compute `arrivalTime = (target - car.position) / car.speed`. If that time is greater than the stack top, this car cannot catch the convoy ahead, so it forms a new fleet and I push its time. Otherwise it catches the convoy ahead, so I do nothing because that convoy frontier already represents both of them.

Take `target = 12`, `position = [10,8,0,5,3]`, `speed = [2,4,1,1,3]`.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "closest to booth" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": [], "color": "orange", "emptyLabel": "no convoy frontier yet" }
    ],
    "action": null,
    "label": "After sorting by position, car `10@2` is closest to the booth, so it is processed first."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [4], "pointers": [{ "index": 4, "label": "10@2" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["1.0"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "frontier" }] }
    ],
    "action": "push",
    "label": "Car `10@2` reaches the booth in `1` hour, so it creates the first convoy frontier."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [3], "pointers": [{ "index": 3, "label": "8@4" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["1.0"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "frontier" }] }
    ],
    "action": "merge",
    "label": "Car `8@4` would also reach in `1` hour, so it catches the existing convoy exactly at the booth and merges."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "5@1" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["1.0", "7.0"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "new frontier" }] }
    ],
    "action": "push",
    "label": "Car `5@1` would arrive in `7` hours, which is later than the convoy ahead, so it cannot catch up. It starts a new convoy."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "3@3" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["1.0", "7.0"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "frontier" }] }
    ],
    "action": "merge",
    "label": "Car `3@3` would arrive in `3` hours, so it runs into the `7`-hour convoy ahead before the booth and merges into it."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "3@3", "5@1", "8@4", "10@2"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "0@1" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["1.0", "7.0", "12.0"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "new frontier" }] }
    ],
    "action": "done",
    "label": "Car `0@1` would arrive in `12` hours, later than the convoy ahead, so it forms the third convoy. Final answer: `3`."
  }
]
:::

## Building the Algorithm

### Step 1: Handle the Trivial Road

Before we build any convoy logic, handle the simplest roads directly. If there are no cars, there are no fleets. If there is one car, that single car is one fleet.

This is a real learner-owned step because it establishes the return shape of the function without sneaking in sorting or stack machinery.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": [], "color": "blue", "emptyLabel": "empty road" },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": [], "color": "orange", "emptyLabel": "no fleets" }
    ],
    "action": "done",
    "label": "If the road is empty, the fleet count is immediately `0`."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["3@3"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "only car" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["convoy"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "one fleet" }] }
    ],
    "action": "done",
    "label": "With one car, that car is the whole convoy, so the answer is `1`."
  }
]
:::

:::stackblitz{file="step1-problem.ts" step=1 total=4 solution="step1-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Return early for tiny inputs**: do not force sorting and scanning when the answer is already known.
- **A single car is still a fleet**: the problem definition explicitly counts it.
- **This step is only about trivial roads**: no pairing, sorting, or time math yet.
</details>

### Step 2: Line the Cars Up by Road Position

Now build the actual road order. Each `position[i]` must stay attached to its matching `speed[i]`, so zip them into one array of car records and sort by position.

After sorting, the last car in the array is the one closest to the booth. That is exactly where the convoy scan will begin in the next step.

For now, keep the behavior intentionally simple: after the trivial early return, just return `cars.length`. That is enough for inputs where every car remains separate, and it proves the pairing and sort structure exists without yet introducing the convoy frontier.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "input order", "items": ["10@2", "8@4", "0@1"], "color": "blue", "activeIndices": [0, 2], "pointers": [{ "index": 0, "label": "unsorted" }] },
      { "kind": "queue", "label": "road order", "items": ["0@1", "8@4", "10@2"], "color": "green", "activeIndices": [2], "pointers": [{ "index": 2, "label": "closest" }] }
    ],
    "action": "sort",
    "label": "Step 2 turns matching `position` and `speed` values into a sorted road lineup."
  }
]
:::

:::stackblitz{file="step2-problem.ts" step=2 total=4 solution="step2-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Zip before sorting**: position and speed must travel together.
- **Sort by position, not speed**: road order decides who can block whom.
- **Closest car ends up last**: that makes the later reverse scan natural.
</details>

### Step 3: Build the Convoy Frontier Stack

Now add the real scan shape. Walk the sorted cars from right to left, compute each car's solo arrival time, and push that time onto `fleetArrivalTimes`.

At this stage, every processed car still becomes its own fleet. That is deliberate. This step is only about building the reverse traversal and arrival-time bookkeeping that the final merge rule will use.

So after the loop, `fleetArrivalTimes.length` is just the number of processed cars. That already solves inputs where no car ever catches another one.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "4@1", "8@1"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "start here" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": [], "color": "orange", "emptyLabel": "no frontiers yet" }
    ],
    "action": null,
    "label": "Scan from the car closest to the booth toward the back of the road."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@1", "4@1", "8@1"], "color": "blue", "activeIndices": [2, 1, 0] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["4.0", "8.0", "12.0"], "color": "orange", "activeIndices": [2], "pointers": [{ "index": 2, "label": "top" }] }
    ],
    "action": "push",
    "label": "If every car is slower the farther back it starts, nobody catches anyone, so every arrival time survives as its own fleet."
  }
]
:::

:::stackblitz{file="step3-problem.ts" step=3 total=4 solution="step3-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Arrival time is distance divided by speed**: use `(target - position) / speed`.
- **Scan right to left**: the nearest convoy ahead must already be known when you inspect a rear car.
- **This step does not merge yet**: it only builds the traversal and time stack.
</details>

### Step 4: Merge Cars That Catch the Convoy Ahead

Now add the one rule that turns raw arrival times into real fleets.

Look at the current car's `arrivalTime` and compare it to the top of `fleetArrivalTimes`, which represents the convoy directly ahead.

- If the stack is empty, this car obviously starts a fleet.
- If `arrivalTime` is **greater** than the top time, this car arrives later and cannot catch the convoy ahead, so it forms a new fleet and gets pushed.
- Otherwise, this car would arrive earlier or at the same time, so it catches that convoy before or exactly at the booth. It merges, and nothing new gets pushed.

The remaining stack size is the fleet count.

:::trace-sq
[
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@4", "2@2", "4@1"], "color": "blue", "activeIndices": [2], "pointers": [{ "index": 2, "label": "4@1" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["6.0"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "frontier" }] }
    ],
    "action": "push",
    "label": "The front car `4@1` creates a convoy that reaches the booth in `6` hours."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@4", "2@2", "4@1"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "2@2" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["6.0"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "same frontier" }] }
    ],
    "action": "merge",
    "label": "Car `2@2` also reaches in `4` hours, so it catches the `6`-hour convoy ahead and merges instead of forming a new fleet."
  },
  {
    "structures": [
      { "kind": "queue", "label": "road order", "items": ["0@4", "2@2", "4@1"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "0@4" }] },
      { "kind": "stack", "label": "fleetArrivalTimes", "items": ["6.0"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "still one fleet" }] }
    ],
    "action": "done",
    "label": "Car `0@4` would arrive in `3` hours, so it also gets absorbed. Final fleet count: `1`."
  }
]
:::

:::stackblitz{file="step4-problem.ts" step=4 total=4 solution="step4-solution.ts"}

<details>
  <summary>Hints & gotchas</summary>

- **Equal times still merge**: catching the convoy exactly at the booth still counts as one fleet.
- **Do not compare speeds directly**: fleets are decided by arrival times after sorting by position.
- **The stack is monotonic**: every pushed fleet time must be strictly larger than the one ahead of it.
</details>

## Common Misconceptions

**"The fastest car should always become its own fleet."** Speed alone does not decide anything on a one-lane road. A fast rear car can still get trapped behind a slower convoy ahead. The right mental model is arrival time relative to the convoy frontier.

**"If two cars meet exactly at the toll booth, they should count as two fleets."** The prompt says that catching up exactly at the destination still makes them one fleet. Equal arrival times merge into the same convoy.

**"I should compare every car against every car ahead of it."** You only need the nearest surviving convoy frontier ahead. Once a convoy exists, its arrival time summarizes everything the rear car needs to know.

**"Sorting by speed is enough because faster cars catch slower cars."** Blocking depends on road position first. A slower car only matters if it is physically ahead on the road. The correct mental model is sorted position, then compare arrival times.

## Complete Solution

:::stackblitz{file="solution.ts" step=4 total=4 solution="solution.ts"}
