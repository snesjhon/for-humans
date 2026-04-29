/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Backpack goal: pack a fresh label whenever the listener's read value
// changes.
function useTaggedKeyLogger(label: string, log: (entry: string) => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      log(`${label}:${event.key}`);
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [label, log]);
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
