## Overview

Rich interactive UI breaks down when one state value tries to mean everything at once. A dashboard can be on the alerts tab, refreshing data in the background, and animating a details panel open at the same time. Layout breaks down for the same reason when one CSS primitive is asked to solve every placement problem. Grid should place the dashboard regions and responsive card tracks, while Flexbox should align content within one row or column.

**The state-modeling problem:** navigation state, loading state, and animation state are separate dimensions of the screen. They layer on top of each other instead of replacing one another.

**The layout problem:** Grid solves two-dimensional placement across the page, while Flexbox solves one-dimensional alignment inside a single region.

**Level 1** teaches how to model independent UI state lanes without collapsing them into one overloaded status.

**Level 2** teaches how to choose between Grid and Flexbox, and how `repeat(auto-fill, minmax(...))` behaves as the container grows.

**Level 3** teaches how to close the system: responsive card-grid rules, the `auto-fill` versus `auto-fit` decision, and CSS custom properties for closed-set status colors.

## Core Concept & Mental Model

The problems from the overview share one prerequisite: you need a model where the dashboard is a control-room wall with a fixed floor plan and several independent overlays.

### The Control-Room Wall

Imagine a plant-floor control room.

- **wall blueprint** = the page layout, where sidebar, header, details panel, and device grid live
- **panel rails** = Flexbox alignment inside one region, like a card header row or toolbar
- **operator focus** = navigation state, which view or item the operator is looking at
- **refresh beacon** = loading state, whether data is idle, fetching for the first time, ready, or refreshing in place
- **motion cue** = animation state, whether a panel is entering, settled, or leaving
- **status lamps** = closed-set CSS custom properties, one token per allowed status value

The important rule is that these overlays do not replace the wall blueprint and they do not replace each other. The operator can change focus while the refresh beacon stays on. A panel can animate out while the current tab stays the same. That is why stuffing all screen meaning into one string like `'loading-devices-panel-open'` creates brittle code. One field is pretending to describe several independent truths at once.

### Why Independent Lanes Matter More Than One Giant Screen Status

Suppose a user clicks into a device details panel while the grid is already visible and the app starts a background refresh. The UI facts are:

- navigation: device details for `device-42` are open
- request state: data is refreshing, but existing cards remain visible
- animation state: the panel is entering or already settled

None of those facts cancels the others out. If you use one merged state, every new combination becomes a new invented status value:

```ts
type BadStatus =
  | 'grid-idle'
  | 'grid-loading'
  | 'grid-refreshing'
  | 'details-loading'
  | 'details-refreshing-entering'
  | 'details-refreshing-settled';
```

That model explodes because it encodes combinations manually instead of letting combinations exist naturally.

The cleaner shape is independent lanes:

```ts
type NavigationState =
  | { view: 'overview' }
  | { view: 'device'; deviceId: string };

type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'refreshing' };

type AnimationState =
  | { panel: 'hidden' }
  | { panel: 'entering' }
  | { panel: 'settled' }
  | { panel: 'leaving' };

type DashboardState = {
  navigation: NavigationState;
  request: RequestState;
  animation: AnimationState;
};
```

Now each lane answers one question only. Combinations are just object values, not a naming exercise.

### Why Grid And Flexbox Are Different Tools

The same separation shows up in layout. A dashboard shell is two-dimensional: sidebar on the left, main content on the right, maybe a detail rail beside the grid. That is Grid's job because you are placing items across rows and columns at once.

Inside a card header, the problem changes. You need a title on the left and a badge on the right, or a stack of buttons spaced horizontally. That is one-dimensional alignment. Flexbox is the simpler tool because the row or column is already decided.

```css
.app-shell {
  display: grid;
  grid-template-columns: 18rem minmax(0, 1fr);
}

.device-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

Grid is the wall blueprint. Flexbox is the rail inside one panel.

### What `minmax()` And `auto-fill` Actually Mean

The responsive device grid needs one track rule that works from narrow viewports to large monitors. The usual shape is:

```css
grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
```

Read it in the order the browser does:

1. **`minmax(16rem, 1fr)`** says each track may never shrink below `16rem`, but once the minimum is satisfied it may grow and share leftover space.
2. **`auto-fill`** says "create as many tracks as can fit, even if some end up empty."
3. **`repeat(...)`** applies that track recipe across the whole grid.

That gives you a card wall that keeps adding columns when the container earns them, without hard-coding breakpoints for 2, 3, or 4 columns.

### When `auto-fill` And `auto-fit` Differ

`auto-fill` and `auto-fit` look the same when every track has content. They diverge when the container can fit more tracks than you have cards.

- **`auto-fill`** keeps the empty tracks. Existing cards do not stretch across that unused space.
- **`auto-fit`** collapses the empty tracks, so the existing cards stretch wider.

That means the choice is a product decision, not a syntax trick.

- If you want the dashboard to preserve a stable card rhythm and leave open slots for future items, use `auto-fill`.
- If you want a half-empty row to stretch and avoid visible gaps, use `auto-fit`.

### Why Status Colors Want Closed-Set Custom Properties

Device status is a closed vocabulary: `online`, `offline`, `alarm`, maybe `maintenance`. Closed sets want tokens, not ad hoc inline colors.

```css
:root {
  --status-online-bg: #dcfce7;
  --status-online-fg: #166534;
  --status-offline-bg: #e5e7eb;
  --status-offline-fg: #374151;
  --status-alarm-bg: #fee2e2;
  --status-alarm-fg: #991b1b;
}

.status-badge--alarm {
  background: var(--status-alarm-bg);
  color: var(--status-alarm-fg);
}
```

This keeps the mapping explicit, reusable, and limited to the supported statuses. When the value space is closed, the styling API should be closed too.

---

## Building Blocks: Progressive Learning

### Level 1: Model The Screen As Independent Lanes

The first capability is resisting the urge to invent one giant dashboard status that mixes focus, fetch progress, and motion. A rich UI is not one timeline. It is several timelines that sometimes happen concurrently.

#### **Exercise 1**

Build the core state model for a dashboard that can show an overview or a device details panel while also tracking request progress and panel motion. The important move is to keep those concerns in separate lanes so combinations come from object composition rather than manually named mega-status values.

:::stackblitz{file="step1-exercise1-problem.ts" step=1 total=3 solution="step1-exercise1-solution.ts"}

#### **Exercise 2**

Implement the transition that starts a background refresh. The current selection should remain selected, and the panel animation should keep its current phase. Only the request lane should change. This exercise is about proving that "refreshing" is not a whole-screen replacement state.

:::stackblitz{file="step1-exercise2-problem.ts" step=1 total=3 solution="step1-exercise2-solution.ts"}

#### **Exercise 3**

Implement the transition that opens a device details panel. The app may already be `ready` or `refreshing`, and that data state should survive the navigation change. The panel animation should begin entering, but the request lane should stay untouched.

:::stackblitz{file="step1-exercise3-problem.ts" step=1 total=3 solution="step1-exercise3-solution.ts"}

> **Mental anchor**: "Navigation, loading, and animation are overlays, not synonyms."

**→ Bridge to Level 2**: Once the state lanes are separate, the next question is whether the layout uses the right primitive for each job. A clean state model still needs a layout model that distinguishes page placement from within-panel alignment.

### Level 2: Pick The Right Layout Primitive

Now the capability is recognizing which layout question you are actually solving. If you are placing dashboard regions across rows and columns, that is Grid. If you are distributing items along a single row or column, that is Flexbox.

#### **Exercise 1**

Choose the correct primitive for several UI relationships: the page shell, the device card grid, the card header row, and the filter toolbar. The important move is to name the axis problem before you name the CSS property.

:::stackblitz{file="step2-exercise1-problem.ts" step=2 total=3 solution="step2-exercise1-solution.ts"}

#### **Exercise 2**

Predict how many card columns `repeat(auto-fill, minmax(16rem, 1fr))` can create for a given container width and gap. This exercise is about reading the layout rule as a track recipe instead of memorizing a magic incantation.

:::stackblitz{file="step2-exercise2-problem.ts" step=2 total=3 solution="step2-exercise2-solution.ts"}

#### **Exercise 3**

Compare `auto-fill` and `auto-fit` when the container can hold more tracks than there are cards. The difference is not visible when every slot is occupied, so this exercise forces the half-empty-row case where the choice actually matters.

:::stackblitz{file="step2-exercise3-problem.ts" step=2 total=3 solution="step2-exercise3-solution.ts"}

> **Mental anchor**: "Grid places regions. Flex aligns content inside a region."

**→ Bridge to Level 3**: Primitive choice explains the shape of the layout, but a real dashboard also needs stable responsive track rules and a styling system for closed vocabularies like status.

### Level 3: Encode The Responsive Rules Explicitly

The final capability is closing the loop between state and styling. The layout should declare its card-grid rule directly, and the styling system should map closed-set statuses to closed-set design tokens instead of ad hoc colors.

#### **Exercise 1**

Map each allowed device status to a CSS custom property token pair. The point is not to memorize variable syntax. The point is to treat closed-set UI values as closed-set design decisions.

:::stackblitz{file="step3-exercise1-problem.ts" step=3 total=3 solution="step3-exercise1-solution.ts"}

#### **Exercise 2**

Build the exact grid-template expression for a responsive card wall. The shell should keep a fixed sidebar and fluid main area, while the card list should use `repeat(auto-fill, minmax(...))`. This exercise makes you write the layout rule from the underlying intent.

:::stackblitz{file="step3-exercise2-problem.ts" step=3 total=3 solution="step3-exercise2-solution.ts"}

#### **Exercise 3**

Describe which UI layers are visible for a combined dashboard state. A user may have a selected device, a background refresh, and an entering panel at the same time. This final exercise checks whether you can read the independent state lanes back into concrete UI surfaces.

:::stackblitz{file="step3-exercise3-problem.ts" step=3 total=3 solution="step3-exercise3-solution.ts"}

> **Mental anchor**: "Closed vocabularies deserve closed tokens, and responsive grids deserve one explicit track recipe."

## Key Patterns

### Separate State By Question, Not By Component File

Use separate state lanes when each field answers a different question about the UI.

- **When to use it:** current tab versus request progress versus panel motion
- **What it prevents:** impossible mega-status values and brittle transition logic

### Use Grid For The Blueprint, Flexbox For The Rails

Place dashboard regions with Grid, then align content inside each region with Flexbox.

- **When to use it:** app shell, responsive card wall, detail rail, toolbar rows, badge rows
- **What it prevents:** forcing Flexbox to fake columns or forcing Grid to solve simple one-axis alignment

### Treat `minmax()` As A Contract

Read `minmax(min, max)` as a promise about what may never shrink and what may expand.

- **When to use it:** responsive cards, tiles, metric panels, gallery cells
- **What it prevents:** hand-coded breakpoint churn for every column count

### Choose `auto-fill` Or `auto-fit` Based On Empty-Track Behavior

These values are only meaningfully different when the grid has spare room.

- **When to use `auto-fill`:** preserve stable slots and rhythm
- **When to use `auto-fit`:** let under-filled rows stretch and absorb spare space

### Encode Closed Sets With CSS Variables

A small finite status vocabulary should map to named tokens, not raw colors scattered through selectors.

- **When to use it:** status badges, severity chips, health indicators, theme roles
- **What it prevents:** inconsistent color drift and unsupported value styling

---

## Decision Framework

1. Are you describing one UI fact or several concurrent facts?
   If several facts can be true at once, model them as separate lanes.

2. Are you placing items across rows and columns or aligning items on one axis?
   Use Grid for placement across the page, Flexbox for alignment inside a row or column.

3. Does the card wall need a minimum readable width per card?
   Use `minmax(minWidth, 1fr)` so the browser enforces the minimum before adding or stretching tracks.

4. What should happen when there is space for more tracks than there are items?
   Use `auto-fill` to preserve empty slots, `auto-fit` to collapse them.

5. Is the visual value space finite and known ahead of time?
   Use CSS custom properties and explicit status classes instead of ad hoc color choices.

## Common Gotchas & Edge Cases

- `refreshing` is not the same as `loading`. A dashboard can keep stale-but-usable data on screen while a refresh happens in the background.
- A selected device and an entering panel are different lanes. One names the focus target, the other names the motion phase of the UI around that target.
- Grid and Flexbox are not rivals. A real dashboard usually uses both, just at different layers.
- `minmax(16rem, 1fr)` does not mean every card is always `16rem` wide. It means `16rem` is the floor, then leftover space is shared.
- `auto-fill` and `auto-fit` behave the same when every possible track has an item. Only test cases with spare room reveal the difference.
- Inline status colors are tempting for the first badge and expensive by the fifth. Closed-set tokens pay off as soon as the same status appears in more than one place.
