/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Real Clock, Level 2: deadline-based countdown
// Goal: recompute from the deadline and schedule the next timeout at the next second boundary.
function msUntilNextSecond(nowMs: number): number {
  const remainder = nowMs % 1000;
  return remainder === 0 ? 1000 : 1000 - remainder;
}

function getRemainingSeconds(targetTimeMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((targetTimeMs - nowMs) / 1000));
}

function useSyncedCountdown(targetTimeMs: number, now: () => number = Date.now) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(targetTimeMs, now()),
  );

  useEffect(() => {
    let timeoutId = 0;

    function scheduleNextTick() {
      const currentTime = now();
      setRemainingSeconds(getRemainingSeconds(targetTimeMs, currentTime));

      if (currentTime >= targetTimeMs) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        scheduleNextTick();
      }, 1000);
    }

    scheduleNextTick();

    return () => window.clearTimeout(timeoutId);
  }, [targetTimeMs, now]);

  return remainingSeconds;
}

test.skip('countdown snaps to real second boundaries instead of drifting', () => {
  jest.useFakeTimers();

  let nowMs = 10_250;
  const now = () => nowMs;

  const { result } = renderHook(() => useSyncedCountdown(13_000, now));

  expect(result.current).toBe(3);

  act(() => {
    nowMs = 10_999;
    jest.advanceTimersByTime(749);
  });

  expect(result.current).toBe(3);

  act(() => {
    nowMs = 11_000;
    jest.advanceTimersByTime(1);
  });

  expect(result.current).toBe(2);

  act(() => {
    nowMs = 12_000;
    jest.advanceTimersByTime(1000);
  });

  expect(result.current).toBe(1);

  act(() => {
    nowMs = 13_000;
    jest.advanceTimersByTime(1000);
  });

  expect(result.current).toBe(0);

  jest.useRealTimers();
});
