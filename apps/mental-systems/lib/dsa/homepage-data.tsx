import { VisualAssemblyLine } from '@/components/homepage/VisualAssemblyLine';
import { VisualCardCatalog } from '@/components/homepage/VisualCardCatalog';
import { VisualFileSystem } from '@/components/homepage/VisualFileSystem';
import { VisualCityMap } from '@/components/homepage/VisualCityMap';
import { VisualERTriage } from '@/components/homepage/VisualERTriage';
import { VisualStampAlbum } from '@/components/homepage/VisualStampAlbum';
import { VisualTwoInspectors } from '@/components/homepage/VisualTwoInspectors';
import { VisualTwoMessengers } from '@/components/homepage/VisualTwoMessengers';
import { VisualOdometer } from '@/components/homepage/VisualOdometer';
import { VisualMountainClimber } from '@/components/homepage/VisualMountainClimber';
import { VisualParkRanger } from '@/components/homepage/VisualParkRanger';

export const HOW_IT_WORKS = [
  {
    step: '01',
    heading: 'Read the mental model',
    body: 'Each section opens with a guide built around a real-world analogy — the why, not just the how.',
    color: 'var(--purple)',
  },
  {
    step: '02',
    heading: 'Apply it immediately',
    body: "A focused set of problems locks in what you just read while it's still fresh. Doing before forgetting.",
    color: 'var(--blue)',
  },
  {
    step: '03',
    heading: 'Revisit as you advance',
    body: "Harder problems from previous models resurface in later steps — exactly when you're ready for them.",
    color: 'var(--green)',
  },
];

export const FUNDAMENTALS_DATA = [
  {
    slug: 'arrays-strings',
    name: 'Arrays & Strings',
    analogy: 'The Assembly Line',
    excerpt:
      'A conveyor belt with a reader and writer. The reader inspects everything; the writer only places keepers. One pass, no extra space.',
    tags: ['Two Pointers', 'Write Cursor', 'Prefix Pass'],
    accent: 'var(--blue)',
    Visual: VisualAssemblyLine,
  },
  {
    slug: 'hash-maps',
    name: 'Hash Maps & Sets',
    analogy: 'The Library Card Catalog',
    excerpt:
      'Any book found in one step, no matter how large the library. Membership, lookup, counting — all O(1).',
    tags: ['HashMap', 'HashSet', 'O(1) lookup'],
    accent: 'var(--orange)',
    Visual: VisualCardCatalog,
  },
  {
    slug: 'binary-trees',
    name: 'Binary Trees',
    analogy: 'File System Navigation',
    excerpt:
      'Folders nested inside folders. DFS follows one path to its end; BFS visits every folder at each depth before going deeper.',
    tags: ['DFS', 'BFS', 'Recursion'],
    accent: 'var(--purple)',
    Visual: VisualFileSystem,
  },
  {
    slug: 'graphs',
    name: 'Graphs',
    analogy: 'The City Road Map',
    excerpt:
      'Cities connected by roads. Unlike trees, graphs can cycle — so you mark every city you visit to avoid looping forever.',
    tags: ['Adjacency List', 'Visited Set', 'BFS / DFS'],
    accent: 'var(--blue)',
    Visual: VisualCityMap,
  },
  {
    slug: 'heaps-priority-queues',
    name: 'Heaps',
    analogy: 'ER Triage',
    excerpt:
      'The most critical patient is always seen first — not by arrival order, but by severity. The heap always surfaces the min (or max) in O(1).',
    tags: ['Priority Queue', 'O(log n)', 'Min / Max'],
    accent: '#d94f4f',
    Visual: VisualERTriage,
  },
];

export const MENTAL_MODELS_DATA = [
  {
    id: '217',
    name: 'Contains Duplicate',
    difficulty: 'Easy',
    diffColor: '#52b87a',
    analogy: "The Stamp Collector's Album",
    excerpt:
      'A collector checks their album before mounting each stamp. The instant a design appears twice — stop. No need to finish the pile.',
    tags: ['Hash Set', 'O(n) time'],
    accent: 'var(--purple)',
    Visual: VisualStampAlbum,
  },
  {
    id: '125',
    name: 'Valid Palindrome',
    difficulty: 'Easy',
    diffColor: '#52b87a',
    analogy: 'The Two Museum Inspectors',
    excerpt:
      'Two inspectors walk from opposite ends, skipping empty pedestals, comparing exhibits. Always agree — mirror layout confirmed.',
    tags: ['Two Pointers', 'O(1) space'],
    accent: 'var(--blue)',
    Visual: VisualTwoInspectors,
  },
  {
    id: '238',
    name: 'Product Except Self',
    difficulty: 'Medium',
    diffColor: 'var(--orange)',
    analogy: 'The Two Messengers',
    excerpt:
      'Two messengers walk opposite directions through a row of villages, writing their tally before absorbing each harvest. No village sees its own.',
    tags: ['Prefix / Suffix', 'O(n) time'],
    accent: 'var(--orange)',
    Visual: VisualTwoMessengers,
  },
  {
    id: '560',
    name: 'Subarray Sum = K',
    difficulty: 'Medium',
    diffColor: 'var(--orange)',
    analogy: 'The Checkpoint Journey',
    excerpt:
      'Record your odometer at every city. The distance between two checkpoints is just subtraction. A logbook of past readings makes any target instant to find.',
    tags: ['Prefix Sums', 'HashMap'],
    accent: 'var(--orange)',
    Visual: VisualOdometer,
  },
  {
    id: '022',
    name: 'Generate Parentheses',
    difficulty: 'Medium',
    diffColor: 'var(--orange)',
    analogy: 'The Mountain Climber',
    excerpt:
      "Every ( is a step up, every ) a step down. You can only descend if you've climbed. Every valid route ends back at ground level.",
    tags: ['Backtracking', 'Recursion'],
    accent: '#52b87a',
    Visual: VisualMountainClimber,
  },
  {
    id: '200',
    name: 'Number of Islands',
    difficulty: 'Medium',
    diffColor: 'var(--orange)',
    analogy: 'The Park Ranger Survey',
    excerpt:
      'Spot uncharted land, radio a survey team. They fan out and plant flags on every connected tile. One call claims the whole island.',
    tags: ['DFS / BFS', 'Graph'],
    accent: 'var(--blue)',
    Visual: VisualParkRanger,
  },
];
