export {};
// CI Requirements Gate, Level 1: Flat Lookup
// The manifest now groups full records, not just counts.
// Each product is a job result that gets routed into its pipeline stage.

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

// TODO: Return a Map<category, Product[]> where each product appears under its category.
// Build the Map in a single pass. Do not call .filter() or .reduce() on the full array
// once per category; that re-scans the full array for each group.
// Hint: if the key is not in the Map yet, initialise it to an empty array before pushing.
function groupByCategory(products: Product[]): Map<string, Product[]> {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const products: Product[] = [
  { id: 'p1', name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 'p2', name: 'Desk',   category: 'Furniture',   price: 450 },
  { id: 'p3', name: 'Phone',  category: 'Electronics', price: 699 },
  { id: 'p4', name: 'Chair',  category: 'Furniture',   price: 299 },
];

const result = groupByCategory(products);
assert(result.size === 2, 'Map has 2 categories');
assert(result.get('Electronics')?.length === 2, 'Electronics has 2 products');
assert(result.get('Furniture')?.length === 2, 'Furniture has 2 products');
assert(result.get('Electronics')?.[0].id === 'p1', 'Electronics first product is Laptop');
assert(result.get('Electronics')?.[1].id === 'p3', 'Electronics second product is Phone');
assert(result.get('Furniture')?.[0].id === 'p2', 'Furniture first product is Desk');
assert(result.get('Furniture')?.[1].id === 'p4', 'Furniture second product is Chair');
// ---End Tests
