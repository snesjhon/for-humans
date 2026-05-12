/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Goal: Predict why the counter never exceeds 1, then fix the interval callback
// using a functional update so it does not need to close over count at all.
//
// The interval is created once with count = 0. Every tick calls setCount(0 + 1).
// count never updates inside the callback — the closure captured the initial value.

function useStaleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // TODO: replace with setCount(c => c + 1)
    }, 100);
    return () => clearInterval(id);
  }, []);

  return count;
}

// ---Tests
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('count reaches 3 after three interval ticks', () => {
  const { result } = renderHook(() => useStaleCounter());

  act(() => { jest.advanceTimersByTime(300); });

  // Without the fix: count is 1 (stale closure, always setCount(0 + 1))
  expect(result.current).toBe(3);
});

test('count reaches 10 after ten interval ticks', () => {
  const { result } = renderHook(() => useStaleCounter());

  act(() => { jest.advanceTimersByTime(1000); });

  expect(result.current).toBe(10);
});
// ---End Tests
