// =============================================================================
// Reverse an Array — Step 2 of 2: March Inward, Swap at Every Stop — SOLUTION
// =============================================================================
// Goal: While frontDealer < backDealer, swap their cards and step both inward.

function reverseArray(arr: number[]): void {
  // ✓ Step 1: Station the dealers at opposite ends of the card table
  let frontDealer = 0;
  let backDealer = arr.length - 1;

  // Step 2: March inward, swapping cards at every stop
  while (frontDealer < backDealer) {
    const heldCard = arr[frontDealer];    // front dealer grips their card briefly
    arr[frontDealer] = arr[backDealer];   // receives the back dealer's card
    arr[backDealer] = heldCard;           // back dealer receives the held card
    frontDealer++;                         // front dealer steps one position right
    backDealer--;                          // back dealer steps one position left
  }
}

// Tests — all must print PASS
test('empty array stays empty', () => {
  const arr: number[] = [];
  reverseArray(arr);
  return arr;
}, []);

test('single element stays unchanged', () => {
  const arr = [1];
  reverseArray(arr);
  return arr;
}, [1]);

test('two elements swap', () => {
  const arr = [1, 2];
  reverseArray(arr);
  return arr;
}, [2, 1]);

test('reverses even-length array', () => {
  const arr = [1, 4, 3, 2, 6, 5];
  reverseArray(arr);
  return arr;
}, [5, 6, 2, 3, 4, 1]);

test('reverses odd-length array', () => {
  const arr = [4, 5, 2];
  reverseArray(arr);
  return arr;
}, [2, 5, 4]);

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
    } else {
      throw e;
    }
  }
}
