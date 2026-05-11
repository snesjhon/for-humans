/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

// Stale Closures, Level 1: fix with useRef
// Goal: useCounterWithStep already uses the functional updater for count, but step is a prop that
// can change and is still a stale read inside the interval. The functional updater from Exercise 1
// only supplies the previous value of the state being updated — it cannot read the latest step.
// Add a ref that tracks the latest step and read from it inside the interval.
function useCounterWithStep(step: number, delay: number) {
  const [count, setCount] = useState(0);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + stepRef.current); // reads the latest step through the stable ref
    }, delay);
    return () => clearInterval(id);
  }, [delay]);

  return count;
}

// ---Tests
test('useCounterWithStep uses the latest step after it changes', () => {
  jest.useFakeTimers();

  const { result, rerender } = renderHook(
    ({ step, delay }: { step: number; delay: number }) => useCounterWithStep(step, delay),
    { initialProps: { step: 1, delay: 1000 } },
  );

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(result.current).toBe(2);

  rerender({ step: 5, delay: 1000 });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(result.current).toBe(7);

  jest.useRealTimers();
});
// ---End Tests
