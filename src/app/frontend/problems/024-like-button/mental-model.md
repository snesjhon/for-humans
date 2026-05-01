## Overview

This problem looks like a styling exercise, but the real lesson is state modeling. A Like button changes its appearance when the user hovers it and when the user toggles it on or off, yet those visual changes do not all belong in state. If you store the display pieces themselves, like label text, icon variant, or tone, they can drift apart and create impossible snapshots such as a filled heart that still says "Like".

The goal is to separate what the button actually knows from what the button merely shows. We will build that in two stages: first the persistent liked choice, then the temporary hover preview layered on top of it.

## Core Concept and Mental Model

### The Control Panel

Think of the button like a small control panel with two switches hidden behind the surface.

- `liked` is the locked switch that records the user's choice
- `hovered` is the momentary switch that flips only while the pointer is over the button

Everything else is just the panel surface reacting to those switches. The label, icon, `aria-pressed`, and tone are indicator lights. They should not each get their own memory. They should simply reflect the current switch positions.

Once you think of the button this way, the rule becomes clear: store the switches, derive the lights.

### What the button actually knows

The button only has two real facts:

- whether the user has liked it
- whether the pointer is currently hovering it

Those facts can change independently. A user can like the button without hovering it. A user can hover the button without liking it. A user can hover a button that was already liked earlier. Because those dimensions vary separately, they deserve separate state.

Everything visible comes from combining those facts into a render snapshot:

- `label`: `'Liked'` or `'Like'`
- `icon`: `'heart-filled'` or `'heart-outline'`
- `ariaPressed`: mirrors `liked`
- `tone`: computed from the pair `{ liked, hovered }`

### Why copied display state breaks

The broken version usually stores the indicators themselves:

```ts
const [liked, setLiked] = useState(false);
const [label, setLabel] = useState('Like');
const [icon, setIcon] = useState<'outline' | 'filled'>('outline');
const [tone, setTone] = useState<'neutral' | 'preview' | 'active'>('neutral');
```

That looks explicit, but it is really the same snapshot copied across several boxes. Now every interaction has to update all of them in perfect sync. One click has to change `liked`, `label`, and `icon` together. One pointer leave has to remove hover styling without erasing the already-liked state. Missing one write creates a contradiction because the indicators are no longer being driven from the same facts.

### Two dimensions, one snapshot

The hardest part of this button is that hover and liked are different kinds of truth. `liked` is persistent. `hovered` is temporary. If you collapse them into one stored display field, one dimension starts overwriting the other.

That is why `pointerLeave()` is such a useful test. If leaving the button resets everything back to neutral, your state shape forgot that the user had already liked it. A correct model removes only the hover fact, then recomputes the visual snapshot from the remaining facts.

## How I Think Through This

I start by asking what the user interaction changed in the domain, not on the screen. A click changes one durable fact: whether the button is liked. Hover changes one temporary fact: whether the pointer is currently over the button. If I find myself storing the label, icon, or tone directly, I know I am storing paint instead of truth.

From there I test the two dimensions separately. First, does toggling `liked` automatically update every persistent visual? If not, the facts and the indicators are living in different places. Second, does hover preview the button without overwriting the liked choice? If pointer leave wipes out the active state, I know the model collapsed temporary and persistent state into one field.

The final implementation should feel uneventful. Toggle one fact. Flip one temporary fact on enter and leave. Derive the whole appearance from the current snapshot. When the state model is right, the rendering logic becomes simple because there is no synchronization work left to do.

---

## Building the Solution

### Step 1: Keep one source of truth for the liked snapshot

The first repair is to stop storing the persistent visuals directly. A click does not create four new truths. It changes one fact: whether the button is liked. Once that fact is stable, the label, icon, and pressed state become straightforward render outputs instead of extra bookkeeping.

This step removes the most obvious drift bug. The button can no longer end up with `liked === true` while still showing the unliked label, because the label is computed from the same snapshot. The implementation gets smaller at the same time, which is usually a good signal that the state shape improved.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- Ask which values are user facts and which are just display choices.
- A click should only need to update one persistent piece of state.
- Derive `label`, `icon`, and `ariaPressed` from `liked`.

### Step 2: Separate persistent choice from temporary hover preview

Hover introduces a second dimension, but it should not replace the first one. The button still needs to remember whether the user liked it after the pointer leaves. That means `hovered` belongs in state as its own temporary fact, while the tone belongs in the derived paint layer.

This step removes the impossible transition where `pointerLeave()` wipes out the active style of an already liked button. Instead of mutating a stored tone directly, we compute tone from the pair `{ liked, hovered }`. That preserves both the long-lived choice and the short-lived preview in one coherent snapshot.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Hover is real state, but it is not the same kind of fact as liked.
- If leaving the button resets everything, the state shape is collapsing two dimensions into one.
- Compute tone from both facts together instead of storing tone separately.

### Final Solution

The final hook stores only the facts that can actually change over time and derives the full appearance from the current snapshot. That guarantees the label, icon, pressed state, and tone can never disagree with each other.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
