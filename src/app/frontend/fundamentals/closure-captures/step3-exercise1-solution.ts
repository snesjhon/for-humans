/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Backpack goal: the interval keeps one route, while the wall clipboard always
// points at the latest callback note.
function useStableInterval(
  onTick: () => void,
  delay: number,
  onStart: () => void,
) {
  const latestTick = useRef(onTick);
  latestTick.current = onTick;

  useEffect(() => {
    onStart();
    const id = setInterval(() => latestTick.current(), delay);
    return () => clearInterval(id);
  }, [delay, onStart]);
}

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
