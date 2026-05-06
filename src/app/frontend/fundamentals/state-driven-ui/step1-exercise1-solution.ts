/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: one click should add 3 by handing React three update instructions.
function useMultiIncrementCounter() {
  const [count, setCount] = useState(0);

  function bumpThreeTimes() {
    setCount((current) => current + 1);
    setCount((current) => current + 1);
    setCount((current) => current + 1);
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
