export {};
// Customs Checkpoint — Level 1: Flat Lookup
// The manifest now accumulates full records, not just counts.
// Each product is a passenger that gets sorted into its cargo category.

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

// TODO: Return a Map<category, Product[]> where each product appears under its category.
// Build the Map in a single pass. Do not call .filter() or .reduce() on the full array
// once per category — that would re-scan the array for each group.
// Hint: if the key is not in the Map yet, initialise it to an empty array before pushing.
function groupByCategory(products: Product[]): Map<string, Product[]> {
  throw new Error('not implemented');
}

/*
Sample data:

const products: Product[] = [
  { id: 'p1', name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 'p2', name: 'Desk',   category: 'Furniture',   price: 450 },
  { id: 'p3', name: 'Phone',  category: 'Electronics', price: 699 },
  { id: 'p4', name: 'Chair',  category: 'Furniture',   price: 299 },
];

Expected:
  Map {
    'Electronics' => [ { id: 'p1', name: 'Laptop', ... }, { id: 'p3', name: 'Phone', ... } ],
    'Furniture'   => [ { id: 'p2', name: 'Desk', ... },   { id: 'p4', name: 'Chair', ... } ],
  }
*/
