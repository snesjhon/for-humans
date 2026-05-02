// Defer listener callbacks to the macrotask queue so synchronous work in the
// caller completes before any listener runs.
export function emit(listeners: Array<() => void>): void {
  for (const listener of listeners) {
    setTimeout(listener, 0);
  }
}

// Move resolve() inside the setTimeout callback so the promise only settles
// once the data is actually available.
export function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 50);
  });
}

// Wrap setTimeout in a Promise so the async function actually suspends.
// Without the await, the function resolves immediately and the callback
// fires as an orphaned macrotask after the caller has moved on.
export async function delay(ms: number, log: string[]): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, ms));
  log.push('done');
}
