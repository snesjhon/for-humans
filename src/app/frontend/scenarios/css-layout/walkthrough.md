# Walkthrough: CSS Layout

## How to Approach This

### The Core Insight

The current React boundaries are already doing the right jobs. `App.tsx` owns the async screen branch, `DeviceList` owns the collection, `DeviceCard` owns one record, and `StatusBadge` owns the closed-set status display. The missing piece is layout architecture. Right now the UI is readable, but it does not yet communicate hierarchy, density, or scan order like a dashboard. This scenario is about making the CSS structure match the component structure.

### The Mental Model

Treat the page like a plant-floor wallboard mounted on a frame. The frame decides which large zones exist, the panels inside those zones decide how groups are arranged, and each indicator inside a panel decides how one signal is presented. That leads directly to the primitive choice:

- CSS Grid for the frame and for card collections, because those are two-dimensional placement problems
- Flexbox or nested Grid inside one card row, because aligning a title block against one badge is a one-dimensional problem

### How to Decompose This

Before you touch the CSS, answer three questions:

1. Which part of the screen is truly two-dimensional and therefore belongs to Grid?
2. Which selectors need to exist in JSX before the CSS can target them cleanly?
3. Why should the status colors become CSS custom properties instead of three repeated literal color pairs?

---

## Building It

Project state entering this scenario is now concrete. Earlier steps already established the API contract, the fetch layer, the cancellable `useDevices()` hook, and the rendering split across `App.tsx`, `DeviceList`, `DeviceCard`, and `StatusBadge`. The current `src/App.css` gives those components a readable first pass, but the screen is still mostly a centered stack. This scenario upgrades that same surface into a dashboard layout without adding new product behavior. The lesson is CSS architecture, not more React state.

### Step 1: Picture the target before choosing the markup

Start by deciding what the finished screen should look and feel like. You already have working data flow and working components. What is missing is a more deliberate spatial structure.

The target screen should read roughly like this on desktop:

<div style="display:grid;grid-template-columns:18rem minmax(0,1fr);gap:1rem;margin:1rem 0 1.5rem;">
  <div style="min-height:18rem;padding:1rem;border:1px solid #d8e1ee;border-radius:20px;background:linear-gradient(180deg,#eef4ff 0%,#f8fbff 100%);">
    <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4b6285;">Plant Floor Monitor</div>
    <div style="margin-top:0.6rem;font-size:1.15rem;font-weight:700;color:#162033;">Operations context</div>
    <div style="margin-top:0.8rem;height:0.8rem;width:85%;border-radius:999px;background:#d9e5f5;"></div>
    <div style="margin-top:0.45rem;height:0.8rem;width:70%;border-radius:999px;background:#d9e5f5;"></div>
    <div style="margin-top:1rem;height:7.5rem;border-radius:16px;background:#dfe9f8;"></div>
  </div>

  <div style="min-height:18rem;padding:1rem;border:1px solid #d8e1ee;border-radius:20px;background:#ffffff;">
    <div style="font-size:1.15rem;font-weight:700;color:#162033;">Active Devices</div>
    <div style="margin-top:0.55rem;height:0.8rem;width:38%;border-radius:999px;background:#e3ebf7;"></div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.85rem;margin-top:1rem;">
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6.5rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
    </div>
  </div>
</div>

On narrower screens, the page should stack into one column while the cards continue to reflow:

<div style="display:grid;grid-template-columns:1fr;gap:1rem;margin:1rem 0 1.5rem;">
  <div style="height:6rem;border:1px solid #d8e1ee;border-radius:20px;background:linear-gradient(180deg,#eef4ff 0%,#f8fbff 100%);"></div>
  <div style="padding:1rem;border:1px solid #d8e1ee;border-radius:20px;background:#ffffff;">
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.85rem;">
      <div style="height:6rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
      <div style="height:6rem;border-radius:16px;background:#f6f9fc;border:1px solid #d8e1ee;"></div>
    </div>
  </div>
</div>

That picture is the requirement. You can satisfy it with whatever JSX structure feels most natural, as long as the layout contract is clear and the existing component boundaries remain sensible.

### Step 2: Separate visual goals from implementation choices

The interviewer is not really asking for one exact DOM tree. They are asking whether you can reason from layout requirements to the right CSS primitive. The useful decomposition is:

- The outer page frame needs two major regions on desktop and one region per row on mobile
- The device collection needs a card grid that adds or removes columns as width changes
- Each device card needs a small internal layout so title, metadata, and badge do not fight for space
- The status badge needs shared structure plus small state-specific value changes

Those are outcome statements, not implementation instructions. You are free to decide whether the shell uses `main` plus `aside`, two `section` elements, or another equivalent structure. What matters is that the result exposes two page regions, a responsive card grid, and a badge system that does not repeat itself.

<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.75rem;margin:1rem 0 1.5rem;">
  <div style="padding:0.85rem;border-radius:16px;background:#e8f0fd;color:#23406a;font-weight:600;text-align:center;">page frame</div>
  <div style="padding:0.85rem;border-radius:16px;background:#eef7ea;color:#24543a;font-weight:600;text-align:center;">card collection</div>
  <div style="padding:0.85rem;border-radius:16px;background:#fff3e5;color:#7a4b12;font-weight:600;text-align:center;">card internals</div>
  <div style="padding:0.85rem;border-radius:16px;background:#fdecec;color:#7c2632;font-weight:600;text-align:center;">status badge</div>
</div>

### Step 3: Know what the card grid must prove

The most important layout behavior in this scenario is the device grid. You do not need a breakpoint to say "at this width, switch from three columns to two." The browser can already derive that if the rule encodes the minimum viable card width.

Here is the behavior the finished grid should demonstrate:

- each card may grow to share leftover space with its neighbors
- each card may not shrink below a readable minimum
- when another full card no longer fits, the layout drops to fewer columns

That is why `repeat(auto-fill, minmax(280px, 1fr))` matters. It expresses the contract directly:

- `280px` is the floor below which the card should stop shrinking
- `1fr` lets the occupied tracks expand evenly
- `auto-fill` keeps adding tracks while the container has room for another 280-pixel card

The key teaching point is that the browser performs this math continuously. No media query is needed because the rule already says when another column is valid.

This is also the clearest place to explain what breaks with `minmax(0, 1fr)`. If the minimum becomes `0`, the browser is free to preserve more columns than the design can really support. Instead of dropping to fewer columns, the cards can compress until the content starts to feel broken:

- card titles wrap too early
- metadata lines become cramped
- the badge can collide visually with the title area
- the grid technically fits, but the design stops being readable

So the question is not "does `minmax(0, 1fr)` work syntactically?" It does. The question is whether it encodes the right layout constraint. For the card grid, it does not.

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0 1.5rem;">
  <div style="padding:0.9rem;border:1px solid #cfe0d8;border-radius:18px;background:#f5fbf7;">
    <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#2c6b4f;">Healthy grid</div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.7rem;margin-top:0.8rem;">
      <div style="padding:0.75rem;border-radius:14px;background:#ffffff;border:1px solid #cfe0d8;font-size:0.82rem;">280px minimum respected</div>
      <div style="padding:0.75rem;border-radius:14px;background:#ffffff;border:1px solid #cfe0d8;font-size:0.82rem;">cards grow evenly</div>
      <div style="padding:0.75rem;border-radius:14px;background:#ffffff;border:1px solid #cfe0d8;font-size:0.82rem;">columns drop when needed</div>
    </div>
  </div>

  <div style="padding:0.9rem;border:1px solid #ecd2d6;border-radius:18px;background:#fff7f8;">
    <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9b3041;">Broken grid</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.45rem;margin-top:0.8rem;">
      <div style="padding:0.55rem;border-radius:14px;background:#ffffff;border:1px solid #ecd2d6;font-size:0.72rem;">title wraps too early</div>
      <div style="padding:0.55rem;border-radius:14px;background:#ffffff;border:1px solid #ecd2d6;font-size:0.72rem;">badge feels cramped</div>
      <div style="padding:0.55rem;border-radius:14px;background:#ffffff;border:1px solid #ecd2d6;font-size:0.72rem;">too many columns survive</div>
    </div>
  </div>
</div>

### Step 4: Use a small visual spec for the card itself

You do not need prescribed JSX here either. What you need is a target composition for one card.

<div style="margin:1rem 0 1.5rem;max-width:24rem;padding:1rem;border:1px solid #d8e1ee;border-radius:18px;background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%);">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
    <div>
      <div style="font-size:1rem;font-weight:700;color:#162033;">Device name</div>
      <div style="margin-top:0.3rem;font-size:0.82rem;color:#5a6b85;">Device ID</div>
    </div>
    <div style="padding:0.3rem 0.7rem;border-radius:999px;background:#e7f8eb;color:#1f6a3f;font-size:0.74rem;font-weight:700;text-transform:uppercase;">Badge</div>
  </div>
  <div style="margin-top:1rem;display:grid;gap:0.55rem;">
    <div style="height:0.8rem;width:40%;border-radius:999px;background:#dfe8f5;"></div>
    <div style="height:0.8rem;width:62%;border-radius:999px;background:#dfe8f5;"></div>
  </div>
</div>

The implementation can vary, but a reviewer should still be able to see:

- a top region where identity and badge align cleanly
- a body region where supporting metadata stacks without crowding
- enough spacing that the card reads like one dashboard unit instead of loose text inside a box

This is where Flexbox often wins for the header row. It solves a one-dimensional alignment problem. The card as a whole may still use Grid or block flow with spacing, depending on how you want to organize its internal regions.

### Step 5: Treat badge colors like tokens, not one-off literals

The status system is a closed set: `online`, `offline`, and `alarm`. That means the badge styling should also behave like a closed system rather than like three disconnected exceptions.

The visual goal is simple:

<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin:1rem 0 1.25rem;">
  <span style="display:inline-flex;align-items:center;padding:0.35rem 0.8rem;border-radius:999px;background:#dcfce7;color:#166534;font-size:0.78rem;font-weight:700;text-transform:uppercase;">Online</span>
  <span style="display:inline-flex;align-items:center;padding:0.35rem 0.8rem;border-radius:999px;background:#e5e7eb;color:#374151;font-size:0.78rem;font-weight:700;text-transform:uppercase;">Offline</span>
  <span style="display:inline-flex;align-items:center;padding:0.35rem 0.8rem;border-radius:999px;background:#fee2e2;color:#b91c1c;font-size:0.78rem;font-weight:700;text-transform:uppercase;">Alarm</span>
</div>

What should stay shared across all three:

- badge shape
- badge padding
- badge typography
- uppercase treatment
- border radius

What should vary by state:

- background color
- text color

That is why CSS custom properties are a better fit than repeating literal colors in three separate blocks. You can keep one base badge rule and let each state-specific selector define only the values that change. The exact variable names are not the lesson. The lesson is that the closed-set states should supply values into a shared badge contract instead of re-declaring the whole badge each time.

### Step 6: Put the breakpoint where the page actually needs it

The card grid should solve itself from the `auto-fill` and `minmax(280px, 1fr)` rule. The page shell is different because it owns the large-scale region split.

The outcome to aim for is:

- desktop: sidebar beside main content
- smaller screens: sidebar above main content

That is a good use of one media query, because it changes the page-region structure itself. The lesson here is not "never use media queries." It is "do not use a media query to do work the grid track definition can already do."

<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0 1.5rem;">
  <div style="padding:0.9rem;border:1px solid #d8e1ee;border-radius:18px;background:#ffffff;">
    <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4b6285;">Desktop shell</div>
    <div style="display:grid;grid-template-columns:10rem minmax(0,1fr);gap:0.75rem;margin-top:0.8rem;">
      <div style="height:7rem;border-radius:14px;background:#e7eefb;"></div>
      <div style="height:7rem;border-radius:14px;background:#f4f7fb;"></div>
    </div>
  </div>

  <div style="padding:0.9rem;border:1px solid #d8e1ee;border-radius:18px;background:#ffffff;">
    <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#4b6285;">Mobile shell</div>
    <div style="display:grid;grid-template-columns:1fr;gap:0.75rem;margin-top:0.8rem;">
      <div style="height:3.2rem;border-radius:14px;background:#e7eefb;"></div>
      <div style="height:6rem;border-radius:14px;background:#f4f7fb;"></div>
    </div>
  </div>
</div>

---

## Why This Way

This approach teaches you to reason from visible requirements instead of copying an implementation. The scenario still has strong technical constraints, but they are expressed as layout outcomes and reviewable behavior.

Grid belongs at the shell and collection levels because those are two-dimensional placement decisions. Flexbox often belongs inside the card header because that is a one-dimensional alignment decision. The distinction matters because it trains you to pick a primitive that matches the problem instead of reaching for one pattern everywhere.

`repeat(auto-fill, minmax(280px, 1fr))` is strong because it encodes both the minimum acceptable card width and the rule for sharing extra space. The browser can therefore add or remove columns continuously as the container changes width, which is why the layout responds without separate breakpoint logic.

`minmax(0, 1fr)` is correct when the goal is "let this track shrink as much as needed to avoid overflow," such as the fluid main column beside a fixed sidebar. It is incorrect for the device card grid because it removes the readability floor. Once the minimum becomes zero, the layout is allowed to preserve too many columns by crushing the cards instead of wrapping them.

CSS custom properties improve the badge states because the status styles are a closed set with shared structure. The base rule owns the badge shape and reads named values. Each status modifier only supplies the values that differ. That is easier to review, easier to extend, and much less fragile than copying literal color pairs into multiple selectors.

---

## How to Explain It

I started from the target screen shape instead of from one exact DOM structure. The page shell is a Grid problem because it places two major regions on the page. The device list is also a Grid problem because it needs to create or remove columns as width changes. The card header is usually a Flexbox problem because it aligns identity content against a badge on one axis. I used `repeat(auto-fill, minmax(280px, 1fr))` because it preserves a real minimum card width while letting the browser add or remove columns automatically. I did not use `minmax(0, 1fr)` for the cards because that would preserve extra columns by crushing the cards below their readable size. For badge states, I kept one shared badge contract and let the state-specific rules provide only the colors that differ.

---

## Checkpoint

- Why is `minmax(0, 1fr)` useful for the fluid main shell column but harmful for the device-card grid?
- What repeated maintenance problem disappears once the badge modifiers only set `--status-bg` and `--status-text` instead of repeating full `background` and `color` declarations plus base badge structure?

:::evaluator
Defend the layout architecture in code review terms. Why is the shell a Grid problem, why does `repeat(auto-fill, minmax(280px, 1fr))` respond without a media query, what concrete UI regression appears if the card grid switches to `minmax(0, 1fr)`, and why are CSS custom properties a better fit than repeated literal color values for the three badge states?
:::
