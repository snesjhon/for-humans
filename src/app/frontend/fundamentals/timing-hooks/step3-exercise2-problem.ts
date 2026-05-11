/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Interview-style mistake, Level 3: autosave without cleanup
// Goal: this hook should autosave the latest draft only after delay ms of silence. Right now old
// timers are left running, so earlier drafts can still save after the user keeps typing, and the
// timer can fire after unmount. Fix it by cleaning up the pending timeout. The saveDraft callback
// may change between renders, so the timeout should call the latest version through the ref.
function useAutoSaveDraft(
  draft: string,
  saveDraft: (value: string) => void,
  delay: number,
) {
  const saveRef = useRef(saveDraft);
  saveRef.current = saveDraft;

  useEffect(() => {
    const id = setTimeout(() => {
      saveRef.current(draft);
    }, delay);

    // TODO: clear the pending timeout when draft or delay changes, and on unmount
    void id;
  }, [draft, delay]);
}

// ---Tests
test('autosave only persists the latest draft after the quiet period', () => {
  jest.useFakeTimers();

  const saveDraft = jest.fn();
  const { rerender } = renderHook(
    ({ draft }: { draft: string }) => useAutoSaveDraft(draft, saveDraft, 300),
    { initialProps: { draft: 'r' } },
  );

  rerender({ draft: 're' });
  rerender({ draft: 'rea' });

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(saveDraft).toHaveBeenCalledTimes(1);
  expect(saveDraft).toHaveBeenCalledWith('rea');

  jest.useRealTimers();
});

test('autosave does not fire after unmount', () => {
  jest.useFakeTimers();

  const saveDraft = jest.fn();
  const { unmount } = renderHook(() => useAutoSaveDraft('draft', saveDraft, 300));

  unmount();

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(saveDraft).not.toHaveBeenCalled();

  jest.useRealTimers();
});
// ---End Tests
