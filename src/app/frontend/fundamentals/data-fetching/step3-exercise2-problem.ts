export {};

// Sealed Envelope, Level 3: render logic from explicit phases
// Goal: switch on status and return the right UI label for each branch.

type AsyncState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };

// TODO: Return:
// - 'Idle: no request yet'
// - 'Loading: request in flight'
// - `Success: ${state.data.length} devices`
// - `Error: ${state.error}`
function describeAsyncState(state: AsyncState<{ id: string }[]>): string {
  return 'TODO';
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

assert(
  describeAsyncState({ status: 'idle' }) === 'Idle: no request yet',
  'idle branch gets its own label',
);

assert(
  describeAsyncState({ status: 'loading' }) === 'Loading: request in flight',
  'loading branch gets its own label',
);

assert(
  describeAsyncState({ status: 'success', data: [{ id: 'd-1' }, { id: 'd-2' }] }) ===
    'Success: 2 devices',
  'success branch can read typed data',
);

assert(
  describeAsyncState({ status: 'error', error: 'Network down' }) === 'Error: Network down',
  'error branch shows the failure message',
);
