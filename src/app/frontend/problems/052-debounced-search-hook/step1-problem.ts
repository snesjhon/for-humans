/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';

// Goal: return a debounced copy of `value` that updates only after the value
// has been stable for `delay` milliseconds. Cancel the pending timer whenever
// a new value arrives or the hook unmounts.
export function useDebounce<T>(value: T, delay: number): T {
  // TODO: Keep a debounced copy of `value` in state, starting at the initial value
  // TODO: Use useEffect to schedule a timer that updates the debounced value after `delay`
  // TODO: Return a cleanup that cancels the pending timer
  return value;
}

// ---Tests
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('debounced value starts equal to the initial value', () => {
  const { result } = renderHook(() => useDebounce('tea', 300));
  expect(result.current).toBe('tea');
});

test('debounced value does not update before the delay has passed', () => {
  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useDebounce(value, 300),
    { initialProps: { value: 'g' } },
  );

  rerender({ value: 'gr' });
  act(() => {
    jest.advanceTimersByTime(299);
  });

  expect(result.current).toBe('g');
});

test('debounced value updates after the full delay has passed', () => {
  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useDebounce(value, 300),
    { initialProps: { value: 'g' } },
  );

  rerender({ value: 'gr' });
  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(result.current).toBe('gr');
});

test('rapid changes reset the timer so only the final value is emitted', () => {
  const { result, rerender } = renderHook(
    ({ value }: { value: string }) => useDebounce(value, 300),
    { initialProps: { value: '' } },
  );

  rerender({ value: 't' });
  act(() => { jest.advanceTimersByTime(100); });

  rerender({ value: 'te' });
  act(() => { jest.advanceTimersByTime(100); });

  rerender({ value: 'tea' });
  act(() => { jest.advanceTimersByTime(100); });

  // 300ms total elapsed but no single timer completed its full duration
  expect(result.current).toBe('');

  act(() => { jest.advanceTimersByTime(200); });

  expect(result.current).toBe('tea');
});
// ---End Tests
