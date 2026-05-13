/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';

type CatalogCategory = 'beverages' | 'snacks' | 'tools';

interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
}

export type DebouncedSearchView = {
  query: string;
  debouncedQuery: string;
  visibleItems: CatalogItem[];
  setQuery: (nextQuery: string) => void;
};

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Goal: store only the live query, debounce it, and derive the visible list from the settled result.
export function useDebouncedSearch(
  items: CatalogItem[],
  delay: number,
): DebouncedSearchView {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const visibleItems = items.filter(
    (item) =>
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery),
  );

  return {
    query,
    debouncedQuery,
    visibleItems,
    setQuery,
  };
}

const SAMPLE_ITEMS: CatalogItem[] = [
  { id: 'item-1', name: 'Green Tea', category: 'beverages' },
  { id: 'item-2', name: 'Trail Mix', category: 'snacks' },
  { id: 'item-3', name: 'Hammer', category: 'tools' },
  { id: 'item-4', name: 'Tea Biscuits', category: 'snacks' },
  { id: 'item-5', name: 'Screwdriver', category: 'tools' },
];

// ---Tests
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('initial state shows every item with an empty query', () => {
  const { result } = renderHook(() => useDebouncedSearch(SAMPLE_ITEMS, 300));

  expect(result.current.query).toBe('');
  expect(result.current.debouncedQuery).toBe('');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Trail Mix',
    'Hammer',
    'Tea Biscuits',
    'Screwdriver',
  ]);
});

test('live query updates immediately while the visible list stays unchanged', () => {
  const { result } = renderHook(() => useDebouncedSearch(SAMPLE_ITEMS, 300));

  act(() => {
    result.current.setQuery('tea');
  });

  expect(result.current.query).toBe('tea');
  expect(result.current.debouncedQuery).toBe('');
  expect(result.current.visibleItems).toHaveLength(5);
});

test('visible list narrows only after the full delay has passed', () => {
  const { result } = renderHook(() => useDebouncedSearch(SAMPLE_ITEMS, 300));

  act(() => {
    result.current.setQuery('tea');
  });

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(result.current.debouncedQuery).toBe('tea');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Tea Biscuits',
  ]);
});

test('rapid typing does not expose intermediate visible list states', () => {
  const { result } = renderHook(() => useDebouncedSearch(SAMPLE_ITEMS, 300));

  act(() => { result.current.setQuery('t'); });
  act(() => { jest.advanceTimersByTime(100); });
  act(() => { result.current.setQuery('te'); });
  act(() => { jest.advanceTimersByTime(100); });
  act(() => { result.current.setQuery('tea'); });
  act(() => { jest.advanceTimersByTime(100); });

  expect(result.current.debouncedQuery).toBe('');
  expect(result.current.visibleItems).toHaveLength(5);

  act(() => { jest.advanceTimersByTime(200); });

  expect(result.current.debouncedQuery).toBe('tea');
  expect(result.current.visibleItems.map((item) => item.name)).toEqual([
    'Green Tea',
    'Tea Biscuits',
  ]);
});

test('empty debounced query restores the full list after the delay', () => {
  const { result } = renderHook(() => useDebouncedSearch(SAMPLE_ITEMS, 300));

  act(() => { result.current.setQuery('tea'); });
  act(() => { jest.advanceTimersByTime(300); });
  act(() => { result.current.setQuery(''); });
  act(() => { jest.advanceTimersByTime(300); });

  expect(result.current.debouncedQuery).toBe('');
  expect(result.current.visibleItems).toHaveLength(5);
});
// ---End Tests
