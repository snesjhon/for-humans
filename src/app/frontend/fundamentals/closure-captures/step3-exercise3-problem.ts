/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Goal: keep one polling interval running, but let each tick read the latest query and fetcher.
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

// ---Tests
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
// ---End Tests
