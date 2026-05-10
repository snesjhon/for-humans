/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Stale Closures, Level 1: fix with functional updater
// Goal: the counter never goes above 1 because setCount(count + 1) reads the frozen snapshot —
// count is always 0 inside the interval. Fix it using the functional updater form so each
// increment reads from React's current state instead of the photograph.
function useIncrementor(delay: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + 1); // functional updater reads from React's current state
    }, delay);
    return () => clearInterval(id);
  }, [delay]);

  return count;
}

test('count increments correctly across five ticks', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useIncrementor(1000));

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(result.current).toBe(5);

  jest.useRealTimers();
});
