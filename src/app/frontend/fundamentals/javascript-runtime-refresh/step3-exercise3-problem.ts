export {};
// Runtime Ledger, Level 3: In-Place Change And Queue Order
// Collect the observable execution order for sync work, a Promise callback, and a timer callback.

// TODO: push 'sync-start' immediately, queue 'promise' in a microtask,
// queue 'timeout' in setTimeout(..., 0), then push 'sync-end' before awaiting the timer.
async function collectQueueOrder(): Promise<string[]> {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

async function run(): Promise<void> {
  const result = await collectQueueOrder();
  const expected = ['sync-start', 'sync-end', 'promise', 'timeout'];

  assert(result.length === expected.length, 'result has exactly four log entries');
  assert(result.every((entry, index) => entry === expected[index]), 'microtask runs before timeout');
}

void run();
// ---End Tests
