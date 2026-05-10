/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Goal: writing the same count again should keep the old Map reference so downstream React work does not rerun.
function useTagCounts(initial: Array<[string, number]>) {
  const [counts, setCounts] = useState(() => new Map(initial));
  const [syncRuns, setSyncRuns] = useState(0);

  useEffect(() => {
    setSyncRuns((count) => count + 1);
  }, [counts]);

  function upsertTagCount(tag: string, nextCount: number) {
    setCounts((current) => {
      const next = new Map(current);
      next.set(tag, nextCount);
      return next;
    });
  }

  return { counts, syncRuns, upsertTagCount };
}

// ---Tests
test('equal map writes should keep the old reference and avoid extra sync work', () => {
  const { result } = renderHook(() =>
    useTagCounts([
      ['critical', 2],
      ['warning', 1],
    ]),
  );

  expect(result.current.syncRuns).toBe(1);

  const firstMap = result.current.counts;

  act(() => {
    result.current.upsertTagCount('critical', 2);
  });

  expect(result.current.counts).toBe(firstMap);
  expect(result.current.syncRuns).toBe(1);

  act(() => {
    result.current.upsertTagCount('critical', 3);
  });

  expect(result.current.counts.get('critical')).toBe(3);
  expect(result.current.counts).not.toBe(firstMap);
  expect(result.current.syncRuns).toBe(2);
});
// ---End Tests
