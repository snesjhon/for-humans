/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCallback, useRef } from 'react';

// Interview-style mistake, Level 3: stable throttle wrapper with a fresh callback
// Goal: this hook should enforce one cooldown across calls, but parent renders may still replace
// fn. Finish the throttle logic so the wrapper stays stable, the cooldown state persists, and the
// eventual invocation uses the latest fn through the ref instead of recreating the wrapper.
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
      lastCalledRef.current = now;
      fnRef.current(...args);
    },
    [limit],
  );
}

// ---Tests
test('useThrottledCallback enforces a cooldown between invocations', () => {
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
// ---End Tests
