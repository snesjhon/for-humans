// =============================================================================
// Two Pointers — Level 3, Exercise 2: Sort the Traffic Lights — SOLUTION
// =============================================================================
// Goal: Practice the Dutch National Flag three-way partition.
//
// Invariant: [0, low) = 'R', [low, mid) = 'G', [mid, high] = unclassified,
// (high, n-1] = 'B'. Loop until mid > high — unclassified region is empty.
// Critical: after swapping 'B' to high, do NOT advance mid — the element
// that arrived at mid from the unclassified region must be reclassified.
// =============================================================================
function sortTrafficLights(lights: string[]): void {
  let low = 0, mid = 0, high = lights.length - 1;
  while (mid <= high) {
    if (lights[mid] === 'R') {
      [lights[low], lights[mid]] = [lights[mid], lights[low]];
      low++; mid++;
    } else if (lights[mid] === 'G') {
      mid++;
    } else {
      [lights[mid], lights[high]] = [lights[high], lights[mid]];
      high--;
      // do not advance mid — swapped element needs reclassification
    }
  }
}

test('mixed lights', () => { const a = ['G','R','B','R','G','B']; sortTrafficLights(a); return a; }, ['R','R','G','G','B','B']);
test('already sorted', () => { const a = ['R','G','B']; sortTrafficLights(a); return a; }, ['R','G','B']);
test('all same color', () => { const a = ['B','B','B']; sortTrafficLights(a); return a; }, ['B','B','B']);
test('empty array',    () => { const a: string[] = []; sortTrafficLights(a); return a; }, []);
test('single light',   () => { const a = ['G']; sortTrafficLights(a); return a; }, ['G']);
test('reverse order',  () => { const a = ['B','G','R']; sortTrafficLights(a); return a; }, ['R','G','B']);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
