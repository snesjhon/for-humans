/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useEffect } from 'react';

// AbortController, Level 3: cleanup aborts the previous request
// Goal: abort the in-flight request during cleanup.
type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<unknown>;

function useAbortOnCleanup(url: string, fetchImpl: FetchLike) {
  useEffect(() => {
    const controller = new AbortController();
    fetchImpl(url, { signal: controller.signal });

    // TODO: abort the controller when the effect is replaced or unmounted.
  }, [url, fetchImpl]);
}

test.skip('rerender aborts the previous request before starting the next one', () => {
  const seenSignals: AbortSignal[] = [];
  const fetchImpl = jest.fn(async (_url: string, init?: { signal?: AbortSignal }) => {
    if (init?.signal) {
      seenSignals.push(init.signal);
    }

    return { ok: true };
  });

  const { rerender } = renderHook(
    ({ url }) => useAbortOnCleanup(url, fetchImpl),
    { initialProps: { url: '/api/devices' } },
  );

  rerender({ url: '/api/devices?refresh=1' });

  expect(seenSignals).toHaveLength(2);
  expect(seenSignals[0].aborted).toBe(true);
  expect(seenSignals[1].aborted).toBe(false);
});
