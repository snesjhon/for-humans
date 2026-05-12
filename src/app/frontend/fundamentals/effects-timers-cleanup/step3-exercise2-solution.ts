/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: stale response overwrites fresh data
// Goal: abort the old request on cleanup so its late response never calls setData
// after the dep has already moved on to a newer deviceId.
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

  rerender({ id: 'device-2' }); // cleanup aborts fetch for device-1

  await act(async () => {
    resolveSecond(); // newer request resolves first
    await Promise.resolve();
  });

  await act(async () => {
    resolveFirst(); // older request resolves late — aborted, so setData is never called
    await Promise.resolve();
  });

  expect(result.current?.id).toBe('device-2');
});
// ---End Tests
