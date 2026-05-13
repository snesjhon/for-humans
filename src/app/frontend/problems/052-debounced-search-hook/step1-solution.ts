/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
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

  expect(result.current).toBe('');

  act(() => { jest.advanceTimersByTime(200); });

  expect(result.current).toBe('tea');
});
// ---End Tests
