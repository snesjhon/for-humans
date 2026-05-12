/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';
import React from 'react';

// Cleanup Contract, Level 1: event listener stacking
// Goal: useResizeCount returns how many times the window has been resized. Predict:
// without removeEventListener in the cleanup, what happens when StrictMode runs
// setup → cleanup(none) → setup? Then return a cleanup function that removes the
// handler so each effect run replaces the listener rather than adding a second one.
function useResizeCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = () => setCount((c) => c + 1);
    window.addEventListener('resize', handler);

    // TODO: return a cleanup function that calls window.removeEventListener('resize', handler)
  }, []);

  return count;
}

// ---Tests
test('one resize event increments the count by exactly 1 under StrictMode', () => {
  const { result } = renderHook(() => useResizeCount(), {
    wrapper: ({ children }) => React.createElement(React.StrictMode, null, children),
  });

  act(() => {
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current).toBe(1);
});
// ---End Tests
