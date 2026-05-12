/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Cleanup Contract, Level 1: cleanup fires before the next effect
// Goal: return a cleanup function so the dep change shuts down the old interval
// before the new one starts. Two interval runs must never coexist.
function usePoller(key: string) {
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPollCount((c) => c + 1);
    }, 500);

    return () => clearInterval(id);
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

  rerender({ key: 'device-2' }); // stops device-1 interval, starts device-2 interval

  act(() => {
    jest.advanceTimersByTime(1000); // 2 polls from device-2 interval only
  });

  expect(result.current).toBe(4);

  jest.useRealTimers();
});
// ---End Tests
