// Goal: Implement a FrequencyStack where popMax() removes the most recently pushed
//       element among those with the highest frequency. All operations O(1).
//
// push(val): push val onto the stack
// popMax(): remove and return the most recently pushed element with the current max frequency
//
// Shadow state: a frequency map and a map from frequency to a stack of values at that freq.
// The invariant: maxFreq always holds the current highest frequency in the structure.
//
// Example:
//   push(5), push(7), push(5), push(7), push(4), push(5)
//   popMax() -> 5  (freq 3, most recent at that freq)
//   popMax() -> 7  (freq 2 now highest, most recent 7)
//   popMax() -> 5  (freq 2 still, most recent 5)
class FrequencyStack {
  private freq: Map<number, number> = new Map();
  private group: Map<number, number[]> = new Map();
  private maxFreq: number = 0;

  push(val: number): void {
    const f = (this.freq.get(val) ?? 0) + 1;
    this.freq.set(val, f);
    if (f > this.maxFreq) this.maxFreq = f;
    if (!this.group.has(f)) this.group.set(f, []);
    this.group.get(f)!.push(val);
  }

  popMax(): number {
    const stack = this.group.get(this.maxFreq)!;
    const val = stack.pop()!;
    if (stack.length === 0) {
      this.group.delete(this.maxFreq);
      this.maxFreq--;
    }
    this.freq.set(val, this.freq.get(val)! - 1);
    return val;
  }
}

// ---Tests
test('popMax returns the only element', () => {
  const s = new FrequencyStack();
  s.push(1);
  return s.popMax();
}, 1);

test('popMax returns most frequent', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  return s.popMax();
}, 5);

test('popMax on tie returns most recently pushed at that frequency', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  s.push(7);
  return s.popMax();
}, 7);

test('maxFreq decrements when the top frequency group empties', () => {
  const s = new FrequencyStack();
  s.push(5);
  s.push(7);
  s.push(5);
  s.push(7);
  s.popMax();
  s.popMax();
  return s.popMax();
}, 7);

test('sequence from the doc example', () => {
  const s = new FrequencyStack();
  s.push(5); s.push(7); s.push(5); s.push(7); s.push(4); s.push(5);
  return [s.popMax(), s.popMax(), s.popMax()];
}, [5, 7, 5]);
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
