export {};
// Goal: implement getResolved<F> so it calls the fetcher and returns whatever it resolves to.
// The return type Awaited<ReturnType<F>> is already provided — TypeScript knows the data type.

type FetcherFn = () => Promise<unknown>;

async function getResolved<F extends FetcherFn>(fn: F): Promise<Awaited<ReturnType<F>>> {
  return fn() as Promise<Awaited<ReturnType<F>>>;
}

// ---Tests
test('resolves string fetcher to string value', async () => {
  const fetchName = async () => 'Alice';
  const result = await getResolved(fetchName);
  expect(result).toBe('Alice');
});

test('resolves number fetcher to number value', async () => {
  const fetchAge = async () => 42;
  const result = await getResolved(fetchAge);
  expect(result).toBe(42);
});

test('resolves object fetcher to object value', async () => {
  const fetchUser = async () => ({ id: 1, name: 'Bob' });
  const result = await getResolved(fetchUser);
  expect(result).toEqual({ id: 1, name: 'Bob' });
});
// ---End Tests
