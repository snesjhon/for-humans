import {
  applyEditableSnippet,
  extractEditableSnippet,
  normalizeDsaEditorContent,
  parseStoredSnippet,
} from '@/lib/dsa/codePersistence'

const problemFile = `// =============================================================================
// Two Sum — Step 1 of 1
// =============================================================================
function twoSum(nums: number[], target: number): number[] {
  throw new Error('not implemented');
}

// Tests
test('finds pair', () => twoSum([2, 7], 9), [0, 1]);
`

const linkedListProblemFile = `// =============================================================================
// Linked Lists — Level 1, Exercise 1
// =============================================================================
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function countNodes(head: ListNode | null): number {
  throw new Error('not implemented');
}

test('empty train', () => countNodes(null), 0);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildList(values: number[]): ListNode | null {
  return null;
}
`

describe('dsa code persistence', () => {
  it('extracts only the editable snippet', () => {
    expect(extractEditableSnippet(problemFile)).toBe(
      "function twoSum(nums: number[], target: number): number[] {\n  throw new Error('not implemented');\n}",
    )
  })

  it('rebuilds the full file from the saved snippet', () => {
    const rebuilt = applyEditableSnippet(
      problemFile,
      `function twoSum(nums: number[], target: number): number[] {\n  return [0, 1];\n}`,
    )

    expect(rebuilt).toContain('return [0, 1];')
    expect(rebuilt).toContain("// Tests\ntest('finds pair'")
    expect(rebuilt.startsWith('// =============================================================================')).toBe(true)
  })

  it('migrates legacy full-file storage into a snippet', () => {
    expect(parseStoredSnippet(problemFile)).toEqual({
      snippet:
        "function twoSum(nums: number[], target: number): number[] {\n  throw new Error('not implemented');\n}",
      updatedAt: new Date(0).toISOString(),
    })
  })

  it('wraps prelude ListNode helpers and excludes them from the saved snippet', () => {
    const normalized = normalizeDsaEditorContent(linkedListProblemFile)

    expect(normalized).toContain(
      `// ─── Helpers ──────────────────────────────────────────────────────────────────\n\nclass ListNode`,
    )
    expect(normalized).toContain(
      `}\n\n// ─── End Helpers ──────────────────────────────────────────────────────────────\n\nfunction countNodes`,
    )
    expect(extractEditableSnippet(normalized)).toBe(
      "function countNodes(head: ListNode | null): number {\n  throw new Error('not implemented');\n}",
    )
    expect(parseStoredSnippet(linkedListProblemFile)).toEqual({
      snippet:
        "function countNodes(head: ListNode | null): number {\n  throw new Error('not implemented');\n}",
      updatedAt: new Date(0).toISOString(),
    })
  })
})
