/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Goal: Build useInterval(callback, delayMs) — the complete reusable hook that
// combines the useRef callback pattern with a dep-controlled interval.
// The interval restarts only when delayMs changes.
// The callback always reflects the latest version passed by the caller.
//
// This hook appears in the React docs and is a direct senior-interview question.

function useInterval(callback: () => void, delayMs: number) {
  const savedCallback = useRef(callback);

  // TODO: add a useEffect (no dep array) that keeps savedCallback.current = callback
  // after every render so the interval always calls the latest version

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}

// ---Tests
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('calls the callback on each interval tick', () => {
  const tick = jest.fn();
  renderHook(() => useInterval(tick, 200));

  act(() => { jest.advanceTimersByTime(600); });

  expect(tick).toHaveBeenCalledTimes(3);
});

test('stops calling the callback after unmount', () => {
  const tick = jest.fn();
  const { unmount } = renderHook(() => useInterval(tick, 200));

  act(() => { jest.advanceTimersByTime(400); });
  expect(tick).toHaveBeenCalledTimes(2);

  unmount();

  act(() => { jest.advanceTimersByTime(400); });
  expect(tick).toHaveBeenCalledTimes(2); // no additional calls after unmount
});

test('calls the updated callback without restarting the interval', () => {
  const first = jest.fn();
  const second = jest.fn();

  const { rerender } = renderHook(
    ({ cb }: { cb: () => void }) => useInterval(cb, 300),
    { initialProps: { cb: first } }
  );

  act(() => { jest.advanceTimersByTime(300); });
  expect(first).toHaveBeenCalledTimes(1);

  rerender({ cb: second });

  act(() => { jest.advanceTimersByTime(300); });
  expect(second).toHaveBeenCalledTimes(1);
});
// ---End Tests
