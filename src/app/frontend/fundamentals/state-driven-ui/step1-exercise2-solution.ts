/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: append each notification against the live array, not the stale snapshot.
function useNotificationQueue() {
  const [messages, setMessages] = useState<string[]>([]);

  function queueSaveAndSync() {
    setMessages((current) => [...current, 'Saved draft']);
    setMessages((current) => [...current, 'Synced profile']);
  }

  return { messages, queueSaveAndSync };
}

// ---Tests
test('both notifications survive in order', () => {
  const { result } = renderHook(() => useNotificationQueue());

  act(() => {
    result.current.queueSaveAndSync();
  });

  expect(result.current.messages).toEqual(['Saved draft', 'Synced profile']);
});
// ---End Tests
