---
files:
  - src/hooks/useDevices.ts
  - src/api/client.ts
  - src/api/devices.ts
  - src/App.tsx
---

You are evaluating a learner's work on Async State in React from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `effects-timers-cleanup` section. Evaluate only the async device-request lifecycle:
- whether `src/hooks/useDevices.ts` owns the loading, error, and success lifecycle for the device request
- whether the hook uses `AbortController` in `useEffect` cleanup so in-flight work is cancelled on teardown
- whether the abort signal is threaded through `fetchDevices()` and `apiFetch()` to the actual `fetch()` call
- whether aborts are treated as expected cleanup instead of as user-facing failures
- whether `src/App.tsx` consumes the hook and keeps top-level loading, error, and ready screen branches

Do not evaluate extracted presentational components, CSS layout, tags, alarms, polling, retries, caching libraries, reducers, memoization, or collection filtering. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/hooks/useDevices.ts` exports a `useDevices()` hook that owns the device request lifecycle and returns the state `App.tsx` needs for loading, error, and ready rendering
- [ ] The hook creates an `AbortController` inside `useEffect`, passes its `signal` into the device request, and calls `controller.abort()` from the cleanup function
- [ ] `src/api/devices.ts` accepts an optional `AbortSignal` and forwards it to `apiFetch()` instead of ignoring cancellation at the device-fetch boundary
- [ ] `src/api/client.ts` passes the provided signal into the actual `fetch()` call rather than keeping cancellation as a React-only concern
- [ ] The hook does not treat an `AbortError` as a user-facing error state
- [ ] The implementation avoids relying on an `isMounted` flag or a "skip `setState` after unmount" guard as the primary cleanup mechanism
- [ ] `src/App.tsx` consumes `useDevices()` and renders top-level loading, error, and ready branches without calling `fetchDevices()` directly

## Opening Question

Walk me through the cleanup path. What still happens if the component unmounts mid-fetch and you only guard `setState`, why is passing `signal` into `fetch()` the stronger fix, and how would React StrictMode make a missing cleanup easier to notice during development?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
