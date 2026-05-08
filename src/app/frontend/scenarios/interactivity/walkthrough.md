# Walkthrough: Add Interactivity

## How to Approach This

### The Core Insight

The previous screens taught the app how to fetch devices and render them as components. This scenario adds a different kind of state: viewport state. The rail buttons are not independent toggles. They are a direct readout of how much content is hidden to the left and right of the visible window. If you store those flags separately from the scroll container, they drift. If you derive them from the DOM on every scroll, the buttons stay truthful.

### The Mental Model

Treat the featured-device rail like a long strip of cards sliding behind a fixed inspection window. The window never changes size. The strip moves underneath it.

That means the horizontal version of your original vertical handler is not a new pattern, it is the same pattern on a different axis:

- `scrollLeft` is how much of the strip is hidden to the left of the window
- `scrollWidth` is the full width of all cards plus gaps
- `clientWidth` is the width of the visible window

Once you have those three numbers, the button state falls out:

```tsx
const leftOffset = element.scrollLeft;
const rightOffset = element.scrollWidth - element.clientWidth - element.scrollLeft;

const canScrollLeft = leftOffset > 0;
const canScrollRight = rightOffset > 0;
```

This is the key shift from the original `scrollTop` example. You are still measuring "how much content is past the viewport." You are just doing it horizontally.

### How to Decompose This

Before you write code, answer three questions:

1. Which component owns the scroll container ref and the derived button state?
2. What should cause the left and right buttons to update: button clicks, or every scroll event regardless of how the user moved the rail?
3. Which CSS rule actually guarantees "only five cards show at a time": a fixed card basis, a bounded viewport width, or both?

---

## Building It

Project state entering this scenario is now concrete. The app already has a typed device contract, a fetch layer, a `useDevices()` hook, and an extracted rendering boundary for device cards. What it does not have is a horizontally navigable collection. This scenario adds that interaction layer without introducing filters, detail panels, or new async concerns. The new lesson is about reading horizontal scroll state from the DOM and turning it into predictable UI controls.

### Step 1: Put the scroll truth in one place

Create a dedicated component such as `FeaturedDeviceRail` and let it own the scroll container ref plus the two derived booleans:

```tsx
const VISIBLE_CARDS = 5;
const CARD_WIDTH = 13.5;

export function FeaturedDeviceRail({ devices }: FeaturedDeviceRailProps) {
  const railRef = useRef<HTMLUListElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
```

The important architectural decision is not the exact variable names. It is the boundary. `App.tsx` can decide where the rail appears, but the rail component itself should own the DOM measurement logic because it owns the DOM node being measured.

### Step 2: Derive button visibility from the current horizontal offsets

This is where the vertical pattern becomes the horizontal one. Instead of reading `scrollTop` and `scrollHeight`, read `scrollLeft`, `scrollWidth`, and `clientWidth`. In React, prefer `event.currentTarget` for typed access to the element handling the event.

```tsx
function syncScrollState(element: HTMLUListElement) {
  const leftOffset = element.scrollLeft;
  const rightOffset =
    element.scrollWidth - element.clientWidth - element.scrollLeft;

  setCanScrollLeft(leftOffset > 0);
  setCanScrollRight(rightOffset > 0);
}

function handleScroll(event: React.UIEvent<HTMLUListElement>) {
  syncScrollState(event.currentTarget);
}
```

This is the exact answer to the question behind the original snippet. The vertical example compared how far the user had moved down a container. The rail compares how much hidden content remains on each horizontal edge. Same reasoning, different measurements.

It also matters that the `scroll` handler is the source of truth. A user can move the rail by clicking a button, dragging a trackpad, using a scrollbar, or through programmatic smooth scrolling. If the flags only update inside the button handlers, they will be wrong whenever the rail moves any other way.

### Step 3: Scroll in one viewport-sized chunk

The buttons should move the rail in a predictable amount. Since the brief says five fixed-width cards are visible at once, the cleanest move is to scroll by roughly one full visible window.

Render the controls beside the viewport:

```tsx
<section className="featured-device-rail">
  {canScrollLeft ? (
    <button
      type="button"
      className="featured-device-rail__button"
      onClick={() => scrollRail(-1)}
      aria-label="Scroll featured devices left"
    >
      Previous
    </button>
  ) : null}

  <ul
    ref={railRef}
    className="featured-device-rail__viewport"
    onScroll={handleScroll}
  >
    {devices.map((device) => (
      <li key={device.id} className="featured-device-rail__item">
        <DeviceCard device={device} />
      </li>
    ))}
  </ul>

  {canScrollRight ? (
    <button
      type="button"
      className="featured-device-rail__button"
      onClick={() => scrollRail(1)}
      aria-label="Scroll featured devices right"
    >
      Next
    </button>
  ) : null}
</section>
```

Then implement the scroll movement against the ref:

```tsx
const SCROLL_STEP_PX = 5 * 216;

function scrollRail(direction: -1 | 1) {
  const rail = railRef.current;
  if (!rail) return;

  rail.scrollBy({
    left: direction * SCROLL_STEP_PX,
    behavior: 'smooth',
  });
}
```

The exact pixel count can be derived from the fixed card width plus the horizontal gap. The important design point is that the button changes the scroll position, and the scroll position change is what updates the visibility flags.

### Step 4: Sync once on mount so the initial buttons are honest

The left button should be hidden on first paint. The right button should only appear if there is overflow to the right. That means the component needs one initial sync after the DOM node exists:

```tsx
useEffect(() => {
  const rail = railRef.current;
  if (!rail) return;

  syncScrollState(rail);
}, [devices.length]);
```

Without this first pass, the booleans can start from a guessed default instead of the measured layout. The interviewer is looking for whether you understand that scroll state is still layout-dependent state.

### Step 5: Use CSS to enforce the five-card window

The rail only shows five cards at once when both the viewport and the items cooperate. Put the rail-specific CSS in `src/App.css`, because these styles belong to this application surface rather than to a generic global reset.

First, make the viewport a bounded horizontal strip and prevent cards from shrinking:

```css
.featured-device-rail {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.featured-device-rail__viewport {
  --rail-card-width: 13rem;
  --rail-gap: 1rem;
  width: calc((var(--rail-card-width) * 5) + (var(--rail-gap) * 4));
  display: flex;
  gap: var(--rail-gap);
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0;
  margin: 0;
  list-style: none;
}

.featured-device-rail__item {
  flex: 0 0 var(--rail-card-width);
}
```

Those two rules are the mechanical heart of the layout:

- the viewport width is capped to exactly five card widths plus four gaps
- each item uses `flex: 0 0 ...` so it keeps that fixed width instead of shrinking to fit

The result is the requested behavior: five cards are visible, the rest overflow horizontally, and the viewport exposes that overflow through scrolling instead of wrapping.

Then style the buttons as real controls instead of incidental text:

```css
.featured-device-rail__button {
  min-height: 3rem;
  padding: 0 0.9rem;
  border: 1px solid #c9d6ea;
  border-radius: 999px;
  background: #ffffff;
  color: #12233c;
  font-weight: 600;
}
```

This scenario is not about fancy motion design. It is about making the relationship between the window, the strip, and the controls obvious in both code and layout.

---

## Why This Way

The button flags should be derived from DOM measurements because the DOM already knows the true scroll position. Any separate React index becomes a second source of truth that can drift from trackpad scrolling, window resizing, or a changed card width.

`scrollLeft`, `scrollWidth`, and `clientWidth` answer slightly different questions, and together they fully describe the rail state:

- `scrollLeft` says how far the content has already traveled
- `scrollWidth - clientWidth` says the total travel distance available
- subtracting the two tells you how much travel remains

That is why this horizontal handler is the correct analog to the original vertical snippet. You are still measuring movement against total hidden content, just on the x-axis instead of the y-axis.

The CSS must fix both the viewport and the card widths. If the cards can shrink, "show five at a time" stops being a real contract and becomes a coincidence of the current screen width.

---

## How to Explain It

I treated the rail as a viewport over a longer strip of cards. Instead of storing arrow visibility as its own piece of business logic, I derived it from the scroll container's current horizontal measurements. `scrollLeft` tells me how much content is hidden on the left, and `scrollWidth - clientWidth - scrollLeft` tells me how much remains on the right. The buttons only change the scroll position. The `scroll` handler is what decides whether either button should still be visible.

---

## Checkpoint

- Why is `event.currentTarget` a better fit than `event.target` in a typed React scroll handler for the rail?
- What breaks if the cards are allowed to shrink instead of keeping a fixed basis inside the horizontal viewport?

:::evaluator
Walk me through the horizontal version of the original vertical scroll snippet. Why do `scrollLeft`, `scrollWidth`, and `clientWidth` fully determine whether the previous and next buttons should appear, and why should those flags update from the scroll event instead of only inside the button click handlers?
:::
