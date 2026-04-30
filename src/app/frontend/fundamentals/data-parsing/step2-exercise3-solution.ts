export {};
// Customs Checkpoint — Level 2: Cross-Reference
// Posts carry tag IDs, but the tag labels live in a separate roster.
// Only active posts are processed. For each active post, the officer
// checks which tags it references and marks those labels as cleared.

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

/*
Sample data:

const tags: Tag[] = [
  { id: 't1', label: 'TypeScript' },
  { id: 't2', label: 'React' },
  { id: 't3', label: 'CSS' },
  { id: 't4', label: 'Performance' },
];

const posts: Post[] = [
  { id: 'post1', tagIds: ['t1', 't2'], active: true },
  { id: 'post2', tagIds: ['t3'],       active: false }, // inactive, skip
  { id: 'post3', tagIds: ['t2', 't4'], active: true },
];

Expected (order does not matter): ['TypeScript', 'React', 'Performance']
  t1 -> TypeScript (post1, active)
  t2 -> React      (post1 and post3, both active)
  t3 -> CSS        (post2 only, inactive — excluded)
  t4 -> Performance (post3, active)
*/
