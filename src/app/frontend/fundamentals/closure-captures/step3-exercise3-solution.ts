/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Backpack goal: the polling loop stays on one route, while the wall
// clipboards keep the latest query and fetcher ready for each tick.
function useStablePolling(
  query: string,
  fetcher: (query: string) => void,
  onStart: () => void,
) {
  const latestQuery = useRef(query);
  const latestFetcher = useRef(fetcher);

  latestQuery.current = query;
  latestFetcher.current = fetcher;

  useEffect(() => {
    onStart();
    const id = setInterval(
      () => latestFetcher.current(latestQuery.current),
      1000,
    );
    return () => clearInterval(id);
  }, [onStart]);
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
