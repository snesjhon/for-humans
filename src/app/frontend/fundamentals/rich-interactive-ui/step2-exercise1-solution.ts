export {};

// Wall Blueprint, Level 2: choose Grid or Flexbox by the layout question

type LayoutQuestion =
  | 'app-shell'
  | 'device-card-grid'
  | 'card-header-row'
  | 'filter-toolbar-row';

type Primitive = 'grid' | 'flex';

function choosePrimitive(question: LayoutQuestion): Primitive {
  switch (question) {
    case 'app-shell':
    case 'device-card-grid':
      return 'grid';
    case 'card-header-row':
    case 'filter-toolbar-row':
      return 'flex';
  }
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

assert(choosePrimitive('app-shell') === 'grid', 'app shell uses grid');
assert(choosePrimitive('device-card-grid') === 'grid', 'device card wall uses grid');
assert(choosePrimitive('card-header-row') === 'flex', 'card header row uses flex');
assert(choosePrimitive('filter-toolbar-row') === 'flex', 'filter toolbar row uses flex');
// ---End Tests
