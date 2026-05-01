/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: each new name is appended onto the live roster when the packed instruction arrives.
function useQueuedRoster() {
  const [names, setNames] = useState<string[]>([]);

  function queueTwoNames() {
    setTimeout(() => setNames((current) => [...current, 'Ada']), 10);
    setTimeout(() => setNames((current) => [...current, 'Grace']), 20);
  }

  return { names, queueTwoNames };
}

// ---Tests
test('queued appends preserve both names in order', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useQueuedRoster());

  act(() => {
    result.current.queueTwoNames();
    jest.advanceTimersByTime(20);
  });

  expect(result.current.names).toEqual(['Ada', 'Grace']);
});
// ---End Tests
