/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Drift Trap, Level 2: countdown that decrements per tick
// Goal: capture Date.now() at setup, then compute remaining seconds as
// totalSeconds - Math.floor(elapsed / 1000) so the countdown tracks actual
// elapsed time and clamps to 0 when the duration expires.
function useCountdown(totalSeconds: number, tickMs: number) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setSecondsLeft(Math.max(0, totalSeconds - elapsed));
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
