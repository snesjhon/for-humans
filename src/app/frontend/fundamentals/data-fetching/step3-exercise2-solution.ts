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

function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const [state, dispatch] = useReducer(asyncReducer<T>, { status: 'idle' });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'fetch' });

    fetcher(controller.signal)
      .then(data => dispatch({ type: 'resolve', data }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          dispatch({ type: 'reject', error: err });
        }
      });

    return () => controller.abort();
  }, [fetcher]);

  return state;
}

// ---Tests
test('passes an AbortSignal to the fetcher', () => {
  const signals: AbortSignal[] = [];
  const fetcher = jest.fn((signal: AbortSignal) => {
    signals.push(signal);
    return new Promise<string>(() => {});
  });

  renderHook(() => useFetch(fetcher));

  expect(fetcher).toHaveBeenCalledWith(expect.any(AbortSignal));
  expect(signals[0].aborted).toBe(false);
});

test('aborts the in-flight fetch when the component unmounts', () => {
  const signals: AbortSignal[] = [];
  const fetcher = jest.fn((signal: AbortSignal) => {
    signals.push(signal);
    return new Promise<string>(() => {});
  });

  const { unmount } = renderHook(() => useFetch(fetcher));
  act(() => { unmount(); });

  expect(signals[0].aborted).toBe(true);
});

test('does not dispatch error state when the fetch is aborted', async () => {
  const fetcher = jest.fn((signal: AbortSignal) =>
    new Promise<string>((_, reject) => {
      signal.addEventListener('abort', () =>
        reject(new DOMException('Aborted', 'AbortError'))
      );
    })
  );

  const { result, unmount } = renderHook(() => useFetch(fetcher));
  await act(async () => { unmount(); });

  expect(result.current.status).not.toBe('error');
});

test('resolves to success when fetch completes normally', async () => {
  const fetcher = jest.fn((_signal: AbortSignal) => Promise.resolve('data'));
  const { result } = renderHook(() => useFetch(fetcher));

  await act(async () => {});

  expect(result.current.status).toBe('success');
  if (result.current.status === 'success') {
    expect(result.current.data).toBe('data');
  }
});
// ---End Tests
