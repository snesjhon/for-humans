/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

function usePinnedIds(initial: string[]) {
  const [pinned, setPinned] = useState(() => new Set(initial));

  function toggle(id: string) {
    setPinned((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return { pinned, toggle };
}

// ---Tests
test('toggle publishes a new set for membership changes', () => {
  const { result } = renderHook(() => usePinnedIds(['pump-1']));

  const firstSet = result.current.pinned;

  act(() => {
    result.current.toggle('mixer-2');
  });

  const secondSet = result.current.pinned;
  expect(Array.from(secondSet)).toEqual(['pump-1', 'mixer-2']);
  expect(secondSet).not.toBe(firstSet);

  act(() => {
    result.current.toggle('pump-1');
  });

  expect(Array.from(result.current.pinned)).toEqual(['mixer-2']);
  expect(result.current.pinned).not.toBe(secondSet);
});
// ---End Tests
