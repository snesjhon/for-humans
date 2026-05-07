/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';

// AbortController, Level 3: full hook
// Goal: fetch JSON, abort obsolete requests in cleanup, and ignore AbortError.
type AsyncState<TData> =
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };

type FetchJson = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<{ json(): Promise<unknown> }>;

function useAbortableJson<TData>(url: string, fetchJson: FetchJson): AsyncState<TData> {
  const [state, setState] = useState<AsyncState<TData>>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: 'loading' });

    fetchJson(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setState({ status: 'success', data: data as TData });
      })
      .catch((error: Error) => {
        setState({ status: 'error', error: error.message });
      });

    // TODO: abort the request in cleanup.
    // TODO: ignore AbortError instead of surfacing it as a real error.
  }, [url, fetchJson]);

  return state;
}

test.skip('useAbortableJson ignores the aborted request and keeps the latest success', async () => {
  const resolvers = new Map<string, () => void>();
  const seenSignals: AbortSignal[] = [];

  const fetchJson: FetchJson = jest.fn((input: string, init?: { signal?: AbortSignal }) => {
    if (init?.signal) {
      seenSignals.push(init.signal);
    }

    return new Promise((resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('Request aborted', 'AbortError'));
      });

      resolvers.set(input, () => {
        resolve({
          json: async () => ({ url: input }),
        });
      });
    });
  });

  const { result, rerender } = renderHook(
    ({ url }) => useAbortableJson<{ url: string }>(url, fetchJson),
    { initialProps: { url: '/api/devices?page=1' } },
  );

  rerender({ url: '/api/devices?page=2' });

  resolvers.get('/api/devices?page=2')?.();

  await waitFor(() => {
    expect(result.current).toEqual({
      status: 'success',
      data: { url: '/api/devices?page=2' },
    });
  });

  expect(seenSignals[0].aborted).toBe(true);
});
