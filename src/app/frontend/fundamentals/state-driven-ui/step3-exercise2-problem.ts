/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface Item {
  id: string;
  title: string;
}

const items: Item[] = [
  { id: 'draft', title: 'Draft release note' },
  { id: 'retro', title: 'Retro notes' },
];

// Goal: opening an item should update the editor session coherently.
function useEditorSession() {
  const [selectedId, setSelectedId] = useState('draft');
  const [draftTitle, setDraftTitle] = useState('Draft release note');
  const [isDirty, setIsDirty] = useState(true);

  function openItem(nextId: string) {
    setSelectedId(nextId);

    const item = items.find((entry) => entry.id === selectedId);
    setDraftTitle(item?.title ?? '');
    setIsDirty(false);
  }

  return { selectedId, draftTitle, isDirty, openItem };
}

// ---Tests
test('selecting a new item loads that item title and clears dirty state', () => {
  const { result } = renderHook(() => useEditorSession());

  act(() => {
    result.current.openItem('retro');
  });

  expect(result.current.selectedId).toBe('retro');
  expect(result.current.draftTitle).toBe('Retro notes');
  expect(result.current.isDirty).toBe(false);
});
// ---End Tests
