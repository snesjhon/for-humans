# Async State in React

## Overview

Plant Floor Monitor now has a typed API contract and a typed fetch layer, but React still has no lifecycle-aware boundary for requesting device data. An automations company wants to see whether you can build a `useDevices()` hook that models loading, error, and ready state honestly, cancels in-flight work during cleanup, and wires that hook into the app without falling back to `isMounted` guards or stale effect patterns.

## What You Should Build

- [ ] Create `src/hooks/useDevices.ts` with a `useDevices()` hook that requests devices through the existing fetch layer and exposes the async screen state the app needs
- [ ] Use `useEffect` plus `AbortController` so an in-flight request is cancelled in cleanup when the component unmounts or the effect is re-run
- [ ] Thread the abort signal through the fetch boundary instead of leaving the network request running and merely guarding `setState`
- [ ] Update the existing device fetch helpers as needed so the hook can pass an `AbortSignal` down to `fetch()`
- [ ] Update `src/App.tsx` so it consumes `useDevices()` and renders loading, error, and ready branches from the hook result

## Constraints

- Stay inside async device state only, do not extract presentational components, add CSS work, render tags or alarms, or introduce reducers in this scenario
- Do not solve cleanup with an `isMounted` flag or a "skip `setState` after unmount" guard alone; the request itself should be cancellable
- Treat an abort as expected cleanup, not as a user-facing error state
- Reuse the existing `fetchDevices()` boundary instead of calling `fetch()` directly from `App.tsx`
- Keep the hook focused on one request lifecycle for devices only; polling, retries, caching libraries, and derived filtering belong to later scenarios
