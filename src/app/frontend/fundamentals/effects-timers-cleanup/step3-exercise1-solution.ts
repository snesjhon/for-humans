/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: the kill signal for in-flight requests
// Goal: create an AbortController, pass its signal into fetch, and return a cleanup
// that calls controller.abort() so changing deviceId cancels the previous request.
function useFetchDevice(deviceId: string) {
  const [data, setData] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/devices/${deviceId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});

    return () => controller.abort();
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
    rerender({ id: 'device-2' }); // cleanup fires, aborting the device-1 fetch
  });

  expect(abortedSignals).toHaveLength(1); // one fetch was aborted
});
// ---End Tests
