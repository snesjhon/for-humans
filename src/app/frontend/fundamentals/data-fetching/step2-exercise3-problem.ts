/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useReducer, useEffect } from 'react';

// Goal: implement useAsyncState<T> using useReducer and AsyncState<T>.
// The hook should start as { status: 'idle' }, transition to 'loading' when the
// effect fires, then settle into 'success' or 'error' based on the fetcher result.

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

// TODO: implement useAsyncState using useReducer(asyncReducer, { status: 'idle' })
// Dispatch 'fetch' when the effect fires.
// Dispatch 'resolve' or 'reject' based on the fetcher's result.
function useAsyncState<T>(fetcher: () => Promise<T>): AsyncState<T> {
  throw new Error('not implemented');
}

// ---Tests
test('starts in idle state', () => {
  const fetcher = jest.fn().mockResolvedValue('hello');
  const { result } = renderHook(() => useAsyncState(fetcher));
  // The hook starts idle before the effect fires
  // (after the first render, the effect may have already fired in jsdom)
  expect(['idle', 'loading']).toContain(result.current.status);
});

test('transitions through loading to success', async () => {
  const fetcher = jest.fn().mockResolvedValue('hello');
  const { result } = renderHook(() => useAsyncState(fetcher));

  await act(async () => {});

  expect(result.current.status).toBe('success');
  if (result.current.status === 'success') {
    expect(result.current.data).toBe('hello');
  }
});

test('transitions to error when fetcher throws', async () => {
  const err = new Error('fetch failed');
  const fetcher = jest.fn().mockRejectedValue(err);
  const { result } = renderHook(() => useAsyncState(fetcher));

  await act(async () => {});

  expect(result.current.status).toBe('error');
  if (result.current.status === 'error') {
    expect(result.current.error).toBe(err);
  }
});
// ---End Tests
