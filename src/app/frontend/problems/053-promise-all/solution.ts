type PromiseInput<T> = Promise<T> | T;

// Normalize every branch through Promise.resolve, store each fulfilled value in
// its input slot, resolve when the shared remaining count hits zero, and reject
// immediately on the first failure.
export function promiseAll<T>(inputs: Array<PromiseInput<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (inputs.length === 0) {
      resolve([]);
      return;
    }

    const results: T[] = new Array(inputs.length);
    let remaining = inputs.length;

    for (let index = 0; index < inputs.length; index += 1) {
      const input = inputs[index];

      Promise.resolve(input).then(
        (value: T) => {
          results[index] = value;
          remaining -= 1;

          if (remaining === 0) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        },
      );
    }
  });
}
