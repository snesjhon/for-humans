/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Backpack goal: keep one polling route open, but let each poll read the
// freshest query note.
function useStablePolling(
  query: string,
  fetcher: (query: string) => void,
  onStart: () => void,
) {
  useEffect(() => {
    onStart();
    const id = setInterval(() => fetcher(query), 1000);
    return () => clearInterval(id);
  }, [onStart, fetcher]);
}

test('polling keeps one setup and reads the latest query', () => {
  jest.useFakeTimers();
  const fetcher = jest.fn();
  const onStart = jest.fn();

  const { rerender } = renderHook(
    ({ query }) => useStablePolling(query, fetcher, onStart),
    { initialProps: { query: 'draft' } },
  );

  rerender({ query: 'react' });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(onStart).toHaveBeenCalledTimes(1);
  expect(fetcher).toHaveBeenCalledWith('react');
});
