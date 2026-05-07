export {};

// Sealed Envelope, Level 3: transform data without losing the phase model
// Goal: only map the success payload. Pass idle/loading/error through unchanged.

type AsyncState<TData> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TData }
  | { status: 'error'; error: string };

// TODO: If state is success, return success with transformed data.
// Otherwise return the original branch unchanged.
function mapAsyncData<TData, TResult>(
  state: AsyncState<TData>,
  map: (value: TData) => TResult,
): AsyncState<TResult> {
  return { status: 'idle' };
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

const idle = mapAsyncData({ status: 'idle' }, (value: number[]) => value.length);
assert(idle.status === 'idle', 'idle passes through unchanged');

const loading = mapAsyncData({ status: 'loading' }, (value: number[]) => value.length);
assert(loading.status === 'loading', 'loading passes through unchanged');

const error = mapAsyncData({ status: 'error', error: 'Timed out' }, (value: number[]) => value.length);
assert(error.status === 'error' && error.error === 'Timed out', 'error passes through unchanged');

const success = mapAsyncData({ status: 'success', data: [10, 20, 30] }, (value) => value.length);
assert(success.status === 'success' && success.data === 3, 'success transforms the payload');
