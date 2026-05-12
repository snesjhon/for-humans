/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Drift Trap, Level 2: countdown that decrements per tick
// Goal: useCountdown(totalSeconds, tickMs) should return the number of whole seconds
// remaining. The current implementation decrements by 1 per interval fire, which means
// the countdown runs faster than real time when tickMs < 1000. Predict: starting from
// 5 seconds with tickMs=200, what does the hook return after 2 real seconds? Then fix
// it: compute remaining seconds from a Date.now() reference so the countdown tracks
// actual elapsed time regardless of tick rate.
function useCountdown(totalSeconds: number, tickMs: number) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1); // BUG: decrements per tick, not per elapsed second
    }, tickMs);

    return () => clearInterval(id);
  }, [totalSeconds, tickMs]);

  return secondsLeft;
}

// ---Tests
test('counts down in real seconds regardless of tick rate', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useCountdown(5, 200));

  act(() => {
    jest.advanceTimersByTime(2000); // 2 real seconds elapsed, 10 ticks at 200ms
  });

  expect(result.current).toBe(3); // 5 - 2 elapsed seconds

  jest.useRealTimers();
});
// ---End Tests
