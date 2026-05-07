/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Lease Contract, Level 1: cleanup before the next setup
// Goal: when label or delay changes, stop the old interval before starting the new one.
function usePollingLabel(label: string, delay: number, emit: (value: string) => void) {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      emit(label);
    }, delay);

    // TODO: return cleanup so the previous interval does not survive a rerender.
  }, [label, delay, emit]);
}

test.skip('rerender replaces the old interval instead of duplicating it', () => {
  jest.useFakeTimers();
  const emit = jest.fn();

  const { rerender } = renderHook(
    ({ label, delay }) => usePollingLabel(label, delay, emit),
    { initialProps: { label: 'draft', delay: 1000 } },
  );

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(emit.mock.calls).toEqual([['draft']]);

  rerender({ label: 'live', delay: 500 });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(emit.mock.calls).toEqual([
    ['draft'],
    ['live'],
    ['live'],
  ]);

  jest.useRealTimers();
});
