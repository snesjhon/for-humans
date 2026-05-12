/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

// Goal: Remove processed from the dep array. The effect writes to processed but
// never reads it — writing to a value is not a dependency on it.
// With processed in the dep array: effect runs, setProcessed triggers a re-render,
// processed changes, effect runs again. The cycle repeats until React bails out.

function useTagProcessor(tags: string[]) {
  const [processed, setProcessed] = useState<string[]>([]);
  const runCount = useRef(0);

  useEffect(() => {
    runCount.current++;
    setProcessed(tags.map(t => t.toUpperCase()));
  }, [tags, processed]); // TODO: remove processed — the effect writes it, never reads it

  return { processed, runCount };
}

// ---Tests
test('processes tags into uppercase', () => {
  const { result } = renderHook(() =>
    useTagProcessor(['react', 'typescript'])
  );

  act(() => {});

  expect(result.current.processed).toEqual(['REACT', 'TYPESCRIPT']);
});

test('effect runs exactly once per tags change, not in a loop', () => {
  const tags = ['react', 'typescript'];
  const { result } = renderHook(
    ({ tags }: { tags: string[] }) => useTagProcessor(tags),
    { initialProps: { tags } }
  );

  act(() => {});

  // Without the fix: processed is in deps, setProcessed triggers re-run,
  // runCount climbs before React detects the loop and bails out.
  // With the fix: effect runs exactly once for this tags reference.
  expect(result.current.runCount.current).toBe(1);
});
// ---End Tests
