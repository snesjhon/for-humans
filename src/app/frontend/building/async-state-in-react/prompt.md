---
files:
  - src/api/client.ts
  - src/api/devices.ts
  - src/hooks/useDevices.ts
---

You are evaluating a learner's work on Async State in React from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `effects-timers-cleanup` section. Evaluate only the device-loading hook and the cancellation path it depends on:
- whether `src/hooks/useDevices.ts` starts the request in `useEffect()` and exposes typed loading, error, and device data state
- whether the fetch layer accepts an abort signal so cleanup cancels the actual request instead of only suppressing state updates afterward
- whether the hook creates an `AbortController` per effect run and aborts it in the cleanup function
- whether aborted requests are treated as expected cleanup rather than surfaced as user-facing errors

Do not evaluate rendering components, CSS, reducer logic, polling, retries, tag or alarm data flows, schema-validation libraries, or performance optimizations. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/api/client.ts` accepts request init or an equivalent abort-capable parameter and forwards it to `fetch()` so cancellation can happen at the transport boundary
- [ ] `src/api/devices.ts` exposes `fetchDevices(signal?: AbortSignal): Promise<Device[]>` or an equivalent typed API that forwards the signal into `apiFetch()`
- [ ] `src/hooks/useDevices.ts` exports a typed `useDevices()` hook that tracks loading, error, and device data state for the request lifecycle
- [ ] `useDevices()` creates an `AbortController` inside `useEffect()` and aborts it from the cleanup function returned by that effect
- [ ] The hook passes `controller.signal` into `fetchDevices()` instead of relying only on an `isMounted`, `didCancel`, or similar post-request state-write guard
- [ ] The error handling treats an `AbortError` as expected cleanup and avoids surfacing it as the hook's error state, while still surfacing real request failures
- [ ] The request logic stays inside the hook plus fetch helpers instead of moving async transport code into a rendering component

## Opening Question

Walk me through the cleanup path in your hook. Why does the abort signal have to flow into `fetch()`, what still happens if the component unmounts mid-fetch and you only guard `setState()`, and how would StrictMode expose the missing cleanup during development?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
