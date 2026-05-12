/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: stale response overwrites fresh data
// Goal: useFetchDevice shows where missing cleanup causes visible data corruption.
// Two requests are in-flight for different deviceIds. The newer request resolves first.
// Without abort, the older slower request resolves second and overwrites the fresh
// result with stale data. Add AbortController cleanup so the old request is cancelled
// when deviceId changes and its late response never reaches setData.
function useFetchDevice(deviceId: string) {
  const [data, setData] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    // TODO: create an AbortController, pass its signal to fetch, and abort on cleanup.
    // The catch handler below already ignores errors — AbortError will be swallowed.
    fetch(`/api/devices/${deviceId}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [deviceId]);

  return data;
}

// ---Tests
test('shows data from the most recently requested device, not an older slower one', async () => {
  type Resolver = () => void;
  let resolveFirst!: Resolver;
  let resolveSecond!: Resolver;

  let callCount = 0;
  global.fetch = jest.fn((_url: RequestInfo | URL, opts?: RequestInit) => {
    callCount++;
    if (callCount === 1) {
      return new Promise<Response>((res, rej) => {
        resolveFirst = () =>
          res({ ok: true, json: async () => ({ id: 'device-1', status: 'offline' }) } as Response);
        opts?.signal?.addEventListener('abort', () =>
          rej(new DOMException('Aborted', 'AbortError')),
        );
      });
    }
    return new Promise<Response>((res) => {
      resolveSecond = () =>
        res({ ok: true, json: async () => ({ id: 'device-2', status: 'online' }) } as Response);
    });
  }) as typeof fetch;

  const { rerender, result } = renderHook(({ id }) => useFetchDevice(id), {
    initialProps: { id: 'device-1' },
  });

  rerender({ id: 'device-2' }); // cleanup should abort fetch for device-1

  await act(async () => {
    resolveSecond(); // newer request resolves first
    await Promise.resolve();
  });

  await act(async () => {
    resolveFirst(); // older request resolves late — should be ignored after abort
    await Promise.resolve();
  });

  expect(result.current?.id).toBe('device-2'); // stale device-1 response must not win
});
// ---End Tests
