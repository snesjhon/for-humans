/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Cleanup Contract, Level 1: cleanup fires before the next effect
// Goal: usePoller counts how many times the interval fires for a given key. When key
// changes, the old interval must stop before the new one starts — otherwise both run
// simultaneously and the count doubles. Predict: without cleanup, how many times does
// the counter increment in 1000ms after a key change? Then return a cleanup function
// so the dep change shuts down the old interval before the new one takes over.
function usePoller(key: string) {
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPollCount((c) => c + 1);
    }, 500);

    // TODO: return a cleanup function that calls clearInterval(id)
  }, [key]);

  return pollCount;
}

// ---Tests
test('changing the key stops the old interval before starting the new one', () => {
  jest.useFakeTimers();

  const { result, rerender } = renderHook(({ key }) => usePoller(key), {
    initialProps: { key: 'device-1' },
  });

  act(() => {
    jest.advanceTimersByTime(1000); // 2 polls from device-1 interval
  });

  expect(result.current).toBe(2);

  rerender({ key: 'device-2' }); // should stop device-1 interval, start device-2 interval

  act(() => {
    jest.advanceTimersByTime(1000); // should be 2 more polls from device-2 interval only
  });

  expect(result.current).toBe(4); // 2 + 2, not 2 + 4 (double interval)

  jest.useRealTimers();
});
// ---End Tests
