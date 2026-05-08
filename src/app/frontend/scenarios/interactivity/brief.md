# Add Interactivity

## Overview

Plant Floor Monitor can already fetch and render device data, but an automations company now wants a tighter operator surface at the top of the screen: a horizontally scrollable rail of featured devices. The rail should show five fixed-width cards at a time, keep the rest clipped, and expose previous and next buttons that disappear when the user has reached the left or right edge. Your task is to build that rail in React and derive the button visibility from the actual scroll position instead of from a separate counter.

## What You Should Build

- [ ] Update `src/App.tsx` so it renders a featured-device rail with 10 fixed-width cards sourced from the existing device data flow or a local featured subset
- [ ] Create `src/components/devices/FeaturedDeviceRail.tsx` that renders the horizontal list, owns the scroll container ref, and listens for horizontal scroll changes
- [ ] Wire previous and next buttons that scroll the rail left or right in card-sized chunks instead of jumping to arbitrary pixel positions
- [ ] Derive `canScrollLeft` and `canScrollRight` from `scrollLeft`, `scrollWidth`, and `clientWidth` so the left button is hidden at the start, the right button is hidden at the end, and both appear in the middle
- [ ] Add plain CSS in `src/App.css` that constrains the rail to five visible cards, clips the overflow, and gives the buttons and cards a deliberate first-pass layout

## Constraints

- Use horizontal DOM measurements, not the vertical pattern from `scrollTop` and `scrollHeight`; this scenario is specifically about `scrollLeft`, `scrollWidth`, and `clientWidth`
- Keep the button-visibility flags derived from the scroll container's current DOM state; do not store a separate index as the source of truth for whether either button should appear
- Scope the work to the featured rail only, do not add filters, debounced search, detail drawers, reducers, or new fetch-layer abstractions in this scenario
- Keep card dimensions fixed inside the rail so exactly five cards fit in the visible window before scrolling
- Use plain CSS in `src/App.css`, not Tailwind, CSS-in-JS, or a new component library
