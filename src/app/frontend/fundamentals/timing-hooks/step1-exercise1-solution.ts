/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Stale Closures, Level 1: observe and fix
// Goal: useIncrementor calls setCount(count + 1) but count is the frozen snapshot from the first
// render, so the expression always evaluates to 0 + 1 = 1. Before touching any code, predict what
// result.current will be after 5 ticks. Then fix it: switch to the functional updater form so each
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

// ---Tests
test('count increments correctly across five ticks', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useIncrementor(1000));

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(result.current).toBe(5);

  jest.useRealTimers();
});
// ---End Tests
