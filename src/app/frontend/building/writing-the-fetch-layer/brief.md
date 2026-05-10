# Writing the Fetch Layer

## Overview

The Plant Floor Monitor project now has a typed API contract, but it still has no boundary where raw HTTP responses become trusted application data. An automations company wants to see whether you separate that concern from the component layer instead of sprinkling `fetch()` calls and type assertions through the UI. Your job is to build a small fetch module around the existing device contract and be ready to defend where the generic belongs, where errors are thrown, and why this code should not live inside `App.tsx`.

## What You Should Build

- [ ] Create `src/api/client.ts` with a reusable `apiFetch<T>(url: string): Promise<T>` wrapper for JSON requests
- [ ] Check `response.ok` and throw an error before calling `response.json()` when the response status is not in the 200 range
- [ ] Create `src/api/devices.ts` with `fetchDevices(): Promise<Device[]>` that delegates to `apiFetch<Device[]>('/mocks/devices.json')`
- [ ] Import the shared `Device` type from `src/types/api.ts` instead of re-declaring the payload shape or casting inside the component layer
- [ ] Keep the fetch boundary in its own module so later hooks and components can consume typed functions instead of raw `fetch()` responses

## Constraints

- Stay at the fetch-layer boundary only, do not build React components, hooks, reducer logic, or CSS in this scenario
- Do not cast the result to `Device[]` at the call site after `apiFetch()` returns; the wrapper should own the generic return type
- Treat non-200 responses as failures even if the server could still send a JSON body
- Keep the module focused on devices only for now, do not add tag or alarm fetchers in this step
- Do not add runtime schema validation libraries or backend code; this lesson is about boundary placement, typed return values, and explicit HTTP error handling
