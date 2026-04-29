/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Backpack goal: the listener should unpack the latest label, not the label
// from the first trip.
function useTaggedKeyLogger(label: string, log: (entry: string) => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      log(`${label}:${event.key}`);
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);
}

test('listener uses the latest label after rerender', () => {
  const log = jest.fn();

  const { rerender } = renderHook(
    ({ label }) => useTaggedKeyLogger(label, log),
    { initialProps: { label: 'draft' } },
  );

  rerender({ label: 'live' });

  act(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', bubbles: true }),
    );
  });

  expect(log).toHaveBeenCalledWith('live:k');
});
