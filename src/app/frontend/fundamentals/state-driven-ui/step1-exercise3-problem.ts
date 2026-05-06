/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface NameDraft {
  firstName: string;
  lastName: string;
}

// Goal: one preset click should produce a complete draft with both names filled in.
function useNameDraft() {
  const [draft, setDraft] = useState<NameDraft>({ firstName: '', lastName: '' });

  function loadAdaLovelace() {
    setDraft({ ...draft, firstName: 'Ada' });
    setDraft({ ...draft, lastName: 'Lovelace' });
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
