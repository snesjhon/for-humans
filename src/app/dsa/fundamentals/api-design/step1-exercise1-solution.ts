// Goal: Observe the broken getMin, predict which test fails, then fix it with a shadow min-stack.
//
// The broken implementation scans the whole stack on every getMin call.
// That is O(n) — and wrong on one specific test case.
// Add a shadow min-stack so getMin is O(1) and all five tests pass.
//
// Example:
//   const s = new MinStack(); s.push(3); s.push(1); s.push(5);
//   s.getMin() -> 1
//   s.pop();    s.getMin() -> 1  (5 was on top, min is still 1)
//   s.pop();    s.getMin() -> 3  (1 was on top, min correctly restores to 3)
class MinStack {
  private main: number[] = [];
  private mins: number[] = [];

  push(val: number): void {
    this.main.push(val);
    const currentMin = this.mins.length === 0 ? val : Math.min(val, this.mins[this.mins.length - 1]);
    this.mins.push(currentMin);
  }

  pop(): void {
    this.main.pop();
    this.mins.pop();
  }

  top(): number {
    return this.main[this.main.length - 1];
  }

  getMin(): number {
    return this.mins[this.mins.length - 1];
  }
}

// ---Tests
test('getMin returns the only element', () => {
  const s = new MinStack();
  s.push(5);
  return s.getMin();
}, 5);

test('getMin after pushing a smaller element', () => {
  const s = new MinStack();
  s.push(5);
  s.push(2);
  return s.getMin();
}, 2);

test('getMin after pushing a larger element after the min', () => {
  const s = new MinStack();
  s.push(5);
  s.push(2);
  s.push(9);
  return s.getMin();
}, 2);

test('getMin correctly restores after popping the current minimum', () => {
  const s = new MinStack();
  s.push(3);
  s.push(1);
  s.pop(); // removes 1, min should restore to 3
  return s.getMin();
}, 3);

test('top and getMin are independent', () => {
  const s = new MinStack();
  s.push(4);
  s.push(2);
  s.push(6);
  return [s.top(), s.getMin()];
}, [6, 2]);
// ---End Tests

// ---Helpers
function test(desc: string, fn: () => unknown, expected: unknown): void {
  const actual = fn();
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
  if (!pass) {
    console.log(`  expected: ${JSON.stringify(expected)}`);
    console.log(`  received: ${JSON.stringify(actual)}`);
  }
}
// ---End Helpers

export {};
