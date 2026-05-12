/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import React from 'react';

// Cleanup Contract, Level 1: observe and fix
// Goal: useCounter increments every second. Under React StrictMode, every effect runs
// setup → cleanup → setup on mount to verify the pair is correct. Predict: without a
// cleanup function, how many intervals are running after the StrictMode double-mount?
// Then return a cleanup function that calls clearInterval so the second setup replaces
// the first rather than stacking on top of it.
function useCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    // TODO: return a cleanup function that calls clearInterval(id)
  }, []);

  return count;
}

// ---Tests
test('increments by exactly 1 per second under StrictMode', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useCounter(), {
    wrapper: ({ children }) => React.createElement(React.StrictMode, null, children),
  });

  act(() => {
    jest.advanceTimersByTime(3000);
  });

  expect(result.current).toBe(3);

  jest.useRealTimers();
});
// ---End Tests
