/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

// Throttle, Level 3: throttled value hook
// Goal: implement useThrottle so the returned value updates at most once per limit ms —
// the hook shape for scroll position or window size, where the raw value changes continuously
// but downstream work should run at a controlled rate. Use useRef to store the last-invocation
// timestamp without triggering a re-render.
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastCalledRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCalledRef.current >= limit) {
      lastCalledRef.current = now;
      setThrottledValue(value);
    }
  }, [value, limit]);

  return throttledValue;
}

test('useThrottle limits updates to once per limit window', () => {
  jest.useFakeTimers();

  const { result, rerender } = renderHook(
    ({ value }: { value: number }) => useThrottle(value, 300),
    { initialProps: { value: 0 } },
  );

  expect(result.current).toBe(0);

  act(() => {
    rerender({ value: 1 });
  });
  expect(result.current).toBe(0);

  act(() => {
    jest.advanceTimersByTime(300);
  });

  act(() => {
    rerender({ value: 2 });
  });
  expect(result.current).toBe(2);

  act(() => {
    rerender({ value: 3 });
  });
  expect(result.current).toBe(2);

  jest.useRealTimers();
});
