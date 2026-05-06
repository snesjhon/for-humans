/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: count and doubled should move together after one increment.
function useCountAndDouble() {
  const [count, setCount] = useState(0);
  const [doubled, setDoubled] = useState(0);

  function increment() {
    setCount(count + 1);
    setDoubled(count * 2);
  }

  return { count, doubled, increment };
}

// ---Tests
test('doubled tracks the newly incremented count', () => {
  const { result } = renderHook(() => useCountAndDouble());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
  expect(result.current.doubled).toBe(2);
});
// ---End Tests
