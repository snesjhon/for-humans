/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import React from 'react';

// Cleanup Contract, Level 1: observe and fix
// Goal: return a cleanup function that calls clearInterval so StrictMode's second setup
// replaces the first interval rather than running both simultaneously.
function useCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(id);
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
