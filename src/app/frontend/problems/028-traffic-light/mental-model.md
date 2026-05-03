## The Problem

Build a traffic light that loops forever through this sequence:

- green
- yellow
- red

Each light should stay active for a fixed duration:

- red: `4000ms`
- yellow: `500ms`
- green: `3000ms`

You are free to style the traffic light however you want. The visual design is open-ended, but the timing logic and cleanup behavior should stay correct.

## Overview

This prompt looks like a timing exercise because the colors change after fixed delays. The real design problem is narrower: which part of the component owns the current light, and which part owns the scheduled transition to the next one?

If those two ideas blur together, the component becomes awkward fast. You start thinking in terms of "run an interval forever," but the UI does not actually need a forever process stored somewhere. It needs one current snapshot, then one scheduled handoff to the next snapshot. That distinction matters most when the component unmounts halfway through a cycle. A timer that keeps running after the component disappears has outlived the UI it was supposed to synchronize.

The clean model is to store only the current light in state, derive the active styling from that state during render, and let an effect schedule exactly one timeout for the next transition. The timeout belongs to the effect, so the cleanup function must cancel it when the effect is replaced or the component unmounts.

## Core Concept and Mental Model

### One Lamp, One Pending Handoff

Picture the traffic light as a box with one lamp currently lit and one note clipped to the side.

- `currentLight` is the lamp that is on right now
- the timeout is the note that says when to hand control to the next lamp

The note is temporary. Once the handoff happens, that note is thrown away and a new note is written for the next light. That is why `setTimeout` fits this problem better than treating the whole cycle as one opaque background process. Each render only needs one pending handoff.

### What the component actually knows

The component does not need separate booleans like `isGreen`, `isYellow`, and `isRed`. Those are all different ways of describing the same fact. Only one light can be active at a time, so the durable state should be one value:

- `'green'`
- `'yellow'`
- `'red'`

From that one fact, render can derive everything else:

- which circle looks active
- which label appears as the current status
- how long the next timeout should wait
- which light comes next

Once the state is shaped that way, the cycle becomes a small state machine instead of three separate flags that can drift into impossible combinations.

### Why cleanup is part of the mechanism

The tricky part of the prompt is the unmount question. Imagine the light is green, a timeout is already waiting to switch it to yellow, and then the component unmounts because the page changed.

What should happen?

- the UI disappears
- the pending timeout should be cleared
- no later state update should try to fire for a component that no longer exists

That means cleanup is not an optional extra. It is part of the same synchronization contract as the timeout setup. The effect says, "while this component instance exists and this light is current, schedule the next handoff." The cleanup says, "if that situation stops being true, cancel the handoff."

### Why a repeated interval is harder to reason about

A first attempt often reaches for `setInterval`, but that blurs two different questions together:

- what light is active now?
- what duration applies to this specific light?

With one interval length, you lose the per-light durations. With interval logic that mutates external counters, the timing model gets harder to inspect. A timeout tied to `currentLight` is usually simpler because the current snapshot itself tells you both what to render and how long to wait before advancing.

## How I Think Through This

I start by naming the durable truth. At any moment, what does the traffic light really know? It knows which light is active now. Everything else is either a rendering detail or a scheduled consequence of that fact.

Then I ask what should happen after render, not during render. If the current light is green, the component should schedule one future move to yellow after `3000ms`. When that move happens, state changes, React renders again, and the next effect schedules the next handoff. Yellow should hold for `500ms`, red for `4000ms`. That gives the cycle its loop without storing the loop itself.

Finally, I test the cleanup story with a concrete sequence: render, wait partway through green, unmount, advance all timers. If the component still has a pending timeout after unmount, the effect setup and teardown are not paired correctly. The goal is that once the component is gone, the cycle is gone too.

---

## Building the Solution

### Step 1: Model the traffic light as one current state

The first job is to choose a state shape that can describe the traffic light cleanly before any timing logic exists. The component should begin on green, render the three lamps, and derive which one is active from a single `currentLight` value. This is the state-shape move that makes the rest of the problem tractable.

One useful check here is to ask whether your component can ever represent two active lights at once. If the answer is yes, the state shape is still too wide. This step should make the cycle feel like a state machine with one valid snapshot at a time.

:::stackblitz{file="step1-problem.tsx" step=1 total=3 solution="step1-solution.tsx"}

**Hints**

- Only one light can be active at a time, so state should reflect that directly.
- Render can compare each light name against the current one instead of storing three booleans.
- The first snapshot should start on green.

### Step 2: Schedule the next handoff from the current light

Now teach the component to move. The important question is not "how do I make something repeat forever?" The important question is "given the current light, what single handoff should happen next, and when?"

An effect is the right place for that because the timeout is a synchronization step that depends on the rendered snapshot. Green should wait `3000ms`, yellow should wait `500ms`, and red should wait `4000ms`. If you can trace one pending timeout from each render, you are modeling the cycle clearly.

:::stackblitz{file="step2-problem.tsx" step=2 total=3 solution="step2-solution.tsx"}

**Hints**

- Think in one step, not "forever" all at once.
- The current light should tell you both the next light and the delay before switching.
- The effect should react to `currentLight`, not to unrelated rendering details.

### Step 3: Pair the timeout with cleanup so unmount stops the cycle

This final step answers the interview twist directly. When the component unmounts in the middle of a cycle, the pending timeout should not keep running in the background. The same effect that schedules the timeout needs to return a cleanup function that cancels it.

The easiest way to reason about this step is to simulate a partial cycle: render the component, wait some of the green duration, unmount, then advance the rest of the timers. If cleanup is missing, the old handoff still exists. If cleanup is correct, the timer count drops to zero when the component disappears.

:::stackblitz{file="step3-problem.tsx" step=3 total=3 solution="step3-solution.tsx"}

**Hints**

- The timeout belongs to the effect that created it.
- Cleanup should run both before the next effect replaces the old timeout and when the component unmounts.
- After unmount, there should be no pending cycle left to finish.

### Final Solution

In the finished version, the traffic light should feel mechanical and predictable. State stores only the current light. Render derives the active lamp from that state. An effect schedules one timeout for the next handoff, and cleanup clears that timeout whenever the component instance or the current snapshot changes.

That answers the unmount question cleanly: if the component disappears mid-cycle, the pending timeout is canceled, so the loop stops with the component instead of continuing in the background.

:::stackblitz{file="solution.tsx" step=3 total=3 solution="solution.tsx"}
