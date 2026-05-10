/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Stale Closures, Level 1: fix with useRef
// Goal: add the one line that keeps callbackRef.current in sync with the latest callback on every
// render. The functional updater from Exercise 2 cannot help — this problem is reading a prop, not
// updating state. The ref is the window; the interval always reads the current value through it.
function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  // TODO: update callbackRef.current on every render so the interval always calls the latest version

  useEffect(() => {
    const id = setInterval(() => {
      callbackRef.current(); // reads from the ref — but the ref is stale until you fix the TODO above
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

test.skip('useInterval always calls the latest callback', () => {
  jest.useFakeTimers();

  let version = 1;
  const log: number[] = [];

  const { rerender } = renderHook(
    ({ cb, delay }: { cb: () => void; delay: number }) => useInterval(cb, delay),
    { initialProps: { cb: () => log.push(version), delay: 1000 } },
  );

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(log).toEqual([1]);

  version = 2;
  rerender({ cb: () => log.push(version), delay: 1000 });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(log).toEqual([1, 2]);

  jest.useRealTimers();
});
