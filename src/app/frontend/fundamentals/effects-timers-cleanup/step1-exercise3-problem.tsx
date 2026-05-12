/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useState } from 'react';

// Goal: Move the onSave call out of the effect and into handleSave directly.
// Remove the submitted state flag and the effect entirely.
// An effect that fires only because a user action set a state flag is always
// replaceable with an event handler.

interface FormData {
  name: string;
  email: string;
}

function useFormSubmit(onSave: (data: FormData) => void) {
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  useEffect(() => {
    if (submitted !== null) {
      onSave(submitted);
    }
  }, [submitted, onSave]);

  function handleSave(data: FormData) {
    setSubmitted(data);
    // TODO: call onSave(data) here directly
    // TODO: remove the submitted state and the effect above
  }

  return { handleSave };
}

// ---Tests
test('calls onSave with the correct data when handleSave is called', () => {
  const onSave = jest.fn();
  const { result } = renderHook(() => useFormSubmit(onSave));
  const data: FormData = { name: 'Alice', email: 'alice@example.com' };

  act(() => {
    result.current.handleSave(data);
  });

  expect(onSave).toHaveBeenCalledWith(data);
});

test('calls onSave exactly once per handleSave call', () => {
  const onSave = jest.fn();
  const { result } = renderHook(() => useFormSubmit(onSave));

  act(() => {
    result.current.handleSave({ name: 'Bob', email: 'bob@example.com' });
  });

  // With the effect: onSave may fire from the effect flush after state update
  // With the event handler pattern: onSave fires exactly once, synchronously
  expect(onSave).toHaveBeenCalledTimes(1);
});
// ---End Tests
