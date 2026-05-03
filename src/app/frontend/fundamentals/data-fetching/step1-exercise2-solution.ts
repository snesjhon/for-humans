export {};
// Goal: implement awaitAll<T> that resolves an array containing a mix of plain values
// and Promises into a flat array of resolved values.
//
// Awaited<T | Promise<T>> collapses to T — await handles both cases uniformly.
// Promise.all resolves each element: plain values pass through, Promises get awaited.

async function awaitAll<T>(items: Array<T | Promise<T>>): Promise<T[]> {
  return Promise.all(items) as Promise<T[]>;
}

// ---Tests
test('resolves a mix of values and promises', async () => {
  const result = await awaitAll(['a', Promise.resolve('b'), 'c']);
  expect(result).toEqual(['a', 'b', 'c']);
});

test('resolves all promises in order', async () => {
  const result = await awaitAll([Promise.resolve(1), Promise.resolve(2), 3]);
  expect(result).toEqual([1, 2, 3]);
});

test('passes through plain values unchanged', async () => {
  const result = await awaitAll([10, 20, 30]);
  expect(result).toEqual([10, 20, 30]);
});
// ---End Tests
