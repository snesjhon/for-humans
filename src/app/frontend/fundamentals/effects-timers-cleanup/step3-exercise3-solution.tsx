/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

function useInterval(callback: () => void, delayMs: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }); // no dep array: always reflects the latest callback

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]); // restarts only when the delay changes
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
  expect(tick).toHaveBeenCalledTimes(2);
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
