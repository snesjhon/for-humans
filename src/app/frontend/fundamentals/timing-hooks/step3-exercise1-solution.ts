// Throttle, Level 3: plain function
// Goal: implement throttle(fn, limit) so it invokes fn immediately on the first call,
// then ignores subsequent calls until limit ms have elapsed since the last invocation.
export {};

function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let lastCalled = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCalled < limit) return;
    lastCalled = now;
    fn(...args);
  };
}

test('throttle fires immediately and then enforces the cooldown', () => {
  jest.useFakeTimers();

  const fn = jest.fn();
  const throttled = throttle(fn, 300);

  throttled('a');
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('a');

  throttled('b');
  throttled('c');
  expect(fn).toHaveBeenCalledTimes(1);

  jest.advanceTimersByTime(300);

  throttled('d');
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith('d');

  jest.useRealTimers();
});
