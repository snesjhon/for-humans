export {};
// Goal: implement asyncReducer<T> — the state machine that transitions AsyncState<T>
// based on dispatched actions.
//
// Each action maps to exactly one new state:
//   'fetch'   → { status: 'loading' }               (regardless of current state)
//   'resolve' → { status: 'success', data: T }       (action carries data: T)
//   'reject'  → { status: 'error', error: Error }    (action carries error: Error)
//   'reset'   → { status: 'idle' }

type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

type AsyncAction<T> =
  | { type: 'fetch' }
  | { type: 'resolve'; data: T }
  | { type: 'reject'; error: Error }
  | { type: 'reset' };

// TODO: implement the reducer — switch on action.type and return the new state
function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  throw new Error('not implemented');
}

// ---Tests
test('fetch transitions to loading from any state', () => {
  const idle: AsyncState<string> = { status: 'idle' };
  expect(asyncReducer(idle, { type: 'fetch' })).toEqual({ status: 'loading' });

  const success: AsyncState<string> = { status: 'success', data: 'old' };
  expect(asyncReducer(success, { type: 'fetch' })).toEqual({ status: 'loading' });
});

test('resolve transitions to success with data', () => {
  const loading: AsyncState<string> = { status: 'loading' };
  expect(asyncReducer(loading, { type: 'resolve', data: 'hello' })).toEqual({
    status: 'success',
    data: 'hello',
  });
});

test('reject transitions to error with the error object', () => {
  const loading: AsyncState<string> = { status: 'loading' };
  const err = new Error('not found');
  const next = asyncReducer(loading, { type: 'reject', error: err });
  expect(next).toEqual({ status: 'error', error: err });
});

test('reset transitions to idle from any state', () => {
  const error: AsyncState<string> = { status: 'error', error: new Error() };
  expect(asyncReducer(error, { type: 'reset' })).toEqual({ status: 'idle' });
});
// ---End Tests
