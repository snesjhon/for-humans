// Debounce, Level 2: plain function
// Goal: implement debounce(fn, delay) so it invokes fn at most once after delay ms of silence.
// Each new call resets the timer. Only the last call in a burst fires.
export {};

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  // TODO: track a pending timer handle
  // TODO: on each call, cancel the pending timer and schedule fn(...args) after delay ms
  void fn;
  void delay;
  return (..._args: Parameters<T>) => {};
}

// ---Tests
test('debounce invokes fn once after a burst of calls', () => {
  jest.useFakeTimers();

  const fn = jest.fn();
  const debounced = debounce(fn, 300);

  debounced('a');
  debounced('b');
  debounced('c');

  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(300);

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('c');

  jest.useRealTimers();
});
// ---End Tests
