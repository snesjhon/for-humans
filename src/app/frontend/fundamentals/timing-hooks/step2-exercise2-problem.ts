/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Debounce, Level 2: keep typing immediate, debounce the query
// Goal: this hook currently debounces the visible input state itself, so typing feels delayed.
// Fix it so inputValue updates immediately on every keystroke, while debouncedQuery only updates
// after delay ms of silence. This is the hook shape for a search box where the UI must stay
// responsive but the fetch query should wait until the user pauses.
function useDebouncedSearchBox(initialValue: string, delay: number) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  useEffect(() => {
    const id = setTimeout(() => {
      // TODO: update the debounced query with the latest inputValue after the quiet period
    }, delay);

    return () => clearTimeout(id);
  }, [inputValue, delay]);

  const onChange = (nextValue: string) => {
    // TODO: update the visible input state immediately instead of waiting for the timeout
    void nextValue;
  };

  return { inputValue, debouncedQuery, onChange };
}

// ---Tests
test('typing updates the visible value immediately but delays the query', () => {
  jest.useFakeTimers();

  const { result } = renderHook(() => useDebouncedSearchBox('', 300));

  act(() => {
    result.current.onChange('r');
  });
  expect(result.current.inputValue).toBe('r');
  expect(result.current.debouncedQuery).toBe('');

  act(() => {
    result.current.onChange('re');
    jest.advanceTimersByTime(100);
  });
  expect(result.current.inputValue).toBe('re');
  expect(result.current.debouncedQuery).toBe('');

  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(result.current.debouncedQuery).toBe('re');

  jest.useRealTimers();
});
// ---End Tests
