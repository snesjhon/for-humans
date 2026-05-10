## Overview

Rich interactive UI breaks down when one piece of state tries to do too much. A dashboard screen usually has at least three different concerns moving at once: which surface is selected, whether async data is loading or settled, and whether a visual transition is currently playing. This guide teaches the separation that keeps those concerns from leaking into each other, then connects that mental model to layout work where the same discipline applies: Grid owns two-dimensional placement, Flexbox owns one-dimensional alignment inside a region, and CSS custom properties own the closed set of visual tokens.

**The state-modeling problem:** one boolean or one overloaded string starts carrying navigation, loading, and animation at the same time, so one user event accidentally resets the wrong concern.

**The layout problem:** a dashboard is both a page-level grid and a set of smaller alignment problems inside each panel. Using one primitive everywhere makes either the shell or the internals harder than they need to be.

**Level 1** teaches independent state lanes for navigation, loading, and animation.

**Level 2** teaches where Grid stops and Flexbox starts in a dashboard layout.

**Level 3** teaches the responsive card-grid patterns and token rules that make the UI adapt without rewriting the model.

## Core Concept & Mental Model

The problems from the overview share one root cause: you get into trouble when you force several independent dimensions through one control lane. A rich interface is easier to reason about when each concern gets its own track and the tracks only meet at render time.

### The Stage Manager Board

Imagine a stage manager running a product demo from a control booth. The board has separate rows of switches.

- **scene row** = navigation state, which panel or tab is currently active
- **house lights row** = loading state, whether the content is pending, settled, or failed
- **cue lights row** = animation state, whether a transition is idle, entering, or exiting
- **stage plan** = CSS Grid, the two-dimensional placement of the whole dashboard
- **inside each marked area** = Flexbox, the one-dimensional alignment within a card, header, or toolbar
- **labeled color chips** = CSS custom properties, the fixed tokens for allowed statuses

The stage manager does not reuse the house-lights switch to remember which scene is active. They also do not redraw the floor plan every time one badge inside a panel needs spacing. Each control has a bounded job.

### State Dimensions Layer, They Do Not Merge

When a UI stores the active tab, the fetch phase, and the current animation cue in one field, every update has to preserve the meaning of the other two concerns manually. That is where impossible states and accidental resets appear.

```ts
type ScreenState =
  | 'overview'
  | 'devices'
  | 'loading'
  | 'error'
  | 'animating-in';
```

This looks compact, but it hides separate questions inside one answer:

- which surface is active?
- is the data ready yet?
- is a transition currently running?

Those questions can all be true at the same time. The devices tab can be active while data is loading and a fade-in is running. One union string cannot represent that combination without inventing more and more hybrid labels.

The cleaner model is separate state lanes:

```ts
type Panel = 'overview' | 'devices' | 'alerts';
type LoadPhase = 'idle' | 'loading' | 'success' | 'error';
type MotionPhase = 'idle' | 'entering' | 'exiting';
```

Now each event updates only the lane it truly owns. A tab click changes `panel`. A refetch changes `loadPhase`. A fade sequence changes `motionPhase`. The UI composes those answers during render.

### Layout Uses The Same Separation Rule

CSS layout has the same control-board shape.

Grid decides where regions live across rows and columns. It answers page-plan questions:

- where is the sidebar?
- how wide is the main area?
- how many card columns fit right now?

Flexbox answers a different class of question inside one region:

- how do the title and action button align in this header?
- how do badge pills distribute on one row?
- how do I push one control to the far edge?

If you ask Flexbox to solve the entire dashboard shell, you end up manually approximating rows and columns. If you ask Grid to align the contents of every tiny card header, you overcomplicate a one-axis problem.

### `minmax()` Plus Auto Placement Is The Responsive Move

Card grids in dashboards usually want a rule that reads like this: "each card must stay readable, but if there is room for more cards on the row, place them automatically." That is what `repeat(auto-fill, minmax(...))` or `repeat(auto-fit, minmax(...))` does.

```css
.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1rem;
}
```

The `minmax(16rem, 1fr)` part sets the minimum readable width and allows growth beyond it. The auto-placement keyword decides what to do with extra tracks.

- **`auto-fill`** keeps empty tracks in the grid, which is useful when you want the row structure to remain visible or reserved.
- **`auto-fit`** collapses empty tracks, which lets the existing cards stretch wider.

The choice is not stylistic. It changes whether the layout preserves slots or redistributes space.

### Closed-Set Visual Meaning Belongs In Tokens

Status colors are not free-form user input. They come from a closed set like `ok`, `warning`, `critical`, and `offline`. That means the CSS should expose named custom properties instead of repeating raw hex values across components.

```css
:root {
  --status-ok: #0f766e;
  --status-warning: #b45309;
  --status-critical: #b91c1c;
  --status-offline: #475569;
}
```

Then each badge maps a known status to a known token. The layout and component code both stay stable even if the palette changes later.

### The Three-Level Progression

- **Level 1: Independent state lanes.** Model navigation, loading, and animation as separate dimensions so one event updates one concern.
- **Level 2: Grid for the shell, Flexbox for the cell.** Build the dashboard frame and then solve local alignment inside each region with the simpler primitive.
- **Level 3: Responsive tracks and closed-set tokens.** Choose between `auto-fill` and `auto-fit`, then express status colors through custom properties instead of scattered literals.

---

## Building Blocks: Progressive Learning

### Level 1: Keep Layered UI Concerns Visible

The first level is about visible UI behavior, not abstract state contracts. A dashboard can keep the current panel on screen, show a background refresh indicator, and animate a details rail at the same time. These exercises use React components and DOM assertions so the learner proves the concept by preserving what the user can still see during each transition.

#### **Exercise 1**

Build a dashboard screen where refresh is a background concern instead of a replacement screen. When the learner opens the devices panel and starts a refresh, the devices panel should remain visible while the refresh indicator appears. The exercise is about making the rendered output prove that these concerns can coexist.

:::stackblitz{file="step1-exercise1-problem.tsx" step=1 total=3 solution="step1-exercise1-solution.tsx"}

#### **Exercise 2**

Build a master-detail workspace where selection survives async activity. The learner should be able to select a device, trigger a refresh, and still see the selected device details while the workspace shows that new data is loading in the background.

:::stackblitz{file="step1-exercise2-problem.tsx" step=1 total=3 solution="step1-exercise2-solution.tsx"}

#### **Exercise 3**

Build an animated details panel where motion and selection are different concerns. The learner should keep the selected device visible while the panel moves through entering, settled, and exiting phases. The point is to show that animation state describes how the panel is moving, not what content it represents.

:::stackblitz{file="step1-exercise3-problem.tsx" step=1 total=3 solution="step1-exercise3-solution.tsx"}

> **Mental anchor**: "If the user should still see it during a transition, that concern should layer on top of the current UI instead of replacing it."

**→ Bridge to Level 2**: Once the state lanes are independent, the page still needs a physical layout model. The next question is not state shape, it is which CSS primitive owns which spatial job.

### Level 2: Grid Places Regions, Flex Aligns Contents

Now the problem moves from state shape to spatial structure. Dashboard UIs are almost never one-axis layouts from edge to edge. The shell has rows and columns, while the contents of each cell usually align on a single row or stack. This level teaches where that boundary lives.

#### **Exercise 1**

Build the dashboard shell with a fixed-width sidebar and a fluid main column. Then center the app title and action button along one row inside the top bar. The learner task is to use Grid for the page plan and Flexbox for the toolbar alignment without mixing those responsibilities.

:::stackblitz{file="step2-exercise1-problem.html" step=2 total=3 solution="step2-exercise1-solution.html"}

#### **Exercise 2**

Create a metrics strip where four cards flow into equal columns across the available width, while each card header aligns its label and status pill on one line. This is another shell-vs-cell exercise: the outer track system is two-dimensional placement, the inner header is one-dimensional alignment.

:::stackblitz{file="step2-exercise2-problem.html" step=2 total=3 solution="step2-exercise2-solution.html"}

#### **Exercise 3**

Lay out a device card so the page uses Grid to place cards, but each individual card uses Flexbox to pin the footer controls to the bottom edge while keeping the text stack natural above it. The goal is to feel the handoff between the two primitives instead of trying to solve both layers with one.

:::stackblitz{file="step2-exercise3-problem.html" step=2 total=3 solution="step2-exercise3-solution.html"}

> **Mental anchor**: "Grid answers where regions live. Flex answers how items share one axis inside a region."

**→ Bridge to Level 3**: Once the shell works, the real dashboard problem is adaptation. The layout has to add or collapse columns gracefully, and the visual language has to reuse named tokens instead of hard-coded color guesses.

### Level 3: Responsive Tracks And Closed-Set Tokens

The last level turns a working layout into a robust one. Responsive card grids should adapt without breakpoint soup, and status styles should be expressed as reusable tokens because the set of statuses is known ahead of time. This is where `minmax()`, `auto-fill` vs `auto-fit`, and custom properties become part of the architecture rather than decoration.

#### **Exercise 1**

The device grid should create as many readable columns as will fit, but each card must never shrink below the minimum width. Write the responsive track rule with `minmax()` and `auto-fill` so new columns appear automatically as the viewport grows.

:::stackblitz{file="step3-exercise1-problem.html" step=3 total=3 solution="step3-exercise1-solution.html"}

#### **Exercise 2**

This board has only three cards on a wide row, and the design wants those cards to stretch instead of leaving phantom empty slots. Update the grid rule so the extra tracks collapse and the existing cards grow. The exercise is specifically about choosing `auto-fit` instead of `auto-fill` for that behavior.

:::stackblitz{file="step3-exercise2-problem.html" step=3 total=3 solution="step3-exercise2-solution.html"}

#### **Exercise 3**

The badges currently repeat raw hex values inline for every status. Replace that with named custom properties for the closed-set statuses and map each badge to the right token. Keep the palette centralized so future color changes do not require hunting through selectors.

:::stackblitz{file="step3-exercise3-problem.html" step=3 total=3 solution="step3-exercise3-solution.html"}

> **Mental anchor**: "Responsive rules should express layout intent, and closed-set visual meaning should live in named tokens."

## Key Patterns

### Separate State By Meaning, Not By Screen

Model each concern according to what changes independently.

- **When to use it:** active panel plus loading plus motion, selected entity plus fetch phase, modal visibility plus form draft
- **What it costs:** a few more fields and the need to name each lane clearly
- **What it prevents:** one event clobbering unrelated UI truth

### Choose The Layout Primitive By Axis Count

Pick Grid when the question is about rows and columns together. Pick Flexbox when the question is about distribution on one axis inside a bounded area.

- **When to use Grid:** app shell, card boards, named regions, responsive track systems
- **When to use Flexbox:** headers, button rows, badge clusters, footer controls
- **What it prevents:** solving a two-dimensional problem with spacer hacks or solving a one-dimensional problem with unnecessary grid templates

### Use `minmax()` To Encode Readability Constraints

Write the minimum acceptable track width once, then let the browser distribute extra space.

- **When to use it:** card galleries, metrics boards, tile layouts, dashboard modules
- **What it costs:** understanding how intrinsic minimums and free space interact
- **What it prevents:** brittle media-query ladders for every intermediate viewport

### Put Closed-Set Values Behind Custom Properties

If a value comes from a known vocabulary, expose it as a token instead of duplicating literals.

- **When to use it:** status colors, semantic spacing tiers, elevation shadows, shared radii
- **What it costs:** one layer of indirection in the CSS
- **What it prevents:** palette drift and repeated one-off overrides

---

## Decision Framework

1. Can the UI facts be true at the same time?
   If yes, keep them in separate state lanes.

2. Does the layout question involve both rows and columns?
   Use Grid for that outer structure.

3. Is the problem only about aligning or spacing items along one row or one column inside a region?
   Use Flexbox for that local alignment.

4. Do you need cards to keep a minimum readable width while auto-wrapping?
   Reach for `repeat(auto-fill, minmax(minWidth, 1fr))`.

5. Do you want empty tracks to collapse so existing items stretch?
   Prefer `auto-fit`.

6. Is a color or spacing value drawn from a fixed vocabulary rather than arbitrary user input?
   Define a custom property token and map the closed set to it.

## Common Gotchas & Edge Cases

- A loading spinner appearing on a panel does not mean the active panel changed. Do not encode those answers in one variable.
- "Grid vs Flexbox" is not an either-or choice for the whole page. Most rich UIs use both at different layers.
- `auto-fill` and `auto-fit` differ only when the row has room for extra tracks. That is exactly when the design choice matters.
- `minmax(0, 1fr)` and `minmax(16rem, 1fr)` solve different problems. The first allows aggressive shrinking, the second protects readability.
- Custom properties help when the domain vocabulary is closed. They do not automatically solve user-defined arbitrary values.
