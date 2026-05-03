/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useReducer, useEffect } from 'react';

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

function useFetch<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [state, dispatch] = useReducer(asyncReducer<T>, { status: 'idle' });

  useEffect(() => {
    dispatch({ type: 'fetch' });
    fetcher()
      .then(data => dispatch({ type: 'resolve', data }))
      .catch((err: Error) => dispatch({ type: 'reject', error: err }));
  }, [fetcher]);

  return state;
}

// ---Tests
test('resolves to success state with data', async () => {
  const fetcher = jest.fn().mockResolvedValue({ id: 1, name: 'Alice' });
  const { result } = renderHook(() => useFetch(fetcher));

  await act(async () => {});

  expect(result.current.status).toBe('success');
  if (result.current.status === 'success') {
    expect(result.current.data).toEqual({ id: 1, name: 'Alice' });
  }
});

test('resolves to error state when fetcher throws', async () => {
  const err = new Error('server error');
  const fetcher = jest.fn().mockRejectedValue(err);
  const { result } = renderHook(() => useFetch(fetcher));

  await act(async () => {});

  expect(result.current.status).toBe('error');
  if (result.current.status === 'error') {
    expect(result.current.error).toBe(err);
  }
});

test('is in loading state while fetcher is pending', async () => {
  let resolve: (value: string) => void;
  const fetcher = jest.fn(() => new Promise<string>(res => { resolve = res; }));
  const { result } = renderHook(() => useFetch(fetcher));

  await act(async () => { await Promise.resolve(); });

  expect(result.current.status).toBe('loading');

  await act(async () => { resolve!('done'); });
  expect(result.current.status).toBe('success');
});
// ---End Tests
