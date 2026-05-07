/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { StrictMode, useEffect } from 'react';

// Lease Contract, Level 1: StrictMode audit
// Goal: make the effect survive StrictMode without leaving two active intervals behind.
function useStrictModeHeartbeat(onBeat: () => void) {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      onBeat();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [onBeat]);
}

test('StrictMode exposes missing cleanup by replaying the effect', () => {
  jest.useFakeTimers();
  const onBeat = jest.fn();

  renderHook(() => useStrictModeHeartbeat(onBeat), {
    wrapper: StrictMode,
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(onBeat).toHaveBeenCalledTimes(1);

  jest.useRealTimers();
});
