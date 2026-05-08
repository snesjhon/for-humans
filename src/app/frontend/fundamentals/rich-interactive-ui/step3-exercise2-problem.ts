export {};

// Status Lamps, Level 3: write the responsive dashboard layout rules

interface DashboardLayout {
  shellColumns: string;
  cardColumns: string;
}

// TODO:
// - shellColumns should be '18rem minmax(0, 1fr)'
// - cardColumns should be `repeat(auto-fill, minmax(${minCardWidthRem}rem, 1fr))`
function buildDashboardLayout(minCardWidthRem: number): DashboardLayout {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const layout = buildDashboardLayout(16);
assert(layout.shellColumns === '18rem minmax(0, 1fr)', 'shell keeps a fixed sidebar and fluid main area');
assert(
  layout.cardColumns === 'repeat(auto-fill, minmax(16rem, 1fr))',
  'card grid uses auto-fill with a 16rem minimum',
);
// ---End Tests
