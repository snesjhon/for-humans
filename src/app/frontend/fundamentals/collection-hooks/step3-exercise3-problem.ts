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

// Goal: make this hook infer its key and value types from the initial entries and carry those types through the whole API.
// TODO: keep K and V inferred from the initial entries,
// and make the returned API use those same types everywhere.
function useMapState(
  initialEntries: Array<[PropertyKey, unknown]>,
): UseMapStateResult<PropertyKey, unknown> {
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
