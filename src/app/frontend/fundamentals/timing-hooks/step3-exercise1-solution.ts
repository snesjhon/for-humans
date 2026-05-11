/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useMemo, useRef } from 'react';

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCalled = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCalled < limit) return;
    lastCalled = now;
    fn(...args);
  };
}

// Interview-style mistake, Level 3: wrong rate limiter for continuous feedback
// Goal: this hook reports scroll progress during movement, so the first event should fire
// immediately and later events should be capped by limit ms. That is a throttle requirement, not a
// debounce requirement. Switch the hook to use the correct utility while keeping the wrapper stable
// and reading the latest report callback through the ref.
function useRateLimitedScrollReport(
  report: (position: number) => void,
  limit: number,
): (position: number) => void {
  const reportRef = useRef(report);
  reportRef.current = report;

  return useMemo(
    () => throttle((position: number) => reportRef.current(position), limit),
    [limit],
  );
}

// ---Tests
test('scroll reporting fires immediately, then enforces a cooldown', () => {
  jest.useFakeTimers();

  const report = jest.fn();
  const { result } = renderHook(() => useRateLimitedScrollReport(report, 300));

  const rateLimited = result.current;

  act(() => {
    rateLimited(10);
  });
  expect(report).toHaveBeenCalledTimes(1);
  expect(report).toHaveBeenCalledWith(10);

  act(() => {
    rateLimited(20);
    rateLimited(30);
  });
  expect(report).toHaveBeenCalledTimes(1);

  act(() => {
    jest.advanceTimersByTime(300);
    rateLimited(40);
  });
  expect(report).toHaveBeenCalledTimes(2);
  expect(report).toHaveBeenLastCalledWith(40);

  jest.useRealTimers();
});
// ---End Tests
