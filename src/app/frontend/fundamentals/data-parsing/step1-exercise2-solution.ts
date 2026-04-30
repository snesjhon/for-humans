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

function groupByCategory(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    if (!groups.has(product.category)) {
      groups.set(product.category, []);
    }
    groups.get(product.category)!.push(product);
  }
  return groups;
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
