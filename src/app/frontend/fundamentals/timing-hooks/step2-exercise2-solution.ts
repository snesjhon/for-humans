/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Debounce, Level 2: debounced value hook
// Goal: implement useDebounce so the returned value only updates after delay ms of input silence —
// the hook shape for a search input where onChange fires on every keystroke but the filter only
// runs after the user pauses. Schedule the update and cancel it if value changes first.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
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
