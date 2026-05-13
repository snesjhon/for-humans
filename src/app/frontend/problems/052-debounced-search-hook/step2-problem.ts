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

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const SAMPLE_ITEMS: CatalogItem[] = [
  { id: 'item-1', name: 'Green Tea', category: 'beverages' },
  { id: 'item-2', name: 'Trail Mix', category: 'snacks' },
  { id: 'item-3', name: 'Hammer', category: 'tools' },
  { id: 'item-4', name: 'Tea Biscuits', category: 'snacks' },
  { id: 'item-5', name: 'Screwdriver', category: 'tools' },
];

// Goal: manage the live query in state, pass it through useDebounce, and derive
// the visible list from the settled query instead of the live one.
export function useDebouncedSearch(
  items: CatalogItem[],
  delay: number,
): DebouncedSearchView {
  // TODO: Keep the live query in state
  // TODO: Produce a debounced copy of the query using useDebounce
  // TODO: Normalize the debounced query and derive visibleItems from it
  return {
    query: '',
    debouncedQuery: '',
    visibleItems: items,
    setQuery: () => {},
  };
}

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
