/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Goal: stock changes should happen on a fresh Map so every real update publishes a new state page.
// Hint: addUnits and removeSku can keep their current behavior, but the Map methods should run against a copied Map, not the current one.
// If you mutate the existing Map directly, the values look right but the reference stays wrong for React.
function useStockBySku(initial: Array<[string, number]>) {
  const [stockBySku, setStockBySku] = useState(() => new Map(initial));

  function addUnits(sku: string, amount: number) {
    setStockBySku((current) => {
      current.set(sku, (current.get(sku) ?? 0) + amount);
      return current;
    });
  }

  function removeSku(sku: string) {
    setStockBySku((current) => {
      current.delete(sku);
      return current;
    });
  }

  return { stockBySku, addUnits, removeSku };
}

// ---Tests
test('map updates happen on a copied map, not the current state instance', () => {
  const { result } = renderHook(() =>
    useStockBySku([
      ['pump', 2],
      ['mixer', 1],
    ]),
  );

  const firstMap = result.current.stockBySku;

  act(() => {
    result.current.addUnits('pump', 3);
  });

  const secondMap = result.current.stockBySku;
  expect(secondMap.get('pump')).toBe(5);
  expect(secondMap).not.toBe(firstMap);

  act(() => {
    result.current.removeSku('mixer');
  });

  expect(result.current.stockBySku.has('mixer')).toBe(false);
  expect(result.current.stockBySku).not.toBe(secondMap);
});
// ---End Tests
