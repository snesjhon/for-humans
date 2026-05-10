/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

function sameIds(left: string[], right: string[]) {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function useStableSelection(initial: string[]) {
  const [selectedIds, setSelectedIds] = useState(initial);
  const [syncRuns, setSyncRuns] = useState(0);

  useEffect(() => {
    setSyncRuns((count) => count + 1);
  }, [selectedIds]);

  function replaceAll(nextIds: string[]) {
    setSelectedIds((current) => (sameIds(current, nextIds) ? current : nextIds));
  }

  return { selectedIds, syncRuns, replaceAll };
}

// ---Tests
test('equal-content replacements should keep the old array reference', () => {
  const { result } = renderHook(() => useStableSelection(['pump-1', 'mixer-2']));

  expect(result.current.syncRuns).toBe(1);

  const firstSelection = result.current.selectedIds;

  act(() => {
    result.current.replaceAll(['pump-1', 'mixer-2']);
  });

  expect(result.current.syncRuns).toBe(1);
  expect(result.current.selectedIds).toBe(firstSelection);

  act(() => {
    result.current.replaceAll(['pump-1', 'fan-3']);
  });

  expect(result.current.syncRuns).toBe(2);
  expect(result.current.selectedIds).toEqual(['pump-1', 'fan-3']);
  expect(result.current.selectedIds).not.toBe(firstSelection);
});
// ---End Tests
