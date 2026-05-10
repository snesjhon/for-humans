---
files:
  - src/api/client.ts
  - src/api/devices.ts
---

You are evaluating a learner's work on Writing the Fetch Layer from the Plant Floor Monitor frontend path.

## Scope

This scenario belongs to the `data-fetching` section. Evaluate only the typed fetch boundary for device data:
- whether `src/api/client.ts` defines a reusable `apiFetch<T>()` wrapper for JSON requests
- whether the wrapper checks `response.ok` before parsing JSON and throws on non-200 responses
- whether `src/api/devices.ts` exposes `fetchDevices(): Promise<Device[]>` by delegating to the wrapper
- whether the generic return type lives on the wrapper call instead of leaving the wrapper untyped and casting after the fact

Do not evaluate React components, hooks, loading state, cancellation, CSS, schema validation libraries, tag or alarm fetchers, or UI rendering. Those belong to later scenarios.

## Rubric

A strong implementation should:
- [ ] `src/api/client.ts` exports an `apiFetch<T>(url: string): Promise<T>` helper rather than leaving callers to work with raw `fetch()` responses directly
- [ ] `apiFetch<T>()` checks `response.ok` and throws on non-200 responses before calling `response.json()`
- [ ] `src/api/devices.ts` exports `fetchDevices(): Promise<Device[]>` and delegates to `apiFetch<Device[]>('/mocks/devices.json')` or an equivalent device-mock URL
- [ ] The code imports the shared `Device` type instead of re-declaring the payload shape locally in `src/api/devices.ts`
- [ ] The implementation places the generic at the fetch boundary rather than parsing to an untyped value and casting to `Device[]` afterward at the call site
- [ ] The fetch logic is separated into a reusable client module plus a device-specific module instead of being written inline in a React component

## Opening Question

Walk me through the trust boundary in your fetch layer. Why is the generic attached to `apiFetch<T>`, what exact failure can still produce valid JSON and therefore requires a `response.ok` check first, and what later lesson becomes harder if `fetchDevices()` is embedded directly inside a component?

## Output

Respond ONLY with valid JSON: { "covered": [...], "missed": [...], "followUp": "..." or null }
