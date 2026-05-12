/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: abort is not an error
// Goal: useFetchDevice has the AbortController pattern in place, but the catch handler
// sets the error state for every thrown value including AbortError. When the component
// navigates away or a dep changes, the intentional abort fires and the hook reports
// an error to the UI — even though nothing actually went wrong. Add a guard in the
// catch handler: only set error state when the thrown value is not an AbortError.
function useFetchDevice(deviceId: string) {
  const [data, setData] = useState<{ id: string; status: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/devices/${deviceId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err: unknown) => {
        // BUG: treats AbortError the same as a real network failure
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      });

    return () => controller.abort();
  }, [deviceId]);

  return { data, error };
}

// ---Tests
test('does not set error state when the fetch is intentionally aborted', async () => {
  global.fetch = jest.fn((_url: RequestInfo | URL, opts?: RequestInit) => {
    return new Promise<Response>((_res, rej) => {
      opts?.signal?.addEventListener('abort', () =>
        rej(new DOMException('This operation was aborted', 'AbortError')),
      );
    });
  }) as typeof fetch;

  const { rerender, result } = renderHook(({ id }) => useFetchDevice(id), {
    initialProps: { id: 'device-1' },
  });

  await act(async () => {
    rerender({ id: 'device-2' }); // triggers cleanup → abort → AbortError in catch
    await Promise.resolve();
  });

  expect(result.current.error).toBeNull(); // intentional abort must not set error state
});
// ---End Tests
