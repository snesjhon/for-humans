/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

function useStockBySku(initial: Array<[string, number]>) {
  const [stockBySku, setStockBySku] = useState(() => new Map(initial));

  function addUnits(sku: string, amount: number) {
    setStockBySku((current) => {
      const next = new Map(current);
      next.set(sku, (next.get(sku) ?? 0) + amount);
      return next;
    });
  }

  function removeSku(sku: string) {
    setStockBySku((current) => {
      const next = new Map(current);
      next.delete(sku);
      return next;
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
