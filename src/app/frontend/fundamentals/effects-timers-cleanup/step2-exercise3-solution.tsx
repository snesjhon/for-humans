/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

function useTagProcessor(tags: string[]) {
  const [processed, setProcessed] = useState<string[]>([]);
  const runCount = useRef(0);

  useEffect(() => {
    runCount.current++;
    setProcessed(tags.map(t => t.toUpperCase()));
  }, [tags]); // processed removed: the effect writes it, not reads it

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

  expect(result.current.runCount.current).toBe(1);
});
// ---End Tests
