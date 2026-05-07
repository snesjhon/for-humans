# Walkthrough: Writing the Fetch Layer

## How to Approach This

### The Core Insight

The fetch layer is the moment where two different trust levels meet. Before that point, you have an HTTP response and an untyped JSON payload. After that point, the rest of the app wants a `Promise<Device[]>` it can reason about without repeating parsing and status-check logic. If that boundary stays implicit, every caller has to remember the same three steps and every caller gets a fresh chance to get one of them wrong.

### The Mental Model

Treat `apiFetch<T>` like an airlock between the network and the application. The outside of the airlock is raw `Response`: status codes, headers, and a body that may or may not describe a successful payload. The inside of the airlock is trusted application data with one declared shape. The airlock has to do two jobs in order:

1. reject bad HTTP responses before the payload is treated as usable data
2. hand the successful body to the rest of the app as one explicit type

That is why the generic belongs on the wrapper. The wrapper is the place where the response crosses the trust boundary. If you wait until the call site to write `as Device[]`, the boundary is still untyped and every caller can invent its own cast after the fact.

### How to Decompose This

Before you write the module, answer three questions:

1. What does `response.ok` check that `response.json()` does not?
2. Which file should own the low-level fetch-and-error pattern, and which file should own the domain-specific `fetchDevices()` function?
3. What bug becomes easier to write if every caller casts the parsed JSON for itself?

---

## Building It

Project state entering this scenario is intentionally narrow. The previous lesson established `src/types/api.ts`, but there is still no fetch utility, no `useDevices` hook, and no UI. That means this step is only about defining the HTTP boundary cleanly so the next scenario can focus on async state instead of mixing network details into React code.

### Step 1: Put the generic on the boundary, not on the caller

Start with a reusable wrapper in `src/api/client.ts`. Its job is not to know anything about devices. Its job is to say, "if this request succeeds, I will return JSON shaped like `T`; if it does not, I will throw before any caller treats the body as valid data."

```ts
export async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

This is the important design decision in the whole lesson. The wrapper owns the generic because the wrapper is the reusable boundary. Callers choose the expected payload shape once, at the point they invoke the boundary:

```ts
return apiFetch<Device[]>('/mocks/devices.json');
```

That is stronger than:

```ts
const data = await apiFetch('/mocks/devices.json');
return data as Device[];
```

The second version leaves `apiFetch()` effectively untyped and pushes trust decisions outward. Every caller now has to remember to cast, and every caller can cast to something different. The wrapper pattern centralizes the contract instead of duplicating it.

### Step 2: Fail on HTTP status before you parse the body

The `response.json()` call only parses the body. It does not treat `404`, `500`, or `403` as failures on its own. If the server returns a JSON error payload with a non-200 status, `.json()` will happily parse it and hand that object back unless you check `response.ok` first.

That is why the status check must happen before the parse:

```ts
if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

return response.json() as Promise<T>;
```

The ordering matters. Once you parse first and check later, you have already crossed the boundary and treated an error response body as if it were just another candidate for `T`. In interviews, this is one of the fastest ways to show whether you understand the difference between transport success and payload shape.

### Step 3: Keep the domain-specific function small and typed

With the generic boundary in place, `src/api/devices.ts` should stay almost boring. That is a good sign. It imports the `Device` contract, points at the static JSON endpoint, and returns the typed promise the rest of the app will use.

```ts
import type { Device } from '@/types/api';
import { apiFetch } from './client';

export function fetchDevices(): Promise<Device[]> {
  return apiFetch<Device[]>('/mocks/devices.json');
}
```

This file teaches a second design lesson: domain-specific fetchers should describe application concepts, not HTTP mechanics. A component should ask for devices, not decide how to check status codes, parse JSON, and coerce unknown data into `Device[]`.

### Step 4: Keep the fetch layer out of React so later state logic stays honest

It is tempting to put this directly in a component because the current app still has no UI. That would make the next scenario worse. Once fetch logic sits inside `App.tsx`, the hook lesson has to untangle network code, loading state, error state, and rendering branches all at once.

Keeping `src/api/client.ts` and `src/api/devices.ts` separate buys three things immediately:

- the HTTP error boundary exists in one place
- the rest of the app consumes typed functions, not raw `Response` objects
- the next lesson can focus on async state and cleanup without re-litigating fetch semantics

This is the architectural reason the module exists. It is not ceremony. It isolates the trust boundary so React code can reason about data and state instead of transport details.

---

## Why This Way

The wrapper owns the generic because the wrapper is the reusable place where unknown JSON becomes declared application data. If every caller casts after parsing, the trust boundary never becomes explicit and the type safety is mostly performative.

`Response.ok` belongs before `.json()` because status failure and body parsing are different questions. A server can send valid JSON and still fail the request. If you parse first, you have already accepted the body before deciding whether the transport succeeded.

The fetch layer belongs in its own module because components should not own transport policy. Components care about rendering states and user interaction. The fetch layer cares about URLs, status checks, and the promise shape that downstream code receives.

---

## How to Explain It

I put the generic on `apiFetch<T>` because that wrapper is the trust boundary between raw JSON and typed application data. If I leave `apiFetch()` untyped and cast at the call site, every caller has to re-assert the shape after parsing and the boundary stays implicit. I check `response.ok` before `.json()` because `.json()` only parses the body, it does not reject a `404` or `500` for me. I kept the fetch layer in its own module so the next React hook can depend on a typed `fetchDevices()` function instead of mixing HTTP mechanics into component state logic.

---

## Checkpoint

- Why is `apiFetch<Device[]>('/mocks/devices.json')` a stronger design than calling `apiFetch('/mocks/devices.json')` and casting the result later?
- What kind of response can still make `response.json()` succeed even though the request should be treated as a failure?

:::evaluator
Explain the fetch boundary as if you were defending it in a code review. Why does the generic belong on `apiFetch<T>`, what exact mistake does `response.ok` catch before `.json()`, and what coupling problem appears if a component inlines the fetch logic instead of importing `fetchDevices()`?
:::
