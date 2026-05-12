/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Goal: Replace the options object in the dep array with its two primitive fields
// so the effect only re-runs when the values actually change.
// Object.is({ prefix: 'a' }, { prefix: 'a' }) is false — two object literals
// are never the same reference even when their contents are identical.

interface SearchOptions {
  prefix: string;
  caseSensitive: boolean;
}

function useSearchEffect(query: string, options: SearchOptions) {
  const runCount = useRef(0);

  useEffect(() => {
    runCount.current++;
    // side effect: performs a search using query and options
  }, [query, options]); // TODO: replace options with options.prefix, options.caseSensitive

  return runCount;
}

// ---Tests
test('effect runs once on initial mount', () => {
  const { result } = renderHook(() =>
    useSearchEffect('hello', { prefix: 'he', caseSensitive: false })
  );

  expect(result.current.current).toBe(1);
});

test('effect does not re-run when re-rendered with the same option values', () => {
  const { result, rerender } = renderHook(
    ({ options }: { options: SearchOptions }) =>
      useSearchEffect('hello', options),
    { initialProps: { options: { prefix: 'he', caseSensitive: false } } }
  );

  rerender({ options: { prefix: 'he', caseSensitive: false } });

  // Without the fix: runCount is 2 (new object reference on every render)
  expect(result.current.current).toBe(1);
});

test('effect re-runs when a primitive value actually changes', () => {
  const { result, rerender } = renderHook(
    ({ options }: { options: SearchOptions }) =>
      useSearchEffect('hello', options),
    { initialProps: { options: { prefix: 'he', caseSensitive: false } } }
  );

  rerender({ options: { prefix: 'wo', caseSensitive: false } });

  expect(result.current.current).toBe(2);
});
// ---End Tests
