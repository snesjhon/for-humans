
class MinStack {
  private cargoStack: number[] = [];
  private recordLightStack: number[] = [];

  push(val: number): void {
    this.cargoStack.push(val);

    if (
      this.recordLightStack.length === 0 ||
      val <= this.recordLightStack[this.recordLightStack.length - 1]!
    ) {
      this.recordLightStack.push(val);
    }
  }

  pop(): void {
    const departingCrate = this.cargoStack.pop()!;

    if (departingCrate === this.recordLightStack[this.recordLightStack.length - 1]!) {
      this.recordLightStack.pop();
    }
  }

  top(): number {
    return this.cargoStack[this.cargoStack.length - 1]!;
  }

  getMin(): number {
    return this.recordLightStack[this.recordLightStack.length - 1]!;
  }
}

runCase('prompt example sequence', () => {
  const dock = new MinStack();
  dock.push(-2);
  dock.push(0);
  dock.push(-3);
  const firstMin = dock.getMin();
  dock.pop();
  return [firstMin, dock.top(), dock.getMin()];
}, [-3, 0, -2]);

runCase('duplicate lightest crates survive one pop', () => {
  const dock = new MinStack();
  dock.push(2);
  dock.push(1);
  dock.push(1);
  dock.pop();
  return dock.getMin();
}, 1);

runCase('older minimum returns after lighter crate leaves', () => {
  const dock = new MinStack();
  dock.push(5);
  dock.push(3);
  dock.push(4);
  dock.push(2);
  dock.pop();
  return dock.getMin();
}, 3);

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
