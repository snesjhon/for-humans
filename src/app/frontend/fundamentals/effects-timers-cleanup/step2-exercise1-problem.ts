/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Drift Trap, Level 2: tick counter vs real clock
// Goal: useElapsedSeconds should return the number of whole seconds elapsed since mount.
// The current implementation uses a tick counter: it increments by 1 per interval fire.
// Predict: with tickMs=200 (5 fires per second), what does the hook return after 2 real
// seconds? Then replace the counter with a Date.now() calculation so the return value
// reflects actual elapsed time regardless of how often the interval fires.
function useElapsedSeconds(tickMs: number) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1); // BUG: counts ticks, not elapsed seconds
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
