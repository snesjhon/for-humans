/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: let React read the live counter when each packed instruction lands.
function useQueuedCounter() {
  const [count, setCount] = useState(0);

  function queuePair() {
    setTimeout(() => setCount((current) => current + 1), 10);
    setTimeout(() => setCount((current) => current + 1), 20);
  }

  return { count, queuePair };
}

// ---Tests
test('queued increments stack to 2', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useQueuedCounter());

  act(() => {
    result.current.queuePair();
    jest.advanceTimersByTime(20);
  });

  expect(result.current.count).toBe(2);
});
// ---End Tests
