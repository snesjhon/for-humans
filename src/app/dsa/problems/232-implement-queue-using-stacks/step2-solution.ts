
class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  push(x: number): void {
    this.inStack.push(x);
  }

  private pourIfNeeded(): void {
    if (this.outStack.length > 0) return;

    while (this.inStack.length > 0) {
      this.outStack.push(this.inStack.pop()!);
    }
  }

  pop(): number {
    this.pourIfNeeded();
    return this.outStack.pop()!;
  }

  peek(): number {
    this.pourIfNeeded();
    return this.outStack[this.outStack.length - 1]!;
  }

  empty(): boolean {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

runCase('peek triggers first transfer', () => {
  const queue = new MyQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);
  return queue.peek();
}, 1);

runCase('pop respects FIFO order', () => {
  const queue = new MyQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);
  return [queue.pop(), queue.pop(), queue.pop()];
}, [1, 2, 3]);

runCase('new pushes wait behind older served items', () => {
  const queue = new MyQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);
  queue.pop();
  queue.push(4);
  return [queue.peek(), queue.pop(), queue.pop(), queue.pop(), queue.empty()];
}, [2, 2, 3, 4, true]);

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
