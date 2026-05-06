/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface NameDraft {
  firstName: string;
  lastName: string;
}

// Goal: merge each field against the live draft so both updates survive the batch.
function useNameDraft() {
  const [draft, setDraft] = useState<NameDraft>({ firstName: '', lastName: '' });

  function loadAdaLovelace() {
    setDraft((current) => ({ ...current, firstName: 'Ada' }));
    setDraft((current) => ({ ...current, lastName: 'Lovelace' }));
  }

  return { draft, loadAdaLovelace };
}

// ---Tests
test('the draft keeps both fields from the preset', () => {
  const { result } = renderHook(() => useNameDraft());

  act(() => {
    result.current.loadAdaLovelace();
  });

  expect(result.current.draft).toEqual({
    firstName: 'Ada',
    lastName: 'Lovelace',
  });
});
// ---End Tests
