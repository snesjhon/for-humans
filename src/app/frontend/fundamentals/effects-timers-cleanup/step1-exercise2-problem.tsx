/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

// Goal: Remove the useEffect and useState, and compute filteredItems directly
// during render instead.
// Storing derived state in an effect causes two renders per input change:
// one when the prop updates, one when the effect calls setFiltered.
// Derived values from props or state belong in the render body, not in an effect.

function useFilteredItems(items: string[], query: string) {
  const [filtered, setFiltered] = useState<string[]>(items);
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    setFiltered(items.filter(item => item.toLowerCase().includes(query.toLowerCase())));
  }, [items, query]);

  // TODO: remove useState and useEffect above
  // TODO: compute filtered inline: items.filter(item => item.toLowerCase().includes(query.toLowerCase()))

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

  await act(async () => { await Promise.resolve(); }); // flush initial effect

  const beforeCount = result.current.renderCount.current;

  await act(async () => {
    rerender({ query: 'ba' });
    await Promise.resolve(); // flush effect triggered by rerender
  });

  // With the effect: renderCount increases by 2 (render + effect setState)
  // With inline computation: renderCount increases by exactly 1
  expect(result.current.renderCount.current).toBe(beforeCount + 1);
  expect(result.current.filtered).toEqual(['banana']);
});
// ---End Tests
