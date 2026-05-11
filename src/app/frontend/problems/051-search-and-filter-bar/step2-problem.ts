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

// Goal: keep the active category in state and derive the visible items from both controls together.
export function useSearchAndFilter(items: CatalogItem[]): SearchAndFilterView {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = items.filter((item) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery);

    // TODO: Add a category-matching check that skips narrowing when selectedCategory is 'all'
    // TODO: Keep only items that satisfy both the search and category checks
    return matchesQuery;
  });

  return {
    query,
    selectedCategory,
    visibleItems,
    setQuery,
    setSelectedCategory,
  };
}

// ---Tests
test('category filter narrows the list when the query is empty', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setSelectedCategory('tools');
  });

  expect(result.current.selectedCategory).toBe('tools');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Hammer',
    'Screwdriver',
  ]);
});

test('search and category filter combine to produce the visible list', () => {
  const { result } = renderHook(() => useSearchAndFilter(SAMPLE_ITEMS));

  act(() => {
    result.current.setQuery('tea');
    result.current.setSelectedCategory('snacks');
  });

  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Tea Biscuits',
  ]);
});

test('returning to all preserves the search query while widening the category match', () => {
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
