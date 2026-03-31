// =============================================================================
// Group Anagrams — Complete Solution
// =============================================================================

function catalogCode(word: string): string {
  return word.split('').sort().join(''); // sort letters → canonical catalog code
}

function groupAnagrams(strs: string[]): string[][] {
  const catalog = new Map<string, string[]>(); // archive: code → drawer of words

  for (const word of strs) {
    const code = catalogCode(word);       // compute catalog code for this word
    if (!catalog.has(code)) {
      catalog.set(code, []);              // open a new drawer for unseen codes
    }
    catalog.get(code)!.push(word);        // drop the word into its drawer
  }

  return Array.from(catalog.values());    // return all drawers
}

// Tests — all must print PASS
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
  () => normalizeGroups(groupAnagrams(['','',''])),
  normalizeGroups([['','','']])
);
test('repeated word with no anagram partner',
  () => normalizeGroups(groupAnagrams(['ab','ab','ab'])),
  normalizeGroups([['ab','ab','ab']])
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
