---
files:
  - src/App.tsx
  - src/App.css
  - src/components/devices/DeviceList.tsx
  - src/components/devices/DeviceCard.tsx
  - src/components/devices/StatusBadge.tsx
---

You are evaluating a learner's work on Rendering the Data from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `component-composition` section. Evaluate only the rendering decomposition that turns `useDevices()` output into presentational components:
- whether `src/App.tsx` consumes the existing hook and keeps ownership of loading, error, and ready screen branches
- whether the ready-state device collection is extracted into `DeviceList` and `DeviceCard` instead of being rendered inline in the top-level component
- whether `StatusBadge` owns the closed-set device-status rendering rule
- whether the first-pass CSS in `src/App.css` supports the extracted list, card, and badge structure

Do not evaluate new fetch logic, hook cleanup changes, tags, alarms, filters, reducers, responsive dashboard layout, memoization, or custom hooks beyond the existing `useDevices()` path. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/App.tsx` imports and calls `useDevices()`, renders loading and error branches at the top level, and hands the ready-state device array to a child component instead of inlining the full list markup
- [ ] `src/components/devices/DeviceList.tsx` accepts a typed device array prop and owns the collection wrapper plus the `map()` from devices to rendered child components
- [ ] `src/components/devices/DeviceCard.tsx` accepts a typed `Device` prop from the shared contract and does not import `useDevices`, `fetchDevices`, or call `fetch()` directly
- [ ] `src/components/devices/StatusBadge.tsx` accepts the device status as a prop and centralizes the status-specific label or class-name mapping instead of leaving that logic inline inside `DeviceCard`
- [ ] The rendered collection uses semantic list or equivalent repeated-collection markup with stable keys for each device item
- [ ] `src/App.css` defines deliberate selectors for the extracted device list, device card, and status badge structure instead of leaving the UI effectively unstyled
- [ ] `src/App.css` includes distinct visual treatment for the closed device-status states through badge-specific selectors rather than styling status as plain body text

## Opening Question

Walk me through the component split. Why does `App.tsx` keep the async branch, what concrete responsibility makes `StatusBadge` worth extracting, and how does `DeviceCard` stay decoupled from the fetch layer even though it renders data that ultimately came from the hook?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
