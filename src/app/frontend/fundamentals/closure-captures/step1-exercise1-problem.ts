/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Backpack goal: two delayed notes should land as two increments, not one
// stale note read twice.
function useQueuedCounter() {
  const [count, setCount] = useState(0);

  function queuePair() {
    setTimeout(() => setCount(count + 1), 10);
    setTimeout(() => setCount(count + 1), 20);
  }

  return { count, queuePair };
}

test('queued increments stack to 2', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useQueuedCounter());

  act(() => {
    result.current.queuePair();
    jest.advanceTimersByTime(20);
  });

  expect(result.current.count).toBe(2);
});
