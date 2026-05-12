/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';

interface FormData {
  name: string;
  email: string;
}

function useFormSubmit(onSave: (data: FormData) => void) {
  function handleSave(data: FormData) {
    onSave(data);
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

  expect(onSave).toHaveBeenCalledTimes(1);
});
// ---End Tests
