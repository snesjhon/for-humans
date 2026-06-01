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
  // TODO: Add a shadow maxes stack alongside main.
  private main: number[] = [];

  push(val: number): void {
    // TODO: push to main and push max(val, maxes.top) to maxes
    throw new Error('not implemented');
  }

  pop(): void {
    // TODO: pop from both main and maxes
    throw new Error('not implemented');
  }

  top(): number {
    // TODO: return main top
    throw new Error('not implemented');
  }

  getMax(): number {
    // TODO: return maxes top
    throw new Error('not implemented');
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
  s.push(3); // 3 is not a new max; shadow must still record 9
  s.pop();   // pop 3
  return s.getMax();
}, 9);

test('getMax restores after popping the current maximum', () => {
  const s = new MaxStack();
  s.push(2);
  s.push(9);
  s.pop(); // removes 9, max should restore to 2
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
