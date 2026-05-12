/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: the kill signal for in-flight requests
// Goal: useFetchDevice issues a fetch request when deviceId changes. Without a cleanup
// function, the in-flight request from the previous deviceId keeps running after the
// dep changes — there is no kill wire connected to the fetch. Add an AbortController:
// pass its signal into fetch, and return a cleanup function that calls controller.abort()
// so the old request is cancelled before the new one starts.
function useFetchDevice(deviceId: string) {
  const [data, setData] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    // TODO: create an AbortController, pass { signal: controller.signal } to fetch,
    // and return () => controller.abort() as the cleanup function
    fetch(`/api/devices/${deviceId}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [deviceId]);

  return data;
}

// ---Tests
test('aborts the previous fetch when deviceId changes', async () => {
  const abortedSignals: AbortSignal[] = [];

  global.fetch = jest.fn((_url: RequestInfo | URL, opts?: RequestInit) => {
    if (opts?.signal) {
      opts.signal.addEventListener('abort', () =>
        abortedSignals.push(opts.signal as AbortSignal),
      );
    }
    return new Promise<Response>(() => {}); // never resolves — we only care about abort
  }) as typeof fetch;

  const { rerender } = renderHook(({ id }) => useFetchDevice(id), {
    initialProps: { id: 'device-1' },
  });

  await act(async () => {
    rerender({ id: 'device-2' }); // cleanup should fire, aborting the device-1 fetch
  });

  expect(abortedSignals).toHaveLength(1); // one fetch was aborted
});
// ---End Tests
