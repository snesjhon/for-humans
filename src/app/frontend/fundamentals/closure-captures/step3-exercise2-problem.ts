/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';

// Goal: keep one escape listener attached, but let it always call the latest handler.
function useEscapeKey(handler: () => void) {
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handler();
      }
    }

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, []);
}

// ---Tests
test('escape listener keeps one subscription and calls the latest handler', () => {
  const addSpy = jest.spyOn(document, 'addEventListener');
  const removeSpy = jest.spyOn(document, 'removeEventListener');
  const firstHandler = jest.fn();
  const latestHandler = jest.fn();

  const { rerender, unmount } = renderHook(
    ({ handler }) => useEscapeKey(handler),
    { initialProps: { handler: firstHandler } },
  );

  rerender({ handler: latestHandler });

  act(() => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  });

  const keydownAdds = addSpy.mock.calls.filter(
    ([type]) => type === 'keydown',
  ).length;
  const keydownRemoves = removeSpy.mock.calls.filter(
    ([type]) => type === 'keydown',
  ).length;

  expect(keydownAdds).toBe(1);
  expect(keydownRemoves).toBe(0);
  expect(firstHandler).not.toHaveBeenCalled();
  expect(latestHandler).toHaveBeenCalledTimes(1);

  unmount();
  addSpy.mockRestore();
  removeSpy.mockRestore();
});
// ---End Tests
