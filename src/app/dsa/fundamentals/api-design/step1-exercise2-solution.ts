// Goal: Implement a Max Stack where getMax() is O(1) using the shadow state pattern.
//
// Implement push(val), pop(), top(), and getMax() — all O(1).
// Use a shadow max-stack that records max(val, shadow.top) on every push,
// so every pop restores the previous maximum instantly.
//
// Example:
//   const s = new MaxStack(); s.push(3); s.push(7); s.push(4);
//   s.getMax() -> 7
//   s.pop();    s.getMax() -> 7  (4 was removed, max is still 7)
//   s.pop();    s.getMax() -> 3  (7 was removed, max restores to 3)
class MaxStack {
  private main: number[] = [];
  private maxes: number[] = [];

  push(val: number): void {
    this.main.push(val);
    const currentMax = this.maxes.length === 0 ? val : Math.max(val, this.maxes[this.maxes.length - 1]);
    this.maxes.push(currentMax);
  }

  pop(): void {
    this.main.pop();
    this.maxes.pop();
  }

  top(): number {
    return this.main[this.main.length - 1];
  }

  getMax(): number {
    return this.maxes[this.maxes.length - 1];
  }
}

// ---Tests
test('getMax with a single element', () => {
  const s = new MaxStack();
  s.push(4);
  return s.getMax();
}, 4);

test('getMax after pushing a larger element', () => {
  const s = new MaxStack();
  s.push(2);
  s.push(8);
  return s.getMax();
}, 8);

test('getMax is still correct after popping a non-maximum element', () => {
  const s = new MaxStack();
  s.push(6);
  s.push(9);
  s.push(3);
  s.pop();
  return s.getMax();
}, 9);

test('getMax restores after popping the current maximum', () => {
  const s = new MaxStack();
  s.push(2);
  s.push(9);
  s.pop();
  return s.getMax();
}, 2);

test('top and getMax are independent', () => {
  const s = new MaxStack();
  s.push(5);
  s.push(10);
  s.push(1);
  return [s.top(), s.getMax()];
}, [1, 10]);
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
