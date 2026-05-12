/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';

function useFilteredItems(items: string[], query: string) {
  const renderCount = useRef(0);
  renderCount.current++;

  const filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return { filtered, renderCount };
}

// ---Tests
test('returns items matching the query', async () => {
  const items = ['apple', 'apricot', 'banana', 'blueberry'];
  const { result } = renderHook(
    ({ query }: { query: string }) => useFilteredItems(items, query),
    { initialProps: { query: 'ap' } }
  );

  await act(async () => { await Promise.resolve(); });

  expect(result.current.filtered).toEqual(['apple', 'apricot']);
});

test('updates on query change without a second render from the effect', async () => {
  const items = ['apple', 'apricot', 'banana'];
  const { result, rerender } = renderHook(
    ({ query }: { query: string }) => useFilteredItems(items, query),
    { initialProps: { query: '' } }
  );

  await act(async () => { await Promise.resolve(); });

  const beforeCount = result.current.renderCount.current;

  await act(async () => {
    rerender({ query: 'ba' });
    await Promise.resolve();
  });

  // No effect: only one render per query change
  expect(result.current.renderCount.current).toBe(beforeCount + 1);
  expect(result.current.filtered).toEqual(['banana']);
});
// ---End Tests
