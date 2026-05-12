/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Drift Trap, Level 2: tick counter vs real clock
// Goal: capture Date.now() at setup and compute elapsed seconds from that reference
// so the hook returns accurate time regardless of how often the interval fires.
function useElapsedSeconds(tickMs: number) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000));
    }, tickMs);

    return () => clearInterval(id);
  }, [tickMs]);

  return seconds;
}

// ---Tests
test('returns elapsed whole seconds regardless of tick rate', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useElapsedSeconds(200));

  act(() => {
    jest.advanceTimersByTime(2000); // 2 real seconds, but 10 ticks at 200ms
  });

  expect(result.current).toBe(2);

  jest.useRealTimers();
});
// ---End Tests
