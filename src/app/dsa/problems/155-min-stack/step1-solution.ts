
class MinStack {
  private cargoStack: number[] = [];

  push(val: number): void {
    this.cargoStack.push(val);
  }

  pop(): void {
    this.cargoStack.pop();
  }

  top(): number {
    return this.cargoStack[this.cargoStack.length - 1]!;
  }

  getMin(): number {
    throw new Error('not implemented');
  }
}

runCase('latest pushed crate is on top', () => {
  const dock = new MinStack();
  dock.push(5);
  dock.push(7);
  dock.push(9);
  return dock.top();
}, 9);

runCase('pop removes only the newest crate', () => {
  const dock = new MinStack();
  dock.push(5);
  dock.push(7);
  dock.pop();
  return dock.top();
}, 5);

runCase('push-pop chains reveal older crates again', () => {
  const dock = new MinStack();
  dock.push(4);
  dock.push(8);
  dock.pop();
  dock.push(6);
  return dock.top();
}, 6);

// ---Helpers
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
// ---End Helpers
