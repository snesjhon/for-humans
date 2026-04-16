// Goal: Keep both passes aligned, then translate each original random target
//       into its copied target by looking it up in the ledger.

// ---Helpers

class RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;

  constructor(val = 0, next: RandomListNode | null = null, random: RandomListNode | null = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

type RandomPair = [number, number | null];

// ---End Helpers

function copyRandomList(head: RandomListNode | null): RandomListNode | null {
  if (head === null) return null;

  const ledger = new Map<RandomListNode, RandomListNode>();
  const dummy = new RandomListNode(0);
  let copyTail = dummy;
  let currentOld: RandomListNode | null = head;

  while (currentOld !== null) {
    const copiedHouse = new RandomListNode(currentOld.val);
    ledger.set(currentOld, copiedHouse);
    copyTail.next = copiedHouse;
    copyTail = copiedHouse;
    currentOld = currentOld.next;
  }

  currentOld = head;
  let currentCopy = dummy.next;

  while (currentOld !== null && currentCopy !== null) {
    throw new Error('not implemented');
  }

  return dummy.next;
}

runCase('empty street copies to empty street', [], []);
runCase('single house with null private note', [[7, null]], [[7, null]]);
runCase('single house can point to itself', [[5, 0]], [[5, 0]]);
runCase('two houses both point to the second house', [[1, 1], [2, 1]], [[1, 1], [2, 1]]);
runCase('example street copies every private note', [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]], [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
runCase('same values still need distinct copied targets', [[3, null], [3, 0], [3, null]], [[3, null], [3, 0], [3, null]]);

// ---Helpers

function buildList(pairs: RandomPair[]): RandomListNode | null {
  if (pairs.length === 0) return null;

  const nodes = pairs.map(([val]) => new RandomListNode(val));

  for (let i = 0; i < nodes.length - 1; i += 1) {
    nodes[i].next = nodes[i + 1];
  }

  for (let i = 0; i < nodes.length; i += 1) {
    const [, randomIndex] = pairs[i];
    nodes[i].random = randomIndex === null ? null : nodes[randomIndex];
  }

  return nodes[0];
}

function inspectClone(original: RandomListNode | null, clone: RandomListNode | null): {
  pairs: RandomPair[];
  sharesOriginalNodes: boolean;
  randomEscapesClone: boolean;
} {
  const originalNodes = collectNodes(original);
  const cloneNodes = collectNodes(clone);

  const originalSet = new Set(originalNodes);
  const cloneSet = new Set(cloneNodes);
  const cloneIndex = new Map<RandomListNode, number>();

  cloneNodes.forEach((node, index) => {
    cloneIndex.set(node, index);
  });

  const pairs: RandomPair[] = cloneNodes.map((node) => [
    node.val,
    node.random === null ? null : cloneIndex.get(node.random) ?? null,
  ]);

  const sharesOriginalNodes = cloneNodes.some((node) => originalSet.has(node));
  const randomEscapesClone = cloneNodes.some(
    (node) => node.random !== null && !cloneSet.has(node.random),
  );

  return { pairs, sharesOriginalNodes, randomEscapesClone };
}

function collectNodes(head: RandomListNode | null): RandomListNode[] {
  const nodes: RandomListNode[] = [];
  let current = head;

  while (current !== null) {
    nodes.push(current);
    current = current.next;
  }

  return nodes;
}

function runCase(desc: string, input: RandomPair[], expectedPairs: RandomPair[]): void {
  try {
    const original = buildList(input);
    const clone = copyRandomList(original);
    const actual = inspectClone(original, clone);
    const expected = {
      pairs: expectedPairs,
      sharesOriginalNodes: false,
      randomEscapesClone: false,
    };
    const pass = JSON.stringify(actual) === JSON.stringify(expected);

    console.log(`${pass ? 'PASS' : 'FAIL'} ${desc}`);
    if (!pass) {
      console.log(`  expected: ${JSON.stringify(expected)}`);
      console.log(`  received: ${JSON.stringify(actual)}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'not implemented') {
      console.log(`TODO  ${desc}`);
    } else {
      throw error;
    }
  }
}
