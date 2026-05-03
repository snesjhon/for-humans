export {};
// Goal: define AsyncState<T> as a four-variant discriminated union,
// then implement describeState<T> that handles each variant exhaustively.

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function describeState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':    return 'idle';
    case 'loading': return 'loading';
    case 'success': return `success: ${state.data}`;
    case 'error':   return `error: ${state.error.message}`;
    default:        return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

// ---Tests
test('describes idle state', () => {
  const state: AsyncState<string> = { status: 'idle' };
  expect(describeState(state)).toBe('idle');
});

test('describes loading state', () => {
  const state: AsyncState<string> = { status: 'loading' };
  expect(describeState(state)).toBe('loading');
});

test('describes success state with data', () => {
  const state: AsyncState<string> = { status: 'success', data: 'Alice' };
  expect(describeState(state)).toBe('success: Alice');
});

test('describes error state with message', () => {
  const state: AsyncState<string> = { status: 'error', error: new Error('not found') };
  expect(describeState(state)).toBe('error: not found');
});
// ---End Tests
