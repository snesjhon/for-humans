/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

// Goal: Choose the dep array that makes the effect run exactly once after mount,
// not on every render. The hook tracks how many times the effect has fired using
// a ref, and returns that count alongside some unrelated state.

function useEffectRunCount() {
  const runCount = useRef(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    runCount.current++;
    // TODO: add the correct dep array so this effect runs only once
    // Choose from: no array (runs every render), [] (runs once), or [tick] (runs when tick changes)
  });

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

  // Without the fix: runCount is 2 (effect re-ran because no dep array)
  expect(result.current.runCount.current).toBe(1);
});
// ---End Tests
