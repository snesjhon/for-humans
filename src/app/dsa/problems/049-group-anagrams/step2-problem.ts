// Goal: Use the catalog code to group all words into anagram families.
//       One pass through strs, one HashMap lookup per word.

function catalogCode(word: string): string {
  // ✓ Step 1: sort letters to generate the catalog code (locked)
  return word.split('').sort().join('');
}

function groupAnagrams(strs: string[]): string[][] {
  throw new Error('not implemented');
}

// ---Tests
test('LeetCode example 1',
  () => normalizeGroups(groupAnagrams(['eat','tea','tan','ate','nat','bat'])),
  normalizeGroups([["bat"],["nat","tan"],["ate","eat","tea"]])
);
test('single empty string',
  () => normalizeGroups(groupAnagrams([''])),
  normalizeGroups([['']])
);
test('single word',
  () => normalizeGroups(groupAnagrams(['a'])),
  normalizeGroups([['a']])
);
test('all in one group',
  () => normalizeGroups(groupAnagrams(['abc','bca','cab'])),
  normalizeGroups([['abc','bca','cab']])
);
test('no anagrams — every word is its own group',
  () => normalizeGroups(groupAnagrams(['abc','def','ghi'])),
  normalizeGroups([['abc'],['def'],['ghi']])
);
test('two groups',
  () => normalizeGroups(groupAnagrams(['eat','tea','dog','god'])),
  normalizeGroups([['eat','tea'],['dog','god']])
);
test('multiple empty strings in one group',
// ---End Tests
  () => normalizeGroups(groupAnagrams(['','',''])),
  normalizeGroups([['','','']])
);

// ---Helpers
function normalizeGroups(groups: string[][]): string[][] {
  return groups
    .map(g => [...g].sort())
    .sort((a, b) => a.join(',').localeCompare(b.join(',')));
}

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
