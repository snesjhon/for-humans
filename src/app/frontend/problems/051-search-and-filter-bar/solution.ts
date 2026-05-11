/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';

type CatalogCategory = 'beverages' | 'snacks' | 'tools';
type CategoryFilter = 'all' | CatalogCategory;

interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
}

export type SearchAndFilterView = {
  query: string;
  selectedCategory: CategoryFilter;
  visibleItems: CatalogItem[];
  setQuery: (nextQuery: string) => void;
  setSelectedCategory: (nextCategory: CategoryFilter) => void;
};

const SAMPLE_ITEMS: CatalogItem[] = [
  { id: 'item-1', name: 'Green Tea', category: 'beverages' },
  { id: 'item-2', name: 'Trail Mix', category: 'snacks' },
  { id: 'item-3', name: 'Hammer', category: 'tools' },
  { id: 'item-4', name: 'Tea Biscuits', category: 'snacks' },
  { id: 'item-5', name: 'Screwdriver', category: 'tools' },
];

function matchesQuery(item: CatalogItem, normalizedQuery: string): boolean {
  if (normalizedQuery.length === 0) return true;
  return item.name.toLowerCase().includes(normalizedQuery);
}

function matchesCategory(
  item: CatalogItem,
  selectedCategory: CategoryFilter,
): boolean {
  return selectedCategory === 'all' || item.category === selectedCategory;
}

// Goal: store only the control state, then derive the visible list from the current snapshot.
export function useSearchAndFilter(items: CatalogItem[]): SearchAndFilterView {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = items.filter(
    (item) =>
      matchesQuery(item, normalizedQuery) &&
      matchesCategory(item, selectedCategory),
  );

  return {
    query,
    selectedCategory,
    visibleItems,
    setQuery,
    setSelectedCategory,
  };
}

// ---Tests
test('initial snapshot shows every item with an empty query and all categories', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  expect(result.current.query).toBe('');
  expect(result.current.selectedCategory).toBe('all');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Trail Mix',
    'Hammer',
    'Tea Biscuits',
    'Screwdriver',
  ]);
});

test('search narrows the visible list in real time', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('  tea ');
  });

  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Tea Biscuits',
  ]);
});

test('category filter narrows the visible list when the query is empty', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setSelectedCategory('tools');
  });

  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Hammer',
    'Screwdriver',
  ]);
});

test('search and category filter combine as two independent predicates', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('tea');
    result.current.setSelectedCategory('snacks');
  });

  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Tea Biscuits',
  ]);
});

test('switching the category back to all keeps the search query active', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('tea');
    result.current.setSelectedCategory('snacks');
    result.current.setSelectedCategory('all');
  });

  expect(result.current.query).toBe('tea');
  expect(result.current.selectedCategory).toBe('all');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Tea Biscuits',
  ]);
});

test('combined controls can produce an empty visible list', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('tea');
    result.current.setSelectedCategory('tools');
  });

  expect(result.current.visibleItems).toEqual([]);
});
// ---End Tests
