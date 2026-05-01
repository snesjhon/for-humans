/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useEffect, useRef } from 'react';

// Goal: the listener stays mounted once, and a ref keeps the latest escape handler ready.
function useEscapeKey(handler: () => void) {
  const latestHandler = useRef(handler);
  latestHandler.current = handler;

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        latestHandler.current();
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
