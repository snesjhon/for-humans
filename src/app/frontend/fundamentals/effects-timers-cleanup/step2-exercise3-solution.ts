/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import React from 'react';

// Drift Trap, Level 2: missing cleanup AND tick counting combined
// Goal: fix both bugs — return a cleanup function so StrictMode's second setup replaces
// the first interval, and compute elapsed seconds from a Date.now() reference so the
// value tracks real time regardless of tick rate.
function useAccuratePoller(tickMs: number) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - start) / 1000));
    }, tickMs);

    return () => clearInterval(id);
  }, [tickMs]);

  return secondsElapsed;
}

// ---Tests
test('returns real elapsed seconds with no drift or doubling under StrictMode', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useAccuratePoller(200), {
    wrapper: ({ children }) => React.createElement(React.StrictMode, null, children),
  });

  act(() => {
    jest.advanceTimersByTime(2000); // 2 real seconds
  });

  expect(result.current).toBe(2);

  jest.useRealTimers();
});
// ---End Tests
