/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Debounce, Level 2: debounced value hook
// Goal: implement useDebounce so the returned value only updates after delay ms of input silence.
// This is the hook shape where raw input state changes immediately, but the expensive work reads a
// debounced value that only updates after the user pauses.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}

// ---Tests
test('useDebounce returns the updated value only after the delay', () => {
  jest.useFakeTimers();

  const { result, rerender } = renderHook(
    ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
    { initialProps: { value: 'a', delay: 300 } },
  );

  expect(result.current).toBe('a');

  rerender({ value: 'ab', delay: 300 });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  expect(result.current).toBe('a');

  rerender({ value: 'abc', delay: 300 });

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(result.current).toBe('abc');

  jest.useRealTimers();
});
// ---End Tests
