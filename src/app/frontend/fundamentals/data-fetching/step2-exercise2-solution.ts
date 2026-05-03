export {};
// Goal: implement asyncReducer<T> — the state machine that transitions AsyncState<T>
// based on dispatched actions.

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

function asyncReducer<T>(_state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'fetch':   return { status: 'loading' };
    case 'resolve': return { status: 'success', data: action.data };
    case 'reject':  return { status: 'error', error: action.error };
    case 'reset':   return { status: 'idle' };
  }
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
