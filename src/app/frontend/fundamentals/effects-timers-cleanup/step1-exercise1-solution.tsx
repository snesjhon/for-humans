/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

function useEffectRunCount() {
  const runCount = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    runCount.current++;
  }, []); // empty array: runs once after mount, skipped on every re-render

  return { runCount, tick, setTick };
}

// ---Tests
test('effect runs exactly once after mount', () => {
  const { result } = renderHook(() => useEffectRunCount());
  expect(result.current.runCount.current).toBe(1);
});

test('effect does not re-run when unrelated state changes', () => {
  const { result } = renderHook(() => useEffectRunCount());

  act(() => {
    result.current.setTick(1);
  });

  expect(result.current.runCount.current).toBe(1);
});
// ---End Tests
