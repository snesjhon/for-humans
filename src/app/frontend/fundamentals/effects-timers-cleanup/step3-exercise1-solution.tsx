/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

function useStaleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // React provides the current value — no closure over count
    }, 100);
    return () => clearInterval(id);
  }, []);

  return count;
}

// ---Tests
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('count reaches 3 after three interval ticks', () => {
  const { result } = renderHook(() => useStaleCounter());

  act(() => { jest.advanceTimersByTime(300); });

  expect(result.current).toBe(3);
});

test('count reaches 10 after ten interval ticks', () => {
  const { result } = renderHook(() => useStaleCounter());

  act(() => { jest.advanceTimersByTime(1000); });

  expect(result.current).toBe(10);
});
// ---End Tests
