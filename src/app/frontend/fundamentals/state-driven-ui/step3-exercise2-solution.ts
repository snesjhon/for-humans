/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

interface Item {
  id: string;
  title: string;
}

interface EditorSession {
  selectedId: string;
  draftTitle: string;
  isDirty: boolean;
}

const items: Item[] = [
  { id: 'draft', title: 'Draft release note' },
  { id: 'retro', title: 'Retro notes' },
];

// Goal: treat the editor switch as one session update built from the clicked item.
function useEditorSession() {
  const [session, setSession] = useState<EditorSession>({
    selectedId: 'draft',
    draftTitle: 'Draft release note',
    isDirty: true,
  });

  function openItem(nextId: string) {
    const item = items.find((entry) => entry.id === nextId);

    setSession({
      selectedId: nextId,
      draftTitle: item?.title ?? '',
      isDirty: false,
    });
  }

  return { ...session, openItem };
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
