# Rendering the Data

## Overview

Plant Floor Monitor now has a typed device contract, a fetch layer, and a `useDevices()` hook, but the UI still does not have an earned rendering boundary. An automations company wants to see whether you can turn hook output into a component structure that separates collection rendering, single-record layout, and status presentation instead of leaving one component to do all three jobs. Your task is to wire the hook into `App.tsx`, extract `DeviceList`, `DeviceCard`, and `StatusBadge`, and keep the split defensible in code review.

## What You Should Build

- [ ] Update `src/App.tsx` so it consumes `useDevices()` and renders loading, error, and ready states without inlining the full device-card markup in the top-level component
- [ ] Create `src/components/devices/DeviceList.tsx` that accepts a typed list of devices and renders the collection structure for the ready state
- [ ] Create `src/components/devices/DeviceCard.tsx` that accepts one typed `Device` and renders the device details without importing fetch helpers or hooks directly
- [ ] Create `src/components/devices/StatusBadge.tsx` that accepts the device status and owns the visual/status-label rendering for that closed set of values
- [ ] Add plain CSS in `src/App.css` so the extracted list, cards, and badge read as a deliberate first pass rather than raw unstyled markup

## Constraints

- Stay inside the device-list rendering boundary only, do not add tag rendering, alarm panels, filters, reducers, or new data-fetching logic in this scenario
- Keep `DeviceCard` and `StatusBadge` presentational; they should receive typed props, not call `useDevices()`, `fetchDevices()`, or `fetch()` themselves
- Reuse the shared `Device` contract from `src/types/api.ts`; do not re-declare the payload shape in the component layer
- Use plain CSS in `src/App.css`, not CSS-in-JS, Tailwind, or a new design-token system
- Keep the styling scoped to readable rendering of the list and badge, not the full responsive dashboard layout that later scenarios will own
