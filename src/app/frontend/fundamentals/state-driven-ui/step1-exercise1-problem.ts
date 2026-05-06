/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: one click should add 3, not repeat the same stale request three times.
function useMultiIncrementCounter() {
  const [count, setCount] = useState(0);

  function bumpThreeTimes() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return { count, bumpThreeTimes };
}

// ---Tests
test('one click lands as three increments', () => {
  const { result } = renderHook(() => useMultiIncrementCounter());

  act(() => {
    result.current.bumpThreeTimes();
  });

  expect(result.current.count).toBe(3);
});
// ---End Tests
