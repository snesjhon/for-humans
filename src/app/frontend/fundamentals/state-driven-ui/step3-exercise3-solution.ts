/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

type StatusFilter = 'all' | 'open' | 'closed';

interface ViewState {
  query: string;
  status: StatusFilter;
  page: number;
}

// Goal: publish one next view snapshot because the preset is one view transaction.
function useDashboardView() {
  const [view, setView] = useState<ViewState>({
    query: '',
    status: 'all',
    page: 4,
  });

  function applyPreset(preset: { query: string; status: StatusFilter }) {
    setView({
      ...view,
      query: preset.query,
      status: preset.status,
      page: 1,
    });
  }

  return { view, applyPreset };
}

// ---Tests
test('preset changes query, status, and page together', () => {
  const { result } = renderHook(() => useDashboardView());

  act(() => {
    result.current.applyPreset({ query: 'pump', status: 'open' });
  });

  expect(result.current.view).toEqual({
    query: 'pump',
    status: 'open',
    page: 1,
  });
});
// ---End Tests
