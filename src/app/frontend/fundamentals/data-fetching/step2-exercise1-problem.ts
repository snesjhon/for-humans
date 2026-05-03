export {};
// Goal: define AsyncState<T> as a four-variant discriminated union,
// then implement describeState<T> that handles each variant exhaustively.
//
// TypeScript should make it a compile error to skip a variant.
// Use a switch with a default that asserts `never` to enforce exhaustiveness.

// TODO: define AsyncState<T> with four variants: idle, loading, success, error
// Each variant must have a 'status' field as the discriminant.
// The 'success' variant carries 'data: T'.
// The 'error' variant carries 'error: Error'.
type AsyncState<T> = never; // TODO

function describeState<T>(state: AsyncState<T>): string {
  // TODO: implement using a switch on state.status
  // Make the switch exhaustive: add a default that does assertNever(state)
  throw new Error('not implemented');
}

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

// ---Tests
test('describes idle state', () => {
  const state = { status: 'idle' } as AsyncState<string>;
  expect(describeState(state)).toBe('idle');
});

test('describes loading state', () => {
  const state = { status: 'loading' } as AsyncState<string>;
  expect(describeState(state)).toBe('loading');
});

test('describes success state with data', () => {
  const state = { status: 'success', data: 'Alice' } as AsyncState<string>;
  expect(describeState(state)).toBe('success: Alice');
});

test('describes error state with message', () => {
  const state = { status: 'error', error: new Error('not found') } as AsyncState<string>;
  expect(describeState(state)).toBe('error: not found');
});
// ---End Tests
