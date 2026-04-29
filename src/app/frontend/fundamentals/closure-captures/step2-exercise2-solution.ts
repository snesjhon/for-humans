/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Backpack goal: restart the heartbeat when its spoken status changes, so the
// next tick carries a fresh pack.
function useHeartbeat(status: string, onTick: (status: string) => void) {
  useEffect(() => {
    const id = setInterval(() => onTick(status), 1000);
    return () => clearInterval(id);
  }, [status, onTick]);
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
