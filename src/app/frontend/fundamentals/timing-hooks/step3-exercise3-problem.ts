/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCallback, useRef } from 'react';

// Throttle, Level 3: throttled callback hook
// Goal: implement useThrottledCallback so it returns a stable function that throttles calls to fn.
// Use useRef to hold the latest fn and the last-invocation timestamp. The returned callback must
// not change when fn changes between renders — a new fn should be read through the ref, not cause
// the callback to be recreated.
function useThrottledCallback<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const lastCalledRef = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCalledRef.current < limit) return;
      // TODO: update lastCalledRef.current to now and call fnRef.current(...args)
      void args;
    },
    [limit],
  );
}

test.skip('useThrottledCallback enforces a cooldown between invocations', () => {
  jest.useFakeTimers();

  const fn = jest.fn();
  const { result } = renderHook(() => useThrottledCallback(fn, 300));

  const throttled = result.current;

  act(() => {
    throttled('a');
  });
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('a');

  act(() => {
    throttled('b');
    throttled('c');
  });
  expect(fn).toHaveBeenCalledTimes(1);

  act(() => {
    jest.advanceTimersByTime(300);
    throttled('d');
  });
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith('d');

  jest.useRealTimers();
});
