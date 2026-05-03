/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useReducer, useEffect, useState } from 'react';

// Goal: implement usePaginatedFetch — a hook that re-fetches when the page changes.
//
// Design question to answer before writing: is page part of AsyncState, or separate?
// Answer: page is separate state (useState). Changing page triggers the effect,
// which resets to 'loading' and starts a new fetch. AsyncState<T> stays focused
// on the async lifecycle; page is an independent dimension.
//
// The hook should return: { state, page, setPage }

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

// TODO: implement usePaginatedFetch
// - page starts at 1
// - fetcher is (page: number, signal: AbortSignal) => Promise<T>
// - changing page via setPage should trigger a new fetch
// - include AbortController cleanup
function usePaginatedFetch<T>(fetcher: (page: number, signal: AbortSignal) => Promise<T>): {
  state: AsyncState<T>;
  page: number;
  setPage: (page: number) => void;
} {
  throw new Error('not implemented');
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
  // Changing page should trigger loading state
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
