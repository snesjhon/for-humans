export {};
// CI Requirements Gate, Level 1: Flat Lookup
// The manifest now tracks the single highest-priority result per stage.
// When two job results share the same pipeline stage, the runner keeps
// only the highest-priced one on file.

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

// TODO: Return a Map<category, Product> where the value is the highest-priced product
// in that category. If two products share the same price, keep the first one encountered.
// Use a single pass. Do not sort or filter outside the loop.
function topProductByCategory(products: Product[]): Map<string, Product> {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const products: Product[] = [
  { id: 'p1', name: 'Laptop',      category: 'Electronics', price: 999 },
  { id: 'p2', name: 'Desk',        category: 'Furniture',   price: 450 },
  { id: 'p3', name: 'Phone',       category: 'Electronics', price: 699 },
  { id: 'p4', name: 'Chair',       category: 'Furniture',   price: 299 },
  { id: 'p5', name: 'Workstation', category: 'Electronics', price: 1299 },
];

const result = topProductByCategory(products);
assert(result.size === 2, 'Map has 2 categories');
assert(result.get('Electronics')?.id === 'p5', 'Electronics top product is Workstation');
assert(result.get('Electronics')?.price === 1299, 'Workstation price is 1299');
assert(result.get('Furniture')?.id === 'p2', 'Furniture top product is Desk');
assert(result.get('Furniture')?.price === 450, 'Desk price is 450');
// ---End Tests
