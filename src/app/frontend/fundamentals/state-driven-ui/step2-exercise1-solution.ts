/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface Swatch {
  id: string;
  hex: string;
}

const swatches: Swatch[] = [
  { id: 'info', hex: '#0ea5e9' },
  { id: 'warning', hex: '#f59e0b' },
  { id: 'danger', hex: '#ef4444' },
];

// Goal: derive the next swatch once and let both state updates read from that shared note.
function usePalettePicker() {
  const [selectedId, setSelectedId] = useState('info');
  const [preview, setPreview] = useState('#0ea5e9');

  function select(nextId: string) {
    const swatch = swatches.find((entry) => entry.id === nextId);
    setSelectedId(nextId);
    setPreview(swatch?.hex ?? '#000000');
  }

  return { selectedId, preview, select };
}

// ---Tests
test('preview matches the swatch clicked by the user', () => {
  const { result } = renderHook(() => usePalettePicker());

  act(() => {
    result.current.select('warning');
  });

  expect(result.current.selectedId).toBe('warning');
  expect(result.current.preview).toBe('#f59e0b');
});
// ---End Tests
