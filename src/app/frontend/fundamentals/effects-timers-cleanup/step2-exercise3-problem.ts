/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import React from 'react';

// Drift Trap, Level 2: missing cleanup AND tick counting combined
// Goal: useAccuratePoller returns elapsed whole seconds since mount. The hook shape for
// a display that must show real elapsed time where both the tick rate and StrictMode
// can make a counter-based approach produce the wrong value. This exercise has two bugs:
// no cleanup function (so intervals stack under StrictMode) and a tick counter instead
// of a clock calculation (so a fast tick rate overcounts). Predict: with tickMs=200 in
// StrictMode, how many seconds does the hook report after 2 real seconds? Then fix both
// problems so the hook returns 2.
function useAccuratePoller(tickMs: number) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // BUG 1: no cleanup — intervals stack under StrictMode
    // BUG 2: counts ticks instead of computing from real elapsed time
    const id = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, tickMs);

    void id; // suppress unused-variable warning in problem file
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
