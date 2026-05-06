export {};
// Runtime Ledger, Level 3: In-Place Change And Queue Order
// Collect the observable execution order for sync work, a Promise callback, and a timer callback.

async function collectQueueOrder(): Promise<string[]> {
  const order: string[] = [];

  order.push('sync-start');

  Promise.resolve().then(() => {
    order.push('promise');
  });

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      order.push('timeout');
      resolve();
    }, 0);
    order.push('sync-end');
  });

  return order;
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
