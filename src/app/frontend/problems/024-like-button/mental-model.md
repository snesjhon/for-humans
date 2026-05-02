## Overview

At first glance, this looks like a small UI styling problem. The button changes when you hover it, and it changes when you click it, so it is tempting to store every visible piece directly: the label, the icon, and the tone. That approach feels straightforward at first, but it makes the button harder to reason about because several pieces of state now have to stay synchronized.

The better starting question is: what does the button actually know, and what is it only showing? Work through the problem in two passes. First, model the persistent liked choice. Then layer on the temporary hover preview without letting it overwrite the liked state.

## Core Concept and Mental Model

### The Control Panel

Use a simple picture in your head: the button is a tiny control panel with two switches behind the surface.

- `liked` is the locked switch that records the user's choice
- `hovered` is the momentary switch that flips only while the pointer is over the button

Everything else is just the panel reacting to those switches. The label, icon, `aria-pressed`, and tone are like indicator lights on the surface. They do not need their own memory if they can be read from the switch positions.

If that picture feels clear, the implementation rule gets clearer too: store the switches, derive the lights.

### What the button actually knows

Before writing code, list the real facts the button can hold onto:

- whether the user has liked it
- whether the pointer is currently hovering it

These facts change independently. A user can like the button without hovering it. A user can hover it without liking it. A user can also hover a button that was already liked earlier. That is a good sign that these are separate dimensions, so they should stay separate in state.

Then ask which visible pieces can be computed from those facts during render:

- `label`: `'Liked'` or `'Like'`
- `icon`: `'heart-filled'` or `'heart-outline'`
- `ariaPressed`: mirrors `liked`
- `tone`: computed from the pair `{ liked, hovered }`

### Why copied display state breaks

If you are not sure whether you are storing too much, look at a version like this:

```ts
const [liked, setLiked] = useState(false);
const [label, setLabel] = useState('Like');
const [icon, setIcon] = useState<'outline' | 'filled'>('outline');
const [tone, setTone] = useState<'neutral' | 'preview' | 'active'>('neutral');
```

This looks explicit, but it is really one snapshot copied into several boxes. Now every interaction has to keep all of them aligned. A click has to update `liked`, `label`, and `icon` together. Pointer leave has to remove the hover preview without accidentally erasing the already-liked state. If one write is forgotten, the UI can contradict itself because the visual pieces are no longer being driven from the same facts.

### Two dimensions, one snapshot

The key tension in this problem is that hover and liked are different kinds of truth. `liked` is persistent. `hovered` is temporary. If both of them get flattened into one stored display field, one dimension starts overwriting the other.

Use `pointerLeave()` as a test case. Imagine the user already clicked the button, then hovered it, then moved away. What should disappear, and what should remain? Only the hover preview should go away. The liked choice should still be there. If leaving the button resets everything to neutral, the state shape is not separating temporary and persistent facts cleanly enough.

## How I Think Through This

When working through this kind of UI, start with the domain change, not the visual change. A click changes one durable fact: whether the button is liked. Hover changes one temporary fact: whether the pointer is currently over the button. If you catch yourself storing the label, icon, or tone directly, pause and ask whether you are storing paint instead of truth.

From there, test each dimension on its own. First, if `liked` changes, do all of the persistent visuals follow from that automatically? If not, the facts and the indicators are living in different places. Second, can hover preview the button without overwriting the liked choice? If pointer leave wipes out the active state, the model is probably collapsing temporary and persistent behavior into one field.

The target feeling is that the implementation becomes boring. Toggle one fact. Flip one temporary fact on enter and leave. Derive the whole appearance from the current snapshot. If the state model is right, the render logic usually gets simpler because there is less synchronization work to do.

---

## Building the Solution

### Step 1: Keep one source of truth for the liked snapshot

Start by asking what a click actually changes. It does not create a new label, a new icon, and a new pressed state as separate truths. It changes one durable fact: whether the button is liked. Once you store only that fact, the rest of the persistent UI can be read from it at render time.

One useful check here is to imagine the button right after a click. If `liked` is `true`, what should the label say? What icon should it show? If those answers come from separate state variables, they can drift apart. If they come from `liked`, they stay in sync automatically. That is the direction this step should push you toward.

:::stackblitz{file="step1-problem.ts" step=1 total=2 solution="step1-solution.ts"}

**Hints**

- Ask which values are user facts and which are just display choices.
- A click should only need to update one persistent piece of state.
- Derive `label`, `icon`, and `ariaPressed` from `liked`.

### Step 2: Separate persistent choice from temporary hover preview

Now add hover, but treat it as a different kind of fact. `liked` is the user's choice, so it should survive after the pointer leaves. `hovered` is only a temporary preview, so it should turn on during pointer enter and turn off during pointer leave. That means these two facts need to sit alongside each other, not compete for the same slot.

The easiest way to reason about this step is to test one concrete sequence: click the button so it becomes liked, move the pointer over it, then move the pointer away. After pointer leave, the hover preview should disappear, but the liked state should still be there. If leaving the button resets everything to neutral, the model is mixing up a temporary fact with a durable one. A cleaner approach is to store `liked` and `hovered`, then derive `tone` from the pair `{ liked, hovered }`.

:::stackblitz{file="step2-problem.ts" step=2 total=2 solution="step2-solution.ts"}

**Hints**

- Hover is real state, but it is not the same kind of fact as liked.
- If leaving the button resets everything, the state shape is collapsing two dimensions into one.
- Compute tone from both facts together instead of storing tone separately.

### Final Solution

When you compare your finished version to the broken one, the main thing to check is not whether it is shorter. Check whether every visible output is now coming from the current facts instead of being stored separately. If `liked` and `hovered` are the only changing truths, then the label, icon, pressed state, and tone should all fall out of that snapshot naturally.

:::stackblitz{file="solution.ts" step=2 total=2 solution="solution.ts"}
