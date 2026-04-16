## 1. Overview

Stacks and queues are the first data structures where the order of access is the whole algorithm. If the newest unfinished thing must act next, use a stack. If the oldest waiting thing must act next, use a queue. Once that choice is right, a lot of "design" problems become almost mechanical.

This topic sits on top of [Arrays & Strings](/fundamentals/arrays-strings), [Hash Maps & Sets](/fundamentals/hash-maps), [Two Pointers](/fundamentals/two-pointers), [Sliding Window](/fundamentals/sliding-window), and [Linked Lists](/fundamentals/linked-lists): you already know how to scan once, preserve an invariant, and let a small amount of state replace repeated work.

The three building-block levels cover plain order discipline (LIFO vs FIFO), augmented structures that remember extra information or reverse lazily, and monotonic watchlists that settle "who gets resolved next?" problems in one pass. On your current path, the existing linked study guide here is [Implement Queue using Stacks](/dsa/problems/232).

## 2. Core Concept & Mental Model

Picture a busy office. There is an **undo history** in the editor, a **printer queue** by the copier, and a **resolution watchlist** for requests still waiting on some future event. The undo history exposes the most recent unfinished change first, the printer queue serves the oldest waiting job first, and the watchlist keeps only the unresolved items that still matter.

That is the whole topic. An undo history is last-in, first-out. A printer queue is first-in, first-out. A watchlist is a stack kept in a deliberate order so one new arrival can settle many older unresolved arrivals at once.

### Understanding the Analogy

#### The Setup

You are working at the office. Edits land in the undo history as you make them. Print jobs arrive and wait in the printer queue. Some situations are more subtle: an item on the watchlist is waiting for something warmer, taller, larger, or later to appear. The only thing that determines correctness is which waiting item becomes eligible first.

#### The Undo History and Printer Queue

The undo history works because only the most recent edit is reachable. If you need the freshest unfinished thing, that restriction is perfect, not a limitation. Undo histories, bracket matching, and expression evaluation all want the most recent unresolved item first.

The printer queue solves the opposite problem. When fairness matters, new arrivals must wait behind older ones. Sometimes the queue is built directly. Sometimes it is simulated with two stacks: one stack for incoming jobs, one stack for ready-to-print jobs. When the ready stack runs dry, you pour all incoming jobs over once, reversing them into oldest-first order.

#### The Resolution Watchlist

The watchlist is not just any stack. It is ordered so the newest arrival can immediately dismiss everyone it has just resolved. If an item is waiting for the next taller value, then smaller values at the top of the watchlist leave the moment that taller value arrives. Each item joins once and leaves once, so the whole process stays linear.

Without the watchlist, you would re-check every earlier item again and again. With it, unresolved items stay in exactly the order that makes the next arrival decisive.

#### Why These Approaches

These structures work because they encode the problem's priority rule directly. A stack says "most recent first." A queue says "oldest first." A monotonic stack says "keep only unresolved candidates in the order that makes future decisions immediate." When the access rule matches the problem's logic, each item is touched a constant number of times instead of being revisited in nested loops.

### How I Think Through This

When I see a problem in this family, the first question I ask is not "what data structure do I know?" but "which unfinished thing should act next?" If the newest unfinished thing should be undone or closed first, that is a stack signal. If the oldest waiting thing must be served first, that is a queue signal. If every new item needs to settle some earlier unresolved items like "next warmer day," "next taller building," or "does this convoy catch the one ahead?," that is a monotonic-stack signal. I also check whether I need more than the plain top or front: if I need the current minimum, or I need FIFO behavior using only stack operations, then I need shadow state or lazy transfer on top of the basic structure.

Take `edit(4), edit(2), undo(), edit(7), peek()`.

:::trace-sq
[
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [], "color": "blue" },
{ "kind": "queue", "label": "print order", "items": [], "color": "green" }
],
"action": null,
"label": "Start with an empty history. No edits to undo, nothing waiting in print order."
},
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [4], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "queue", "label": "print order", "items": [4], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "next" }] }
],
"action": "push",
"label": "Apply edit 4. The newest edit is now the next one undo can reach."
},
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [4, 2], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "queue", "label": "print order", "items": [2, 4], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "next" }] }
],
"action": "push",
"label": "Apply edit 2. The history makes the latest edit, 2, reachable before 4."
},
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [4], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "queue", "label": "print order", "items": [4], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "next" }] }
],
"action": "pop",
"label": "Undo once. The newest unfinished edit, 2, is the first one removed."
},
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [4, 7], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "queue", "label": "print order", "items": [7, 4], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "next" }] }
],
"action": "push",
"label": "Apply edit 7. It becomes the new top immediately because undo histories are last-in, first-out."
},
{
"structures": [
{ "kind": "stack", "label": "undo history", "items": [4, 7], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "queue", "label": "print order", "items": [7, 4], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "next" }] }
],
"action": "peek",
"label": "Peek. The answer is whatever sits on top: 7. The whole decision came from the access rule, not from searching."
}
]
:::

---

## 3. Building Blocks

### Level 1: Order Discipline

**Why this level matters**

Before stack and queue problems get clever, they get strict. The first skill is recognizing which end is allowed to act. If that rule is wrong, every later optimization is built on the wrong behavior. Level 1 is about making LIFO and FIFO feel inevitable instead of memorized.

**How to think about it**

Use the undo history when the freshest unfinished thing should close first. That is why stacks power undo, bracket matching, and nested structure problems: the most recent opener is the one that must be closed next. Use the printer queue when fairness matters and earlier arrivals must leave first. The key is to stop thinking about "an array I can access anywhere" and start thinking about "a structure that intentionally hides everything except the correct next item."

The undo history and the printer queue look similar when they have only one item. The difference appears the moment several items are waiting. In an undo history, every new arrival jumps in front of older unfinished work. In a printer queue, every new arrival waits behind older work. That one rule determines the whole trace.

**Walking through it**

Ticket events: `ARRIVE Ana, ARRIVE Ben, SERVE, ARRIVE Cam, SERVE`.

:::trace-sq
[
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": [], "color": "green" }
],
"action": null,
"label": "The printer queue starts empty."
},
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": ["Ana"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "enqueue",
"label": "Ana's print job arrives. With one job, front and back are the same spot."
},
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": ["Ana", "Ben"], "color": "green", "activeIndices": [0, 1], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "enqueue",
"label": "Ben's job arrives behind Ana's. The queue preserves arrival order."
},
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": ["Ben"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "dequeue",
"label": "Print once. Ana's job leaves because it has waited the longest."
},
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": ["Ben", "Cam"], "color": "green", "activeIndices": [0, 1], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "enqueue",
"label": "Cam's job arrives, but cannot jump ahead of Ben's."
},
{
"structures": [
{ "kind": "queue", "label": "printer queue", "items": ["Cam"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "dequeue",
"label": "Print again. Ben's job leaves next because it is now at the front."
}
]
:::

**The one thing to get right**

Do not mix the service ends. A stack pushes and pops from the same end. A queue adds at the back and removes from the front. If you accidentally remove a queue item from the back, newer arrivals cut in line and the output is silently wrong.

**Visualization**

The trace above is the whole idea made visible: the reachable item changes only because the service rule changes.

:::stackblitz{step=1 total=3 exercises="step1-exercise1-problem.ts,step1-exercise2-problem.ts,step1-exercise3-problem.ts" solutions="step1-exercise1-solution.ts,step1-exercise2-solution.ts,step1-exercise3-solution.ts"}

> "Stack = newest unfinished thing first. Queue = oldest waiting thing first."

**→ Bridge to Level 2**

Plain undo histories and printer queues only answer "what is next?" Level 2 exists because many problems ask for more: the current minimum, or FIFO behavior built out of stack-only operations without redoing all the work each time.

### Level 2: Shadow State and Lazy Transfer

**Why this level matters**
Some stack and queue problems are really invariant problems wearing a data-structure costume. A plain stack cannot tell you the current minimum in O(1) unless you store extra information as items arrive. A plain stack also cannot act like a queue unless you delay and batch the reversal work. Level 2 is where stacks stop being containers and start carrying carefully chosen metadata.

**How to think about it**
For a minimum-tracking undo history, every edit carries a shadow badge: "what is the lowest value among everything beneath me, including me?" Then the top entry already knows the current answer. No scanning is needed on the way back down, because the answer was recorded on the way up.

For a printer queue built from stacks, separate intake from printing. New jobs pile onto the incoming stack. Jobs are printed from the outgoing stack. Only when the outgoing stack is empty do you pour the whole incoming stack over. That one reversal reveals the oldest job first. The rule is lazy on purpose: if the outgoing stack already has jobs ready to print, pouring again would break FIFO order and waste work.

**Walking through it**
Desk events: `ARRIVE Ana, ARRIVE Ben, FRONT, SERVE, ARRIVE Cam, SERVE`.

:::trace-sq
[
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": [], "color": "blue" },
{ "kind": "stack", "label": "ready to print", "items": [], "color": "orange" },
{ "kind": "queue", "label": "printer queue view", "items": [], "color": "green" }
],
"action": null,
"label": "Both stacks start empty, so the effective printer queue is empty too."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": ["Ana"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "stack", "label": "ready to print", "items": [], "color": "orange" },
{ "kind": "queue", "label": "printer queue view", "items": ["Ana"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "enqueue",
"label": "Ana's print job arrives. New jobs always land on the incoming stack."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": ["Ana", "Ben"], "color": "blue", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "stack", "label": "ready to print", "items": [], "color": "orange" },
{ "kind": "queue", "label": "printer queue view", "items": ["Ana", "Ben"], "color": "green", "activeIndices": [0, 1], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "enqueue",
"label": "Ben's job arrives. It sits above Ana on the incoming stack, but still behind her in queue view."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": [], "color": "blue" },
{ "kind": "stack", "label": "ready to print", "items": ["Ben", "Ana"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "queue", "label": "printer queue view", "items": ["Ana", "Ben"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "transfer",
"label": "Front is requested while the outgoing stack is empty, so pour everything over once. The oldest job, Ana, rises to the top of the outgoing stack."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": [], "color": "blue" },
{ "kind": "stack", "label": "ready to print", "items": ["Ben", "Ana"], "color": "orange", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] },
{ "kind": "queue", "label": "printer queue view", "items": ["Ana", "Ben"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "peek",
"label": "Front is now just the top of the outgoing stack: Ana."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": [], "color": "blue" },
{ "kind": "stack", "label": "ready to print", "items": ["Ben"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "queue", "label": "printer queue view", "items": ["Ben"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "dequeue",
"label": "Print once. Ana leaves from the outgoing stack, and Ben becomes the front."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": ["Cam"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "stack", "label": "ready to print", "items": ["Ben"], "color": "orange", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "queue", "label": "printer queue view", "items": ["Ben", "Cam"], "color": "green", "activeIndices": [0, 1], "pointers": [{ "index": 0, "label": "front" }, { "index": 1, "label": "back" }] }
],
"action": "enqueue",
"label": "Cam's job arrives, but stays on the incoming stack because Ben is still ready to print."
},
{
"structures": [
{ "kind": "stack", "label": "incoming jobs", "items": ["Cam"], "color": "blue", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] },
{ "kind": "stack", "label": "ready to print", "items": [], "color": "orange" },
{ "kind": "queue", "label": "printer queue view", "items": ["Cam"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "front" }, { "index": 0, "label": "back" }] }
],
"action": "dequeue",
"label": "Print again. Ben leaves first. Cam will not be transferred until the outgoing stack runs empty."
}
]
:::

**The one thing to get right**
Transfer only when the outgoing stack is empty. If you pour new arrivals onto a non-empty outgoing stack, newer jobs leapfrog older jobs and FIFO order breaks immediately. The same mindset applies to minimum stacks: record the shadow minimum when each value arrives, not later when you need it.

**Visualization**
The trace makes the invariant visible: front items live on the outgoing stack, brand-new arrivals wait untouched on the incoming stack, and a full pour happens only at the boundary where the outgoing stack empties.

:::stackblitz{step=2 total=3 exercises="step2-exercise1-problem.ts,step2-exercise2-problem.ts,step2-exercise3-problem.ts" solutions="step2-exercise1-solution.ts,step2-exercise2-solution.ts,step2-exercise3-solution.ts"}

> "Record answers on the way in, and reverse lazily only at the boundary where you must."

**→ Bridge to Level 3**
Level 2 lets you answer top, front, and minimum efficiently. Level 3 exists because some problems are not about serving the next item at all. They are about keeping a watchlist of unresolved items until one future arrival settles them.

### Level 3: Monotonic Watchlists

**Why this level matters**
Problems like daily temperatures, stock span, car fleets, and many skyline questions look quadratic at first because each item seems to need to compare against many later items. A monotonic stack compresses all unresolved work into one ordered watchlist. Each new arrival settles whatever it can settle immediately, and the rest stay waiting.

**How to think about it**
Imagine a resolver keeps a watchlist of items still waiting for some stronger future signal to arrive. The watchlist is arranged so the most recently waiting item is checked first, because that item is the easiest to resolve. When a larger value appears, everyone smaller at the top leaves the watchlist one by one because their answer has finally arrived.

The word _monotonic_ means the watchlist stays sorted in one direction. For "next greater" problems, it is usually decreasing: each new unresolved value is smaller than the one beneath it. That invariant is what makes one future arrival able to settle several older items in a single burst. The critical mechanic is that settling is a while-loop, not a single comparison.

**Walking through it**
Temperatures: `[73, 71, 74, 72, 76]`. Each day waits for the next warmer day.

:::trace-sq
[
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": [], "color": "purple" }
],
"action": null,
"label": "Start at day 0. No unresolved days yet."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [0], "pointers": [{ "index": 0, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["73@0"], "color": "purple", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
],
"action": "push",
"label": "Day 0 waits on the watchlist because no warmer day has appeared yet."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [1], "pointers": [{ "index": 1, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["73@0", "71@1"], "color": "purple", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
],
"action": "push",
"label": "71 is cooler than 73, so it can sit on top of the decreasing watchlist unresolved."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [2], "pointers": [{ "index": 2, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["74@2"], "color": "purple", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
],
"action": "pop",
"label": "74 arrives. It settles 71 first, then 73, because both are shorter and stacked at the top. Their wait lengths are now known."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [3], "pointers": [{ "index": 3, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["74@2", "72@3"], "color": "purple", "activeIndices": [1], "pointers": [{ "index": 1, "label": "top" }] }
],
"action": "push",
"label": "72 cannot settle 74, so it joins the watchlist on top as another unresolved day."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [4], "pointers": [{ "index": 4, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["76@4"], "color": "purple", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
],
"action": "pop",
"label": "76 arrives and settles 72, then 74, in one burst. One new arrival can resolve many older waiters because the watchlist stayed ordered."
},
{
"structures": [
{ "kind": "queue", "label": "days ahead", "items": ["73", "71", "74", "72", "76"], "color": "green", "activeIndices": [4], "pointers": [{ "index": 4, "label": "today" }] },
{ "kind": "stack", "label": "watchlist", "items": ["76@4"], "color": "purple", "activeIndices": [0], "pointers": [{ "index": 0, "label": "top" }] }
],
"action": "done",
"label": "Scan ends. 76 never finds a warmer future day, so it stays unresolved with answer 0."
}
]
:::

**The one thing to get right**
When a resolving arrival shows up, keep settling with a while-loop until the watchlist invariant is restored. Using a single if-statement leaves older resolved items trapped underneath the top, producing answers that are too large or still zero when they should already be known.

**Visualization**
The watchlist trace shows the real gain: each day enters once, leaves once, and unresolved days stay arranged so the next decisive arrival can clean up several at once.

:::stackblitz{step=3 total=3 exercises="step3-exercise1-problem.ts,step3-exercise2-problem.ts,step3-exercise3-problem.ts" solutions="step3-exercise1-solution.ts,step3-exercise2-solution.ts,step3-exercise3-solution.ts"}

> "Monotonic stack = unresolved waiters kept in the one order that makes future arrivals decisive."

## 4. Key Patterns

**Pattern: Convoy Compression**

**When to use**: objects move toward the same destination, faster ones may catch slower ones, and the question is how many final groups remain. Keywords: "car fleet," "arrival groups," "convoys merge," "who catches up before the target?"

**How to think about it**: sort by starting position from closest to the destination back to farthest. Compute each arrival time. Walk backward and keep a stack of fleet times. If a new car would arrive sooner than or equal to the fleet ahead, it merges into that fleet and does not create a new group. If it would arrive later, it forms a new fleet. The stack stores only unresolved arrival-time boundaries, not every car interaction.

```mermaid
graph LR
    Start[Cars sorted nearest target to farthest] --> Time[Compute each arrival time]
    Time --> Compare[Compare with fleet time ahead]
    Compare --> Merge[Earlier or equal time: merge into existing fleet]
    Compare --> NewFleet[Later time: start a new fleet]
```

**Complexity**: Time O(n log n) because of sorting, Space O(n) in the explicit stack version or O(1) extra if you only track the last fleet time.

**Pattern: Range Ownership**

**When to use**: each value needs to know the nearest greater or smaller boundary to the left or right, often to compute spans, visibility, or how wide a contribution extends. Keywords: "stock span," "next greater element," "previous smaller," "visible buildings," "how far does this bar own?"

**How to think about it**: instead of asking every element to scan outward, let the monotonic stack remember only the candidates that still own unresolved territory. When a new value arrives, it strips ownership away from values it dominates and reveals the nearest surviving boundary underneath. Spans and areas fall out of those ownership boundaries directly.

```mermaid
graph TD
    Value[Current value arrives] --> Pop[Pop dominated owners]
    Pop --> Boundary[Top that remains is nearest surviving boundary]
    Boundary --> Span[Use boundary to compute span or area]
    Span --> Push[Push current value as new unresolved owner]
```

**Complexity**: Time O(n), Space O(n).

---

## 5. Decision Framework

**Concept Map**

```mermaid
graph TD
    SQ[Stack and Queue]
    SQ --> Stack[Stack: LIFO]
    SQ --> Queue[Queue: FIFO]
    SQ --> Mono[Monotonic watchlist]
    Stack --> Undo[Undo and nested closure]
    Stack --> Augment[Shadow state like current minimum]
    Queue --> Fair[Oldest waiting item acts first]
    Queue --> Lazy[Two-stack lazy transfer]
    Mono --> Next[Next greater or smaller]
    Mono --> Span[Span and ownership]
    Mono --> Fleet[Convoy compression]
```

**Complexity table**

| Technique            | Core operations               | Time           | Space | Notes                               |
| -------------------- | ----------------------------- | -------------- | ----- | ----------------------------------- |
| Plain stack          | `push`, `pop`, `peek`         | O(1)           | O(n)  | LIFO access                         |
| Plain queue          | `enqueue`, `dequeue`, `front` | O(1)           | O(n)  | FIFO access                         |
| Min stack            | push, pop, current min        | O(1)           | O(n)  | Store shadow minimum per arrival    |
| Queue via two stacks | enqueue, dequeue, front       | Amortized O(1) | O(n)  | Each item moves stacks at most once |
| Monotonic stack      | push + while-pop              | O(n) total     | O(n)  | Each item enters and leaves once    |
| Convoy compression   | sort + monotonic compare      | O(n log n)     | O(n)  | Sorting dominates                   |

**Decision tree**

```mermaid
graph TD
    Start[Problem has waiting or unresolved items] --> Q1{Who should act next?}
    Q1 -- Newest unfinished item --> UseStack[Use a stack]
    Q1 -- Oldest waiting item --> UseQueue[Use a queue]
    Q1 -- Depends on a future greater or smaller arrival --> UseMono[Use a monotonic stack]
    UseStack --> Q2{Need more than the top item?}
    Q2 -- Yes, need running minimum or maximum --> MinStack[Augment each push with shadow state]
    Q2 -- No --> PlainStack[Plain stack]
    UseQueue --> Q3{Only stack operations allowed?}
    Q3 -- Yes --> TwoStacks[Two stacks with lazy transfer]
    Q3 -- No --> PlainQueue[Plain queue]
    UseMono --> Q4{Need spans, next greater, or fleets?}
    Q4 -- Next greater or smaller --> NextGreater[Monotonic watchlist]
    Q4 -- Convoys merging by arrival time --> FleetPattern[Sort then compare fleet times]
```

**Recognition signals table**

| Problem keywords                                                 | Technique                         |
| ---------------------------------------------------------------- | --------------------------------- |
| "undo", "nested", "matching opener", "evaluate from most recent" | Stack                             |
| "serve in arrival order", "oldest first", "waiting line"         | Queue                             |
| "queue using stacks", "lazy transfer", "amortized O(1)"          | Two-stack queue                   |
| "current minimum at every step", "min stack", "max stack"        | Augmented stack with shadow state |
| "next warmer", "next taller", "previous smaller", "stock span"   | Monotonic stack                   |
| "cars merge before target", "arrival groups", "fleet count"      | Sort + convoy compression         |

**When NOT to use**

Do not force a stack or queue when arbitrary middle access matters. If the problem needs random lookup by value, a hash map is usually the missing tool. If the question is about a contiguous range with both boundaries moving, sliding window is a better fit. If comparisons halve the search space, binary search is the right model, not a waiting-line model.

## 6. Common Gotchas & Edge Cases

- Mixing the service end. What goes wrong: a queue accidentally behaves like a stack. Why it is tempting: arrays let you push and pop from the same side easily. Fix: name the front and back explicitly and trace two or three arrivals on paper before coding.
- Reversing too often in a two-stack queue. What goes wrong: newer arrivals leap ahead or performance degrades. Why it is tempting: every `front` or `serve` feels like it should "prepare" the structure. Fix: transfer only when the outgoing stack is empty.
- Forgetting shadow state on push. What goes wrong: `getMin()` or `getMax()` quietly turns into O(n) scans. Why it is tempting: the plain stack already stores the values. Fix: attach the current best value at insertion time so the top item already knows the answer.
- Using `if` instead of `while` in monotonic stack problems. What goes wrong: only the top waiter gets settled, leaving older resolved waiters stuck underneath. Why it is tempting: one comparison feels sufficient. Fix: keep popping until the invariant is restored.
- Storing values when you really need positions. What goes wrong: you know which future value resolved something, but you cannot compute distance or span. Why it is tempting: values are easier to read than indices. Fix: store indices whenever the answer depends on how far apart two items are.

Edge cases to check:

- Empty input.
- Single item.
- All items identical.
- Strictly increasing sequence.
- Strictly decreasing sequence.
- Repeated queries on an empty stack or queue.

Debugging tips:

- Print the stack or queue after every operation for one tiny example.
- For monotonic stacks, print the unresolved watchlist as indices plus values, not values alone.
- In two-stack queues, print both stacks separately; most bugs are obvious once you see whether the outgoing stack was filled too early.
- When answers involve distances, print both the stored index and the current index before assigning the result.
