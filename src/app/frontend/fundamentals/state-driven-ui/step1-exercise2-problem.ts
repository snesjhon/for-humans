/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: queueing two notifications in one event should keep both messages.
function useNotificationQueue() {
  const [messages, setMessages] = useState<string[]>([]);

  function queueSaveAndSync() {
    setMessages([...messages, 'Saved draft']);
    setMessages([...messages, 'Synced profile']);
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
