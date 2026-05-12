/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Goal: Use a ref to hold a pointer to the latest onTick so the interval always
// calls the current version without restarting when onTick changes.
// The hook shape for a polling interval where the callback reads external state.
//
// The current implementation captures onTick at setup. When onTick changes,
// the interval keeps calling the original function — the new one is never reached.
// Add useRef to your imports once you start the fix.

function usePollingInterval(onTick: () => void, intervalMs: number) {
  // TODO: import useRef, then: const callbackRef = useRef(onTick);
  // TODO: useEffect(() => { callbackRef.current = onTick; }); // sync after every render

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // TODO: replace with callbackRef.current()
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, onTick]); // TODO: remove onTick once the ref handles staleness
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

  // Without the fix: second is never called (interval still holds ref to first)
  expect(second).toHaveBeenCalledTimes(1);
});
// ---End Tests
