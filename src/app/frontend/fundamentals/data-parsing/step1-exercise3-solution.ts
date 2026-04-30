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

function topProductByCategory(products: Product[]): Map<string, Product> {
  const top = new Map<string, Product>();
  for (const product of products) {
    const current = top.get(product.category);
    if (current === undefined || product.price > current.price) {
      top.set(product.category, product);
    }
  }
  return top;
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
