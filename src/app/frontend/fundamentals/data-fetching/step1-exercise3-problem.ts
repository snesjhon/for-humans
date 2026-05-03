export {};
// Goal: implement extractIfSuccess<S> using the AsyncData<S> type provided.
// AsyncData<S> uses `infer` to extract the data field only when S is a success state.
// Your job: write the runtime guard that matches what the type describes.

type AsyncData<S> = S extends { status: 'success'; data: infer T } ? T : never;

// TODO: implement extractIfSuccess so it returns state.data when status is 'success',
// and null for all other states. The return type AsyncData<S> | null is already correct.
function extractIfSuccess<S extends { status: string }>(state: S): AsyncData<S> | null {
  throw new Error('not implemented');
}

// ---Tests
test('returns data from success state', () => {
  const success = { status: 'success' as const, data: 'Alice' };
  const result = extractIfSuccess(success);
  expect(result).toBe('Alice');
});

test('returns null from idle state', () => {
  const idle = { status: 'idle' as const };
  expect(extractIfSuccess(idle)).toBeNull();
});

test('returns null from loading state', () => {
  const loading = { status: 'loading' as const };
  expect(extractIfSuccess(loading)).toBeNull();
});

test('returns null from error state', () => {
  const error = { status: 'error' as const, error: new Error('oops') };
  expect(extractIfSuccess(error)).toBeNull();
});

test('works with object data', () => {
  const success = { status: 'success' as const, data: { id: 1, name: 'Bob' } };
  const result = extractIfSuccess(success);
  expect(result).toEqual({ id: 1, name: 'Bob' });
});
// ---End Tests
