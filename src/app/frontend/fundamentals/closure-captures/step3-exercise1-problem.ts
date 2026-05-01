/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Goal: keep one interval running, but let each tick read the latest callback.
function useStableInterval(
  onTick: () => void,
  delay: number,
  onStart: () => void,
) {
  useEffect(() => {
    onStart();
    const id = setInterval(() => onTick(), delay);
    return () => clearInterval(id);
  }, [delay, onStart]);
}

// ---Tests
test('stable interval starts once and calls the latest callback', () => {
  jest.useFakeTimers();
  const starts = jest.fn();
  const oldTick = jest.fn();
  const newTick = jest.fn();

  const { rerender } = renderHook(
    ({ onTick }) => useStableInterval(onTick, 1000, starts),
    { initialProps: { onTick: oldTick } },
  );

  rerender({ onTick: newTick });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(starts).toHaveBeenCalledTimes(1);
  expect(oldTick).not.toHaveBeenCalled();
  expect(newTick).toHaveBeenCalledTimes(1);
});
// ---End Tests
