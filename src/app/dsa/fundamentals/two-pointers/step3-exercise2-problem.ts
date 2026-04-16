// Goal: Practice the Dutch National Flag three-way partition.
//
// A traffic signal controller receives a mixed sequence of light states:
// 'R' (red), 'G' (green), 'B' (blue). Sort all lights in-place so that
// all reds come first, then all greens, then all blues — in a single pass
// with O(1) extra space.
//
// Use three pointers: low (boundary of reds), mid (scanner), high (boundary of blues).
// - lights[mid] === 'R': swap with lights[low], advance both low and mid.
// - lights[mid] === 'G': advance mid only.
// - lights[mid] === 'B': swap with lights[high], retreat high — do NOT advance mid.
//
// The function modifies the array in-place and returns nothing.
//
// Example:
//   lights = ['G','R','B','R','G','B'] → ['R','R','G','G','B','B']
function sortTrafficLights(lights: string[]): void {
  throw new Error('not implemented');
}

// ---Tests
test('mixed lights', () => { const a = ['G','R','B','R','G','B']; sortTrafficLights(a); return a; }, ['R','R','G','G','B','B']);
test('already sorted', () => { const a = ['R','G','B']; sortTrafficLights(a); return a; }, ['R','G','B']);
test('all same color', () => { const a = ['B','B','B']; sortTrafficLights(a); return a; }, ['B','B','B']);
test('empty array',    () => { const a: string[] = []; sortTrafficLights(a); return a; }, []);
test('single light',   () => { const a = ['G']; sortTrafficLights(a); return a; }, ['G']);
test('reverse order',  () => { const a = ['B','G','R']; sortTrafficLights(a); return a; }, ['R','G','B']);
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
  } catch (e) {
    if (e instanceof Error && e.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else { throw e; }
  }
}
