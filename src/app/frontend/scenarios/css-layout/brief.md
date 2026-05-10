# CSS Layout

## Overview

Plant Floor Monitor can already fetch and render device data, but the screen still reads like a stacked prototype instead of a dashboard an operator could scan. An automations company wants to see whether you can turn the existing React component tree into a deliberate application layout with plain CSS, using Grid for the two-dimensional shell and Flexbox or nested Grid where one-dimensional alignment is the real problem. Your task is to upgrade the existing screen into a dashboard with a fixed sidebar, a fluid main region, responsive device cards, and status styling that can be defended in code review.

## What You Should Build

- [ ] Update `src/App.tsx` so the existing loading, error, and ready states render inside a real dashboard shell with a sidebar region and a main content region
- [ ] Update the existing device-list and device-card markup as needed so `src/App.css` can lay the ready state out as a responsive grid of cards instead of a single stacked list
- [ ] Add plain CSS in `src/App.css` for the dashboard shell, the device-card layout, and a responsive card grid that uses `repeat(auto-fill, minmax(280px, 1fr))`
- [ ] Keep the status badge styling driven by CSS custom properties so the three device states do not rely on repeated hardcoded color values
- [ ] Be prepared to explain why `auto-fill` with `minmax(280px, 1fr)` responds to viewport width without a media query, and what breaks if the minimum is changed to `0`

## Constraints

- Stay within layout and styling plus the minimal JSX changes required to support that styling, do not add filters, rail interactions, reducer state, accessibility polish, or new fetch logic in this scenario
- Use plain CSS in `src/App.css`, not Tailwind, CSS-in-JS, or a new design-token system
- Keep `src/App.css` as the styling target because this work belongs to the Plant Floor Monitor surface, not to global document styles in `src/index.css`
- Reuse the existing `DeviceList`, `DeviceCard`, and `StatusBadge` boundaries instead of collapsing them back into one component
- You are free to choose the exact JSX structure and class names that support the layout, as long as the finished screen satisfies the dashboard shell, responsive grid, and status-token requirements
- Treat the three device status states as a closed set in CSS just as they are in TypeScript, with one tokenized styling approach rather than three unrelated badge implementations
