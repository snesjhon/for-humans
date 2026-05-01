/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Goal: only the latest search term should survive the debounce window.
function useDebouncedCommit(term: string, onCommit: (term: string) => void) {
  useEffect(() => {
    const id = setTimeout(() => onCommit(term), 300);
    return () => clearTimeout(id);
  }, []);
}

// ---Tests
test('debounce commits only the latest term', () => {
  jest.useFakeTimers();
  const onCommit = jest.fn();

  const { rerender } = renderHook(
    ({ term }) => useDebouncedCommit(term, onCommit),
    { initialProps: { term: 're' } },
  );

  rerender({ term: 'react' });

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(onCommit).toHaveBeenCalledTimes(1);
  expect(onCommit).toHaveBeenCalledWith('react');
});
// ---End Tests
