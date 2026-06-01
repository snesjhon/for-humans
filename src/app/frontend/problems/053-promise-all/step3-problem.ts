type PromiseInput<T> = Promise<T> | T;

function delayValue<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function delayError(message: string, ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

// Goal: reject immediately when the first input rejects, while still preserving
// the Step 2 behavior for fulfilled batches.
export function promiseAll<T>(inputs: Array<PromiseInput<T>>): Promise<T[]> {
  return new Promise((resolve) => {
    if (inputs.length === 0) {
      resolve([]);
      return;
    }

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

test('rejects with the first error instead of waiting for the rest', async () => {
  const resultPromise = promiseAll([
    delayValue('slow-success', 30),
    delayError('network failed', 10),
    delayValue('later-success', 20),
  ]);

  jest.advanceTimersByTime(10);
  await Promise.resolve();
  await Promise.resolve();

  await expect(resultPromise).rejects.toThrow('network failed');
});

test('still resolves ordered results when every input fulfills', async () => {
  const resultPromise = promiseAll([
    delayValue('slow-first', 30),
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
// ---End Tests
