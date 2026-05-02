## The Problem

Create a star rating widget that allows users to select a rating value.

## Requirements

- The widget accepts two parameters: the maximum number of stars and the number of currently filled stars.
- When a star is clicked, it is filled along with all the stars to its left.
- Hovering over a star fills that star and all stars to its left.
- The stars that need to be filled during hover take priority over the existing filled state.
- If the cursor leaves the widget and no new selection is made, the appropriate stars revert to the filled state before hovering.
- Make the star rating widget reusable such that multiple instances can be rendered within the same page.
- The star icons, both empty and filled, are provided to you as SVGs.

A `StarRating.js` skeleton component has been created for you. You are free to decide the props of `<StarRating />`.

## Overview

This prompt sounds visual on the surface because it talks about stars, hover states, and SVG icons. But the hard part is not drawing stars. The hard part is choosing the right state model for a reusable widget.

If you model each star as its own source of truth, every interaction has to repaint the row correctly. Clicking a lower star after a higher one must unfill the extra stars. Hovering must temporarily override the saved selection. Leaving the widget must remove only the preview, not the chosen rating. That is a lot of synchronization work if the row itself is stored directly.

The cleaner model is to treat the widget as one value selector. It stores one durable rating, one temporary hover preview, and derives the row from whichever value should currently win. Once that model is clear, the fact that there are five stars, or seven stars, or multiple widgets on the page stops being the complicated part.

## Core Concept and Mental Model

### One ruler, many marks

Picture the widget as a horizontal ruler.

- `maxStars` says how long the ruler is
- `selectedRating` says where the saved mark is
- `hoveredRating` says where the temporary preview mark is

The stars are just tick marks along that ruler. A star is filled when its position is at or before the active mark. That means the row is not five independent decisions. It is one cutoff rendered across many positions.

### What the component actually knows

A reusable `StarRating` component should separate inputs from changing facts:

- input: how many stars to render
- input: how many stars start filled
- persistent fact: the rating the user has selected
- temporary fact: the rating the pointer is previewing, or no preview at all

Everything visible can be derived from that:

- `displayRating`: use `hoveredRating` when it exists, otherwise `selectedRating`
- star list: fill every position whose index is less than `displayRating`

That lets the component stay configurable without duplicating state for every star.

### A useful design question before code

Before writing handlers, it helps to ask a simple question: what is the real source of truth here?

The prompt is about a row of stars, so it is easy to think the component needs to remember the whole row directly. But a click does not really change five separate facts. It changes one rating value. Hover does not really change five separate facts either. It previews one temporary rating value.

That is the main thought process to carry into the code:

- the component does not need to remember each star separately
- it needs to remember one saved rating
- it may also need one temporary preview rating

Once that is clear, the row becomes a rendering of those facts instead of a second source of truth.

### Why storing the row directly gets awkward

If you skip that design question, you can end up with a shape like this:

```ts
const [stars, setStars] = useState([
  'empty',
  'empty',
  'empty',
  'empty',
  'empty',
]);
```

At first that can feel reasonable because the UI is a row of five stars. But now the row is being stored as paint instead of being derived from the rating. Every click and hover has to repaint that array perfectly. If one transition is wrong, the widget can drift out of sync with the user's actual choice.

The same problem appears when you store a mutable `displayRating` and let both click and hover handlers overwrite it directly. Pointer leave can no longer tell whether it should restore the saved rating or clear the row entirely.

### Reusability comes from props, not from special logic

The prompt also asks for multiple widgets on the same page. That requirement sounds bigger than it really is. You do not need special coordination between instances. You need a component API that keeps each instance's state local and drives rendering from props.

If one `StarRating` gets `maxStars={5}` and another gets `maxStars={10}`, both should work because they follow the same rule: render positions `1..maxStars`, then fill up to the active rating.

## How I Think Through This

I start by asking what a click really commits. It does not commit five booleans. It commits one number. That number becomes the selected rating for that widget instance.

Then I ask what hover changes. Hover should not replace the real selection. It only previews a different cutoff while the pointer is over the component. That means hover needs its own lane. If I am tempted to mutate one shared `displayRating` from every handler, I stop and test one sequence: click `4`, hover `2`, leave. After leaving, the row should still show `4`.

The component contract becomes simple once the state model is right:

- render as many stars as `maxStars` asks for
- initialize from the currently filled count
- clicking updates the saved rating
- hovering previews a temporary rating
- leaving removes only the preview

The SVG part is then just rendering detail. The logic that decides whether a star is filled does not depend on what icon implementation you use.

---

## Building the Solution

### Step 1: Render the widget shell from the two required parameters

Start with the shape of the component itself. The prompt is not asking for a hardcoded row of five stars. It is asking for a reusable widget that can render a variable number of stars and show an existing filled count on first render. Before adding click or hover, make sure the component can build the row from `maxStars` and show the provided filled value.

This step should feel like building the shell of the widget. Render one button per star, label them clearly, and decide which ones appear filled from the starting rating. If a three-star widget still renders five buttons, or if the initial filled count is ignored, the component is not really following the prompt yet.

:::stackblitz{file="step1-problem.tsx" step=1 total=4 solution="step1-solution.tsx"}

**Hints**

- `maxStars` should control how many star buttons are rendered.
- `initialFilledStars` should determine which stars start filled.
- The first goal is to build the widget shape, not to finish every interaction yet.

### Step 2: Add click selection without storing the whole row

Now bring in the first real interaction. A click on star `3` means the selected rating becomes `3`, and every star up to that position should render as filled. The key idea is that you still do not need per-star memory. One selected number should drive the whole row.

One useful test here is to click a higher star and then a lower one. If the lower selection still leaves extra stars filled, the row is being stored separately instead of being derived from the current selected rating. This is where the state-driven part of the UI should start to feel concrete.

:::stackblitz{file="step2-problem.tsx" step=2 total=4 solution="step2-solution.tsx"}

**Hints**

- A click commits one rating value, not a whole array of star states.
- Filling the row should come from the current selected rating during render.
- Clicking a lower star after a higher one should naturally unfill the extra stars.

### Step 3: Add hover preview and let it take priority over the saved rating

Now add hover, but keep it separate from the saved selection. When the pointer enters a star, the component should preview that rating. When the pointer leaves, it should remove only the preview. The selected rating still belongs to the widget underneath.

Walk through one sequence while you code: start with rating `4`, hover `2`, then leave. During hover, only two stars should appear filled. After leaving, the row should return to four filled stars. If the row resets to zero or stays stuck on the preview, the temporary hover state is being treated like the durable selection.

:::stackblitz{file="step3-problem.tsx" step=3 total=4 solution="step3-solution.tsx"}

**Hints**

- Hover is temporary state, not the saved rating.
- Use the hovered value when it exists, otherwise use the selected value.
- Different `StarRating` instances should still behave independently after hover is added.

### Step 4: Restore the saved rating on leave and confirm the component is reusable

The last requirement is about behavior after the preview ends. If the cursor leaves the widget and the user has not clicked a new rating, the stars should return to the saved selection from before hover. This is the check that proves hover is only a preview layer, not the real source of truth.

This is also a good moment to prove the widget is actually reusable. Render two `StarRating` instances with different props and make sure they do not interfere with each other. If one instance updates the other, some state has escaped the component boundary.

:::stackblitz{file="step4-problem.tsx" step=4 total=4 solution="step4-solution.tsx"}

**Hints**

- Pointer leave should clear only the hover preview, not the saved rating.
- Reusability here means each instance owns its own local state.
- The filled and empty SVGs are rendering details, the main logic still comes from the active rating cutoff.

### Final Solution

In the finished version, the widget should feel boring in the best way. Props define the size and starting value. Click updates one saved number. Hover writes one temporary preview. Render chooses the active rating from those facts and fills the row accordingly.

That model satisfies the real interview prompt because it scales to different star counts, restores the correct state after hover, and works for multiple instances on the same page without any extra coordination.

:::stackblitz{file="solution.tsx" step=4 total=4 solution="solution.tsx"}
