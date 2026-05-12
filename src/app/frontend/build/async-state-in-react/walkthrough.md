# Walkthrough: Async State in React

## How to Approach This

### The Core Insight

The fetch layer already knows how to request devices. The missing decision is who owns the request lifecycle inside React. If `App.tsx` calls `fetchDevices()` directly, the component has to juggle loading, error, success, cleanup, and race conditions all in one place. A custom hook is the boundary where that async lifecycle becomes explicit.

### The Mental Model

Treat `useDevices()` like a radio operator opening a channel to the plant floor. Starting the effect opens the channel. Cleanup must close the same channel. If the component goes away while a request is still in flight, the right fix is not to ignore the message after it arrives. The right fix is to tell the radio to stop transmitting. `AbortController` does that at the source.

### How to Decompose This

Before you write the hook, answer three questions:

1. Which file should own loading, error, and data transitions for the device request?
2. What actually goes wrong if a component unmounts while the request is still in flight and nothing cancels it?
3. Why is passing `signal` into `fetch()` a stronger cleanup strategy than keeping the request alive and only skipping `setState` afterward?

---

## Building It

Project state entering this scenario is now specific. The codebase already has `src/types/api.ts` plus a typed fetch boundary in `src/api/client.ts` and `src/api/devices.ts`. What it does not have yet is a React-side owner for the device request lifecycle. There is no hook that starts the request, models loading and error state for the screen, or cleans up in-flight work when React tears the effect down. That is why this scenario stays centered on `useDevices()` and only asks `App.tsx` to consume the hook, not to own the fetch details itself.

### Step 1: Put the async lifecycle in a custom hook, not in the component body

`App.tsx` needs device data, but it should not also have to define the fetch lifecycle from scratch. The hook is the right place to centralize three things that always travel together:

- the loading branch
- the error branch
- the successful device payload

One straightforward shape is:

```tsx
import { useEffect, useState } from 'react';
import { fetchDevices } from '@/api/devices';
import type { Device } from '@/types/api';

type UseDevicesState = {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
};

export function useDevices(): UseDevicesState {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // request lifecycle goes here
  }, []);

  return { devices, isLoading, error };
}
```

The point is not that this exact state shape is the only valid answer. The point is that React now has one dedicated place where the device request lifecycle can be read, reviewed, and cleaned up.

### Step 2: Start the request inside the effect, and attach cleanup to the same setup

An effect is not "run this on mount." It is "set up a synchronization step, and return how to tear it down." That matters here because the request is the side effect. If the effect starts a fetch, the cleanup should stop that fetch when React no longer wants the result.

That is where `AbortController` belongs:

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function loadDevices() {
    try {
      setIsLoading(true);
      setError(null);

      const nextDevices = await fetchDevices(controller.signal);

      setDevices(nextDevices);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      setError(error instanceof Error ? error.message : 'Failed to load devices');
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  void loadDevices();

  return () => {
    controller.abort();
  };
}, []);
```

There are two reviewable decisions here.

First, the controller is created inside the effect because it belongs to one effect run, not to the component forever. If StrictMode tears the effect down and re-runs it in development, each run gets its own request and its own cleanup.

Second, aborted requests are treated as expected cleanup. They should not surface as "something went wrong" to the user, because React intentionally ended the effect.

### Step 3: Put the abort signal into the fetch boundary, not into a `setState` guard

This is the important architectural tension in the lesson. A boolean like `let isMounted = true` can stop one symptom, but it does not stop the side effect itself.

```tsx
useEffect(() => {
  let isMounted = true;

  fetchDevices().then((nextDevices) => {
    if (isMounted) {
      setDevices(nextDevices);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);
```

That pattern still leaves the request running after unmount. The browser still spends time on the network. The response can still arrive after React has moved on. A remount can still create a second request while the first one is unresolved. You suppressed the final state write, but you did not clean up the underlying work.

Passing `signal` into the fetch layer fixes the real problem:

```ts
export async function apiFetch<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

Then the device-specific helper can keep its boundary while still accepting cleanup control from the hook:

```ts
import type { Device } from '@/types/api';
import { apiFetch } from './client';

export function fetchDevices(signal?: AbortSignal): Promise<Device[]> {
  return apiFetch<Device[]>('/mocks/devices.json', signal);
}
```

That is why the abort signal belongs in `fetch()`. Cleanup should terminate the actual side effect, not merely hide one downstream consequence of it.

### Step 4: Know what fails when cleanup is missing

If the component unmounts mid-fetch and nothing aborts the request, the request keeps going. The response may resolve after the screen that asked for it no longer exists. At best, that is wasted work. At worst, it creates stale timing where an earlier request resolves after a newer render path has already started something else.

In development, StrictMode makes this easier to notice because React intentionally runs the effect setup, then cleanup, then setup again to expose side effects that are not paired correctly. Without cleanup, that means:

- the first effect run starts a request
- React simulates teardown
- the second effect run starts another request
- the first request is still alive because nothing cancelled it

Now you have duplicate in-flight work, and whichever response resolves later can still try to update state unless the request was actually aborted. StrictMode is not creating the bug. It is surfacing the missing cleanup that already existed.

### Step 5: Let `App.tsx` consume the hook and keep screen branches simple

Once the hook owns the request lifecycle, `App.tsx` should become smaller, not smarter. It should import `useDevices()`, render the top-level loading and error branches, and hand the device data to the ready branch without reaching back into fetch logic.

```tsx
import { useDevices } from '@/hooks/useDevices';

export default function App() {
  const { devices, isLoading, error } = useDevices();

  if (isLoading) {
    return <main>Loading plant floor data...</main>;
  }

  if (error) {
    return (
      <main>
        <h1>Plant Floor Monitor</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Plant Floor Monitor</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>{device.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

This is intentionally minimal. The next rendering-focused scenario can extract `DeviceList`, `DeviceCard`, and `StatusBadge`. This lesson earns the async lifecycle boundary first.

---

## Why This Way

The custom hook owns the request lifecycle because loading, error, success, and cleanup are one React concern. If that logic stays in `App.tsx`, the component becomes the fetch orchestrator and the screen renderer at the same time.

`AbortController` is the correct cleanup tool because it terminates the side effect at its source. A `setState` guard only prevents one later consequence. It does not stop the request, avoid duplicate in-flight work, or reduce race pressure when effects are torn down and restarted.

StrictMode is useful here because it makes missing cleanup visible during development. By running setup and cleanup twice, it exposes whether the first effect run left work behind. If the first request survives teardown, the component is already relying on luck.

---

## How to Explain It

I put the device request lifecycle in `useDevices()` so the component can depend on one hook result instead of owning fetch setup, error handling, and cleanup inline. I used `AbortController` inside the effect because cleanup should cancel the request itself, not just prevent one later `setState`. I threaded `signal` through `fetchDevices()` and `apiFetch()` so the abort reaches the actual `fetch()` call. If the component unmounts mid-request and nothing aborts it, the browser still completes the work and the response can resolve after React no longer wants it. StrictMode exposes that mistake by tearing the effect down and starting it again in development, which quickly reveals duplicated in-flight requests when cleanup is missing.

---

## Checkpoint

- What concrete work is still happening if you only guard `setState` after unmount instead of aborting the fetch?
- Why does StrictMode's extra setup and cleanup cycle make a missing abort easier to spot during development?

:::evaluator
Defend the cleanup strategy in this hook. What happens if the component unmounts mid-fetch and nothing aborts the request, why does the abort signal belong in `fetch()` instead of an `isMounted` or "skip `setState`" guard, and how does StrictMode expose the missing cleanup when the effect is re-run in development?
:::
