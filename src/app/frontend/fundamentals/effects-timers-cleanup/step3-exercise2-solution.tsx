/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

function usePollingInterval(onTick: () => void, intervalMs: number) {
  const callbackRef = useRef(onTick);

  useEffect(() => {
    callbackRef.current = onTick;
  }); // no dep array: syncs the ref after every render

  useEffect(() => {
    const id = setInterval(() => {
      callbackRef.current();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]); // onTick removed: ref handles staleness without a restart
}

// ---Tests
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('calls the initial onTick on each tick', () => {
  const first = jest.fn();
  renderHook(() => usePollingInterval(first, 500));

  act(() => { jest.advanceTimersByTime(500); });

  expect(first).toHaveBeenCalledTimes(1);
});

test('calls the updated onTick after it changes without restarting the interval', () => {
  const first = jest.fn();
  const second = jest.fn();

  const { rerender } = renderHook(
    ({ onTick }: { onTick: () => void }) => usePollingInterval(onTick, 500),
    { initialProps: { onTick: first } }
  );

  act(() => { jest.advanceTimersByTime(500); });
  expect(first).toHaveBeenCalledTimes(1);

  rerender({ onTick: second });

  act(() => { jest.advanceTimersByTime(500); });

  expect(second).toHaveBeenCalledTimes(1);
});
// ---End Tests
