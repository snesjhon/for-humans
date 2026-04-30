export {};
// Customs Checkpoint — Level 1: Flat Lookup
// The manifest now tracks the single highest-value item per category.
// When two passengers carry the same category of goods, the officer keeps
// only the most valuable declaration on file.

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

/*
Sample data:

const products: Product[] = [
  { id: 'p1', name: 'Laptop',    category: 'Electronics', price: 999 },
  { id: 'p2', name: 'Desk',      category: 'Furniture',   price: 450 },
  { id: 'p3', name: 'Phone',     category: 'Electronics', price: 699 },
  { id: 'p4', name: 'Chair',     category: 'Furniture',   price: 299 },
  { id: 'p5', name: 'Workstation', category: 'Electronics', price: 1299 },
];

Expected:
  Map {
    'Electronics' => { id: 'p5', name: 'Workstation', ... price: 1299 },
    'Furniture'   => { id: 'p2', name: 'Desk', ...         price: 450 },
  }
*/
