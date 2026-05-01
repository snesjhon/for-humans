export {};
// CI Requirements Gate, Level 2: Cross-Reference
// Posts carry tag IDs, but the tag labels live in a separate catalog.
// Only active posts are evaluated. For each active post, the runner
// checks which tags it references and collects the unique labels.

interface Post {
  id: string;
  tagIds: string[];
  active: boolean;
}

interface Tag {
  id: string;
  label: string;
}

function activeTagLabels(posts: Post[], tags: Tag[]): string[] {
  // Step 1: index tag labels by ID (build the manifest)
  const labelById = new Map(tags.map((t) => [t.id, t.label]));

  // Step 2: walk active posts and collect unique labels
  const seen = new Set<string>();
  for (const post of posts) {
    if (!post.active) continue;
    for (const tagId of post.tagIds) {
      const label = labelById.get(tagId);
      if (label !== undefined) {
        seen.add(label);
      }
    }
  }
  return Array.from(seen);
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

function containsAll(result: string[], expected: string[]): boolean {
  const set = new Set(result);
  return expected.every((v) => set.has(v));
}

const tags: Tag[] = [
  { id: 't1', label: 'TypeScript' },
  { id: 't2', label: 'React' },
  { id: 't3', label: 'CSS' },
  { id: 't4', label: 'Performance' },
];

const posts: Post[] = [
  { id: 'post1', tagIds: ['t1', 't2'], active: true },
  { id: 'post2', tagIds: ['t3'],       active: false }, // inactive, excluded
  { id: 'post3', tagIds: ['t2', 't4'], active: true },
];

const result = activeTagLabels(posts, tags);
assert(result.length === 3, 'returns 3 unique labels');
assert(containsAll(result, ['TypeScript', 'React', 'Performance']), 'TypeScript, React, Performance are all present');
assert(!result.includes('CSS'), 'CSS is excluded (only on inactive post)');
// ---End Tests
