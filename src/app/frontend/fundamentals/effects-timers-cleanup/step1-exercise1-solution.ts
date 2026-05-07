/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Lease Contract, Level 1: unmount cleanup
// Goal: clear the interval when the component unmounts.
function useTicker(delay: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCount((value) => value + 1);
    }, delay);

    return () => window.clearInterval(intervalId);
  }, [delay]);

  return count;
}

test('useTicker clears its interval on unmount', () => {
  jest.useFakeTimers();
  const clearSpy = jest.spyOn(window, 'clearInterval');

  const { result, unmount } = renderHook(() => useTicker(1000));

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(result.current).toBe(2);

  unmount();

  expect(clearSpy).toHaveBeenCalledTimes(1);

  clearSpy.mockRestore();
  jest.useRealTimers();
});
