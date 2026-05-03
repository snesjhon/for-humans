export {};
// Goal: implement extractIfSuccess<S> using the AsyncData<S> type provided.
// AsyncData<S> uses `infer` to capture the data field type only when S has status 'success'.
// The runtime guard checks status and the presence of 'data' to match what the type describes.

type AsyncData<S> = S extends { status: 'success'; data: infer T } ? T : never;

function extractIfSuccess<S extends { status: string }>(state: S): AsyncData<S> | null {
  if (state.status === 'success' && 'data' in state) {
    return (state as { status: 'success'; data: AsyncData<S> }).data;
  }
  return null;
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
