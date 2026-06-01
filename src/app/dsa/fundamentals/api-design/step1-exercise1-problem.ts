// Goal: Observe which test the broken shadow min-stack fails, then fix the invariant.
//
// The attempt below almost works: it only pushes to the shadow when the new element
// is strictly smaller than the current minimum. That breaks the pop alignment.
//
// Predict which test fails. Then fix push() so the shadow records min(val, shadow.top)
// on every push — one shadow entry per main entry — and getMin is always O(1).
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
    // TODO: This only pushes to mins when val is strictly a new minimum.
    // Shadow and main fall out of sync after a non-minimum push.
    // Fix: always push min(val, shadow.top) so the lengths stay equal and
    // pop() can simply pop both unconditionally.
    if (this.mins.length === 0 || val < this.mins[this.mins.length - 1]) {
      this.mins.push(val);
    }
  }

  pop(): void {
    this.main.pop();
    this.mins.pop(); // pops from shadow unconditionally — wrong when push skipped it
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

test('getMin is still correct after popping a non-minimum element', () => {
  const s = new MinStack();
  s.push(5);
  s.push(2);
  s.push(9); // 9 is not a new minimum, so buggy shadow skips it
  s.pop();   // pop 9 — shadow incorrectly pops 2, making getMin() return 5
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
  try {
    const actual = fn();
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
// ---End Helpers

export {};
