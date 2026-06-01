type PromiseInput<T> = Promise<T> | T;

function delayValue<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

// Goal: support both plain values and promises, and resolve immediately with
// [] when the input array is empty.
export function promiseAll<T>(inputs: Array<PromiseInput<T>>): Promise<T[]> {
  return new Promise((resolve) => {
    const results: T[] = new Array(inputs.length);
    let remaining = inputs.length;

    for (let index = 0; index < inputs.length; index += 1) {
      const input = inputs[index];

      Promise.resolve(input).then((value: T) => {
        results[index] = value;
        remaining -= 1;

        if (remaining === 0) {
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

test('keeps plain values and promises in one ordered result array', async () => {
  const resultPromise = promiseAll([
    delayValue('slow-first', 20),
    'plain-second',
    delayValue('fast-third', 10),
  ]);

  jest.runAllTimers();

  await expect(resultPromise).resolves.toEqual([
    'slow-first',
    'plain-second',
    'fast-third',
  ]);
});

test('resolves immediately with an empty array when there are no inputs', async () => {
  await expect(promiseAll([])).resolves.toEqual([]);
});
// ---End Tests
