/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCallback, useRef } from 'react';

// Debounce, Level 2: debounced callback hook
// Goal: complete the debounced side-effect shape. The returned function should stay stable across
// renders, but when the timeout finally fires it must call the latest fn, not an old render's
// version. Use the pending timer handle to debounce repeated calls during a typing burst.
function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [delay],
  );
}

// ---Tests
test('useDebouncedCallback only calls through after silence', () => {
  jest.useFakeTimers();

  const fn = jest.fn();
  const { result, rerender } = renderHook(
    ({ cb, delay }: { cb: jest.Mock; delay: number }) => useDebouncedCallback(cb, delay),
    { initialProps: { cb: fn, delay: 300 } },
  );

  const debounced = result.current;

  act(() => {
    debounced('x');
    debounced('y');
    debounced('z');
  });

  expect(fn).not.toHaveBeenCalled();

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('z');

  rerender({ cb: fn, delay: 300 });
  expect(result.current).toBe(debounced);

  jest.useRealTimers();
});
// ---End Tests
