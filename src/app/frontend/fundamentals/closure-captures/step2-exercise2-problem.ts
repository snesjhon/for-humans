/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Backpack goal: the heartbeat should speak with the latest status card, not
// the one packed on mount.
function useHeartbeat(status: string, onTick: (status: string) => void) {
  useEffect(() => {
    const id = setInterval(() => onTick(status), 1000);
    return () => clearInterval(id);
  }, []);
}

test('interval announces the latest status after rerender', () => {
  jest.useFakeTimers();
  const onTick = jest.fn();

  const { rerender } = renderHook(
    ({ status }) => useHeartbeat(status, onTick),
    { initialProps: { status: 'idle' } },
  );

  rerender({ status: 'live' });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(onTick).toHaveBeenCalledWith('live');
});
