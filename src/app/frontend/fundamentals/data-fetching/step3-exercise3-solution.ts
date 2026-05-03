/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useReducer, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

type AsyncAction<T> =
  | { type: 'fetch' }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: Error };

function asyncReducer<T>(_state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'fetch':   return { status: 'loading' };
    case 'resolve': return { status: 'success', data: action.data };
    case 'reject':  return { status: 'error', error: action.error };
  }
}

function usePaginatedFetch<T>(fetcher: (page: number, signal: AbortSignal) => Promise<T>): {
  state: AsyncState<T>;
  page: number;
  setPage: (page: number) => void;
} {
  const [page, setPage] = useState(1);
  const [state, dispatch] = useReducer(asyncReducer<T>, { status: 'idle' });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'fetch' });

    fetcher(page, controller.signal)
      .then(data => dispatch({ type: 'resolve', data }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          dispatch({ type: 'reject', error: err });
        }
      });

    return () => controller.abort();
  }, [fetcher, page]);

  return { state, page, setPage };
}

// ---Tests
test('starts at page 1 in loading state', async () => {
  const fetcher = jest.fn((_page: number, _signal: AbortSignal) => Promise.resolve('result'));
  const { result } = renderHook(() => usePaginatedFetch(fetcher));

  await act(async () => {});

  expect(result.current.page).toBe(1);
  expect(result.current.state.status).toBe('success');
  expect(fetcher).toHaveBeenCalledWith(1, expect.any(AbortSignal));
});

test('re-fetches with new page when setPage is called', async () => {
  const fetcher = jest.fn((page: number, _signal: AbortSignal) =>
    Promise.resolve(`page-${page}`)
  );
  const { result } = renderHook(() => usePaginatedFetch(fetcher));

  await act(async () => {});
  expect(result.current.state.status).toBe('success');

  act(() => { result.current.setPage(2); });
  expect(result.current.state.status).toBe('loading');

  await act(async () => {});
  expect(result.current.page).toBe(2);
  expect(result.current.state.status).toBe('success');
  if (result.current.state.status === 'success') {
    expect(result.current.state.data).toBe('page-2');
  }
});

test('fetcher is called with the correct page number', async () => {
  const fetcher = jest.fn((_page: number, _signal: AbortSignal) => Promise.resolve('ok'));
  const { result } = renderHook(() => usePaginatedFetch(fetcher));

  await act(async () => {});

  act(() => { result.current.setPage(3); });
  await act(async () => {});

  expect(fetcher).toHaveBeenCalledWith(3, expect.any(AbortSignal));
});
// ---End Tests
