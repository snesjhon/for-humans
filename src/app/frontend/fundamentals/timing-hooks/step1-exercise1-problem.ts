/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Stale Closures, Level 1: reproduce the bug
// Goal: read the hook below and predict what snapshot will hold after 3 ticks — the interval
// took a photograph of count when it was created. Then change test.skip to test and confirm.
function useTickSnapshot(delay: number) {
  const [count, setCount] = useState(0);
  const [snapshot, setSnapshot] = useState(-1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
      setSnapshot(count); // count is frozen at the value from the first render
    }, delay);
    return () => clearInterval(id);
  }, [delay]);

  return { count, snapshot };
}

test.skip('snapshot reads the stale count from when the interval was created', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useTickSnapshot(1000));

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(result.current.count).toBe(3);
  // The stale closure only ever saw count = 0
  expect(result.current.snapshot).toBe(0);

  jest.useRealTimers();
});
