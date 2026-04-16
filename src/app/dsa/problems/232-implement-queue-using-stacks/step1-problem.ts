// Goal: Separate arrival from service. Push into `inStack`; report empty only
// when both stacks are empty.

class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(x: number): void {
    throw new Error('not implemented');
  }

  pop(): number {
    throw new Error('not implemented');
  }

  peek(): number {
    throw new Error('not implemented');
  }

  empty(): boolean {
    throw new Error('not implemented');
  }
}

runCase('empty queue reports true', () => {
  const queue = new MyQueue();
  return queue.empty();
}, true);

runCase('push makes queue non-empty', () => {
  const queue = new MyQueue();
  queue.push(10);
  return queue.empty();
}, false);

runCase('multiple pushes still leave queue non-empty', () => {
  const queue = new MyQueue();
  queue.push(10);
  queue.push(20);
  queue.push(30);
  return queue.empty();
}, false);

function runCase(desc: string, fn: () => unknown, expected: unknown): void {
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw e;
    }
  }
}
