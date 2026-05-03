/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useReducer, useEffect } from 'react';

// Goal: implement useFetch<T> — the basic typed async hook.
// The hook accepts a fetcher of type () => Promise<T> and returns AsyncState<T>.
// It starts as { status: 'idle' }, transitions to 'loading' when the effect fires,
// and settles into 'success' or 'error' based on the fetcher result.
//
// Do not add AbortController yet — focus on the state transitions.

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

// TODO: implement useFetch using useReducer(asyncReducer, { status: 'idle' })
// Call fetcher() in a useEffect, dispatch the result.
function useFetch<T>(fetcher: () => Promise<T>): AsyncState<T> {
  throw new Error('not implemented');
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

  // Let the effect fire but not resolve
  await act(async () => { await Promise.resolve(); });

  expect(result.current.status).toBe('loading');

  await act(async () => { resolve!('done'); });
  expect(result.current.status).toBe('success');
});
// ---End Tests
