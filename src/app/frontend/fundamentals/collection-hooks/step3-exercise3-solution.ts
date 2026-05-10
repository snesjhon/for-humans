/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

type UseMapStateResult<K extends PropertyKey, V> = {
  entries: Map<K, V>;
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  remove: (key: K) => void;
};

function useMapState<K extends PropertyKey, V>(
  initialEntries: Array<[K, V]>,
): UseMapStateResult<K, V> {
  const [entries, setEntries] = useState(() => new Map(initialEntries));

  return {
    entries,
    get(key) {
      return entries.get(key);
    },
    set(key, value) {
      setEntries((current) => {
        const next = new Map(current);
        next.set(key, value);
        return next;
      });
    },
    remove(key) {
      setEntries((current) => {
        const next = new Map(current);
        next.delete(key);
        return next;
      });
    },
  };
}

// ---Tests
test('generic hook return shape stays linked to inferred key and value types', () => {
  const deviceEntries: Array<[string, { online: boolean }]> = [
    ['pump-1', { online: true }],
  ];

  const { result } = renderHook(() => useMapState(deviceEntries));

  type Equal<A, B> =
    (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
      ? true
      : false;

  type Expect<T extends true> = T;

  type EntriesCheck = Expect<
    Equal<typeof result.current.entries, Map<string, { online: boolean }>>
  >;
  type GetCheck = Expect<
    Equal<ReturnType<typeof result.current.get>, { online: boolean } | undefined>
  >;

  act(() => {
    result.current.set('fan-3', { online: false });
  });

  expect(result.current.get('pump-1')).toEqual({ online: true });
  expect(result.current.get('fan-3')).toEqual({ online: false });

  act(() => {
    result.current.remove('pump-1');
  });

  expect(result.current.get('pump-1')).toBeUndefined();
});
// ---End Tests
