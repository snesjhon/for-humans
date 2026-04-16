// Goal: For each valid anchor, place left and right fingers on the remaining
// entries and squeeze inward — recording balanced triplets and skipping duplicates.

function threeSum(nums: number[]): number[][] {
  // ✓ Step 1: Sort the ledger — largest expense on left, largest income on right
  const ledger = [...nums].sort((a, b) => a - b);
  const triplets: number[][] = [];

  for (let i = 0; i < ledger.length - 2; i++) {
    if (ledger[i] > 0) break;
    if (i > 0 && ledger[i] === ledger[i - 1]) continue;

    // Step 2: Place fingers and squeeze inward
    let l = i + 1;               // left finger: smallest remaining entry
    let r = ledger.length - 1;   // right finger: largest remaining entry

    while (l < r) {
      const sum = ledger[i] + ledger[l] + ledger[r];

      if (sum === 0) {
        // Balance found — record this triplet
        triplets.push([ledger[i], ledger[l], ledger[r]]);
        // Skip duplicate left-finger values before advancing
        while (l < r && ledger[l] === ledger[l + 1]) l++;
        // Skip duplicate right-finger values before advancing
        while (l < r && ledger[r] === ledger[r - 1]) r--;
        l++;
        r--;
      } else if (sum < 0) {
        // Too much expense — shift left finger right to find more income
        l++;
      } else {
        // Too much income — shift right finger left to find less income
        r--;
      }
    }
  }

  return triplets;
}

// ---Tests
test('empty ledger returns no triplets', () => threeSum([]), []);
test('all-positive entries — break immediately', () => threeSum([1, 2, 3]), []);
test('standard case', () => threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
test('all zeros', () => threeSum([0, 0, 0]), [[0, 0, 0]]);
test('no valid triplet', () => threeSum([0, 1, 1]), []);
test('duplicate values need dedup', () => threeSum([-2, 0, 0, 2, 2]), [[-2, 0, 2]]);
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
    } else {
      throw e;
    }
  }
}
