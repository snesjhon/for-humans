/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Backpack goal: each delayed append should add to the live passenger list,
// not to the packed list from takeoff.
function useQueuedRoster() {
  const [names, setNames] = useState<string[]>([]);

  function queueTwoNames() {
    setTimeout(() => setNames([...names, 'Ada']), 10);
    setTimeout(() => setNames([...names, 'Grace']), 20);
  }

  return { names, queueTwoNames };
}

test('queued appends preserve both names in order', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useQueuedRoster());

  act(() => {
    result.current.queueTwoNames();
    jest.advanceTimersByTime(20);
  });

  expect(result.current.names).toEqual(['Ada', 'Grace']);
});
