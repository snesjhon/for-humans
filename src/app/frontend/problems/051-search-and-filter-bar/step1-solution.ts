/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';

type CatalogCategory = 'beverages' | 'snacks' | 'tools';

interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
}

export type SearchableListView = {
  query: string;
  visibleItems: CatalogItem[];
  setQuery: (nextQuery: string) => void;
};

const SAMPLE_ITEMS: CatalogItem[] = [
  { id: 'item-1', name: 'Green Tea', category: 'beverages' },
  { id: 'item-2', name: 'Trail Mix', category: 'snacks' },
  { id: 'item-3', name: 'Hammer', category: 'tools' },
  { id: 'item-4', name: 'Tea Biscuits', category: 'snacks' },
  { id: 'item-5', name: 'Screwdriver', category: 'tools' },
];

// Goal: store the search query once, then derive the visible items from it.
export function useSearchableList(items: CatalogItem[]): SearchableListView {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems =
    normalizedQuery.length === 0
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().includes(normalizedQuery),
        );

  return {
    query,
    visibleItems,
    setQuery,
  };
}

// ---Tests
test('empty query keeps the full list visible', () => {
  const { result } = renderHook(() => useSearchableList(SAMPLE_ITEMS));

  expect(result.current.query).toBe('');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Trail Mix',
    'Hammer',
    'Tea Biscuits',
    'Screwdriver',
  ]);
});

test('search narrows the list in real time using a normalized query', () => {
  const { result } = renderHook(() => useSearchableList(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('  TEA ');
  });

  expect(result.current.query).toBe('  TEA ');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Tea Biscuits',
  ]);
});

test('search can produce an empty visible list when nothing matches', () => {
  const { result } = renderHook(() => useSearchableList(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('wrench');
  });

  expect(result.current.visibleItems).toEqual([]);
});
// ---End Tests
