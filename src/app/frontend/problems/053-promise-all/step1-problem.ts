function delayValue<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

// Goal: return one promise that fulfills with all results in input order,
// even when the individual promises settle out of order.
export function promiseAll<T>(inputs: Array<Promise<T>>): Promise<T[]> {
  return new Promise((resolve) => {
    const results: T[] = [];

    for (const input of inputs) {
      input.then((value) => {
        results.push(value);
        if (results.length === inputs.length) {
          resolve(results);
        }
      });
    }
  });
}

// ---Tests
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('resolves with values in the original input order', async () => {
  const resultPromise = promiseAll([
    delayValue('slow-first', 30),
    delayValue('fast-second', 10),
    delayValue('slow-third', 20),
  ]);

  jest.runAllTimers();

  await expect(resultPromise).resolves.toEqual([
    'slow-first',
    'fast-second',
    'slow-third',
  ]);
});

test('does not settle before every input promise fulfills', async () => {
  let settled = false;

  const resultPromise = promiseAll([
    delayValue('first', 10),
    delayValue('second', 20),
  ]).then(() => {
    settled = true;
  });

  jest.advanceTimersByTime(10);
  await Promise.resolve();
  await Promise.resolve();

  expect(settled).toBe(false);

  jest.runAllTimers();
  await resultPromise;

  expect(settled).toBe(true);
});
// ---End Tests
