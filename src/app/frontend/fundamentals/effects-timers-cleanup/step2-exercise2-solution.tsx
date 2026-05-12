/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useEffect, useRef } from 'react';

interface SearchOptions {
  prefix: string;
  caseSensitive: boolean;
}

function useSearchEffect(query: string, options: SearchOptions) {
  const runCount = useRef(0);

  useEffect(() => {
    runCount.current++;
  }, [query, options.prefix, options.caseSensitive]); // primitives compare by value

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
