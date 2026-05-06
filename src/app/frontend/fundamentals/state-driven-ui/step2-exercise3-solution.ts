/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: compute the next count once, then let every dependent state lane use it.
function useCountAndDouble() {
  const [count, setCount] = useState(0);
  const [doubled, setDoubled] = useState(0);

  function increment() {
    const nextCount = count + 1;
    setCount(nextCount);
    setDoubled(nextCount * 2);
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
