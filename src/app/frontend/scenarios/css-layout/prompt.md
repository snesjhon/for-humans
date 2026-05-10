---
files:
  - src/App.tsx
  - src/App.css
  - src/components/devices/DeviceList.tsx
  - src/components/devices/DeviceCard.tsx
  - src/components/devices/StatusBadge.tsx
---

You are evaluating work on CSS Layout from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `rich-interactive-ui` section. Evaluate only the dashboard layout and status-token styling work:
- whether `src/App.tsx` renders the existing screen states inside a real dashboard shell with distinct layout regions
- whether the device collection is laid out as a responsive grid in `src/App.css`
- whether the card and badge structure support deliberate layout rather than the earlier stacked placeholder styles, even if the implementation uses a different exact JSX structure than the walkthrough examples
- whether the status badge styling uses CSS custom properties to express the three closed-set device states

Do not evaluate new fetch logic, featured-device rail interactions, filters, debounced search, reducers, accessibility polish, or performance optimization. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/App.tsx` preserves ownership of loading, error, and ready branches while introducing layout-region markup the CSS can place into a sidebar-plus-main or equivalent dashboard shell, without requiring one exact DOM shape
- [ ] `src/App.css` uses CSS Grid for the outer application shell instead of relying only on one-dimensional flex stacking for the whole page
- [ ] `src/App.css` defines the device collection with `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` or an equivalent rule that preserves a real minimum card width while letting columns expand and wrap responsively
- [ ] The grid rule for the device collection does not reduce the card minimum to `0`, which would allow the layout to preserve too many columns by shrinking cards below a readable width
- [ ] `src/components/devices/DeviceList.tsx` and `src/components/devices/DeviceCard.tsx` expose class names or structure that the grid and card layout rules target cleanly, without collapsing the component boundaries back into `App.tsx`
- [ ] `src/App.css` gives the device cards a deliberate internal layout, such as a header row that aligns device identity against the badge and a body region for metadata
- [ ] `src/App.css` defines a shared `.status-badge` base rule that reads from CSS custom properties, and the closed-set modifier classes such as `.status-badge--online`, `.status-badge--offline`, and `.status-badge--alarm` set only the varying color values through those properties instead of repeating literal `background` and `color` declarations everywhere

## Opening Question

Explain the CSS architecture as if you were defending it in review. Focus on the layout outcomes you were targeting, not only the exact selectors you wrote. Why is the shell a Grid problem, why does `repeat(auto-fill, minmax(280px, 1fr))` react to width changes without a media query, what goes wrong when the card grid switches to `minmax(0, 1fr)`, and why are CSS custom properties a stronger design than repeating hardcoded badge colors for each state?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
