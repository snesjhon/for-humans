---
files:
  - src/App.tsx
  - src/App.css
  - src/components/devices/FeaturedDeviceRail.tsx
---

You are evaluating a learner's work on Add Interactivity from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `collection-hooks` section. Evaluate only the horizontally scrollable featured-device rail:
- whether `src/components/devices/FeaturedDeviceRail.tsx` owns the scroll container ref, listens for horizontal scrolling, and derives button visibility from the rail's DOM measurements
- whether the implementation uses `scrollLeft`, `scrollWidth`, and `clientWidth` to decide when the previous and next buttons should appear
- whether the buttons scroll the rail left and right in a predictable chunk instead of mutating an unrelated counter
- whether `src/App.css` constrains the rail to five fixed-width visible cards and styles the controls as deliberate UI

Do not evaluate filters, detail panels, debounced search, reducer state, accessibility polish, or new network abstractions. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/components/devices/FeaturedDeviceRail.tsx` renders a horizontal repeated collection and owns the scroll container ref instead of pushing DOM scroll logic up into `App.tsx`
- [ ] The rail derives `canScrollLeft` from `scrollLeft > 0` or an equivalent left-offset check rather than from a separate selected-index counter
- [ ] The rail derives `canScrollRight` from the remaining horizontal distance, using `scrollWidth - clientWidth - scrollLeft` or an equivalent calculation
- [ ] The previous and next buttons trigger horizontal scrolling on the container itself, such as through `scrollBy`, rather than rewriting the DOM position indirectly
- [ ] The button visibility stays aligned with the real rail position by updating from the scroll event and an initial sync after mount or after the list size changes
- [ ] `src/App.css` gives the viewport a bounded width that fits exactly five cards and keeps each card at a fixed horizontal basis so the remaining cards overflow instead of wrapping
- [ ] `src/App.css` includes deliberate selectors for the rail controls and viewport rather than leaving the interaction effectively unstyled

## Opening Question

Explain the horizontal scroll math as if you were defending it in code review. Why is `scrollLeft` the left offset, why does `scrollWidth - clientWidth - scrollLeft` describe the remaining right offset, and why is that better than storing arrow visibility from a button click counter?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
