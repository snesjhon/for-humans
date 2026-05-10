# Walkthrough: Async State in React

## How to Approach This

### The Core Insight

An effect that starts async work also owns the cleanup for that exact unit of work. If the request can outlive the effect that started it, the component no longer controls its own state boundary. `useDevices()` is not just a place to call `fetchDevices()`. It is the place where React's render lifecycle and the network request have to agree about when the work starts, when it is still relevant, and how it stops.

### The Mental Model

Treat each effect run like a temporary lease on one network request. The setup function opens the lease by starting the fetch. The cleanup function closes it by aborting that specific request when the component unmounts or when React replaces the effect with a newer run. A missing cleanup means the old lease keeps running after React has already moved on.

That is why the abort signal belongs inside `fetch()`, not only around `setState()`. The real stale work is the request itself. If you only guard the final state write, the old lease still burns bandwidth, can still resolve out of order, and still leaves React code explaining why a request it no longer wanted was allowed to finish anyway.

### How to Decompose This

Before you write the hook, answer three questions:

1. Which parts of device loading belong in the hook state itself, and which belong in the fetch helper?
2. Where does the abort signal need to travel so cleanup cancels the actual request instead of merely suppressing the final `setState()` call?
3. What behavior would React StrictMode show in development if the effect starts a request but never tears it down?

---

## Building It

Project state entering this scenario is now specific. `src/types/api.ts` already defines the shared `Device` contract, and the previous scenario created a typed fetch boundary in `src/api/client.ts` plus a device-specific `fetchDevices()` helper in `src/api/devices.ts`. What still does not exist is the React bridge between that promise-based fetch layer and the screen states a component needs. This scenario adds that bridge, but it stops before rendering the data. The hook should own async state and cancellation so the next UI lesson can consume a stable contract instead of rebuilding request logic in `App.tsx`.

### Step 1: Make the hook own the async branch, not just the request

Start by deciding what `useDevices()` returns. A component that consumes the hook should not have to infer whether data is loading from `devices.length === 0`, and it should not have to catch promise failures itself. The hook needs to expose the result of the request as React state.

One clear shape is a small object with device data, a loading flag, and an error message:

```ts
type UseDevicesResult = {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
};
```

This is the same design pressure as the earlier state-modeling work, but focused on async data. The hook is responsible for saying whether the request is still in flight, whether it failed, and what data arrived. A caller should be able to render from the hook's state immediately instead of re-deriving those meanings from raw promise behavior.

### Step 2: Thread cancellation through the fetch boundary first

Before `useEffect()` can clean anything up, the fetch layer has to accept a signal. If `src/api/client.ts` calls `fetch(url)` with no signal parameter, then the hook has nothing concrete to cancel. That is the first important architectural move in this lesson: the effect owns the controller, but the request boundary must accept the signal.

The low-level wrapper should forward request init through to `fetch()`:

```ts
export async function apiFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

Then the domain-specific helper can expose cancellation without leaking transport details into the component:

```ts
export function fetchDevices(signal?: AbortSignal): Promise<Device[]> {
  return apiFetch<Device[]>('/mocks/devices.json', { signal });
}
```

This is the answer to "why does the signal go into `fetch()` instead of a `setState` guard?" Because cancellation is a transport concern first. The hook should stop the request at the source, not let the request finish and then pretend the result no longer matters.

### Step 3: Create one controller per effect run, and abort it in cleanup

Once the fetch path accepts a signal, the hook can create the controller inside `useEffect()` so each effect run owns exactly one request.

```ts
export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    fetchDevices(controller.signal)
      .then((nextDevices) => {
        setDevices(nextDevices);
        setIsLoading(false);
      })
      .catch((caughtError: unknown) => {
        if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
          return;
        }

        setError(
          caughtError instanceof Error ? caughtError.message : 'Unable to load devices',
        );
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { devices, isLoading, error };
}
```

The placement matters. The controller is created inside the effect because it belongs to that run of the effect, not to the component forever. The cleanup aborts that exact request when React tears the effect down. If the component unmounts mid-fetch without this cleanup, the browser still carries the request forward, the promise still settles later, and the old effect instance still attempts to finish work after the screen that asked for it is gone.

### Step 4: Abort should be silent cleanup, real failures should still surface

An aborted request is not the same as a failed request. It means React intentionally tore the effect down. That can happen because the component unmounted, because a dependency changed and a newer effect run replaced the old one, or because StrictMode is verifying the cleanup path during development.

That is why the `catch` branch must distinguish abort from real error:

```ts
if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
  return;
}
```

If you treat abort the same as a server failure, the UI will show an error for a path React deliberately initiated as cleanup. That is a semantic bug. Cleanup is expected control flow, not a user-visible failure.

At the same time, a plain `isMounted` guard does not solve this correctly. It can stop `setState()` after unmount, but it does not cancel the request itself. The stale network work still finishes, and if dependencies ever change quickly, an older response can still race a newer one. Aborting the request is the stronger design because it ends the obsolete work instead of just hiding the final state write.

### Step 5: Let StrictMode prove whether setup and cleanup are actually paired

React StrictMode in development intentionally runs effect setup, then cleanup, then setup again for the same mount. It is testing whether your side effect is resilient to being started and stopped. With correct cleanup, the first request is aborted immediately and only the active effect run remains relevant. Without cleanup, StrictMode exposes the flaw by creating duplicate in-flight requests for what looks like one screen render.

That is the practical signal the interviewer is looking for. Missing cleanup is not just a theoretical leak. In StrictMode you will often see:

- two fetches for the same data during development
- stale requests finishing after a newer effect run has already started
- state churn that is hard to explain because the component appears to "load twice"

StrictMode is useful here because it makes an asymmetrical effect visible early. If setup starts a request and cleanup does nothing, React can show you that mismatch before production traffic turns it into a harder-to-reproduce race.

---

## Why This Way

`useDevices()` should own async state because the component that consumes it needs screen-ready state, not a raw promise. The fetch layer should stay responsible for HTTP transport and typed payload boundaries, while the hook turns that promise lifecycle into React state.

The abort signal must travel into `fetch()` because the problem is not only a stale `setState()`. The obsolete request itself is the stale work. Cancelling at the boundary stops wasted network activity, prevents old requests from needlessly resolving, and keeps cleanup aligned with the side effect that was actually created.

StrictMode matters because it stress-tests whether setup and cleanup are symmetrical. If the effect creates work that cleanup never tears down, StrictMode will usually reveal that bug immediately by double-running the setup in development.

---

## How to Explain It

I treated the effect like a lease on one request. `useDevices()` owns the loading, error, and data state, but the actual cancellation has to happen at the fetch boundary, so I threaded `AbortSignal` from the hook into `fetchDevices()` and down to `fetch()`. If the component unmounts mid-fetch without cleanup, the request keeps running after the screen is gone and may still resolve stale work later. StrictMode exposes that bug because it intentionally runs setup, cleanup, and setup again during development, which turns a missing teardown into duplicate in-flight requests.

---

## Checkpoint

- What wasted work still happens if you keep an `isMounted` flag but never pass an abort signal into `fetch()`?
- Why is an aborted request a cleanup path rather than a user-facing error state?

:::evaluator
Explain why the abort signal has to reach `fetch()` instead of living only in a post-request `setState` guard. Then walk through what happens when the component unmounts halfway through the request, and tell me exactly how React StrictMode would expose a missing cleanup in development.
:::
