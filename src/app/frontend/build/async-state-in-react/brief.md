# Async State in React

## Overview

Plant Floor Monitor now has a typed device contract and a fetch layer, but React still has no boundary that turns that promise into screen-ready async state. An automations company wants to see whether you can build that boundary as a custom hook instead of scattering loading flags and ad hoc cleanup through components. Your job is to create `useDevices`, wire request cancellation through the existing fetch path, and be ready to explain what goes wrong when an effect outlives the component that started it.

## What You Should Build

- [ ] Create `src/hooks/useDevices.ts` with a typed `useDevices()` hook that loads devices from the existing fetch layer and exposes loading, error, and device data state
- [ ] Update the fetch path so `useDevices()` can pass an `AbortSignal` into the request instead of leaving the underlying `fetch()` uncancelled
- [ ] Start the device request inside `useEffect`, create an `AbortController` for that effect run, and abort it in the cleanup function
- [ ] Treat aborted requests as expected cleanup rather than as user-facing failures, while still surfacing real fetch errors
- [ ] Keep the hook ready for a later rendering scenario by returning state that a component can branch on without re-implementing fetch logic
- [ ] Be prepared to explain why cleanup belongs at the request boundary, what happens if the component unmounts mid-fetch without that cleanup, and how StrictMode exposes a missing teardown

## Constraints

- Stay at the async-state and effect-cleanup boundary only, do not build the rendering components, CSS, reducer logic, or tag and alarm flows in this scenario
- Do not replace cancellation with only an `isMounted` or `didCancel` state-write guard; the in-flight request itself should be cancellable
- Keep the hook typed with the shared `Device` contract and the existing fetch layer instead of re-declaring the payload shape locally
- Do not add polling, retries, schema-validation libraries, or backend code in this step
- Scope this lesson to device loading only, with one request started by the hook and one cleanup path owned by the effect
