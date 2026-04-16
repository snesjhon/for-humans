// Goal: Keep the copied street and ledger from step 1, then reset the original
//       and copied walkers so pass two can traverse both streets in lockstep.

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
    currentOld = currentOld.next;
    currentCopy = currentCopy.next;
  }

  return dummy.next;
}

runCase('empty street copies to empty street', [], []);
runCase('single house with no private note', [[7, null]], [[7, null]]);
runCase('three-house street with only next pointers', [[1, null], [2, null], [3, null]], [[1, null], [2, null], [3, null]]);

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
}
