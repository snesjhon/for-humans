export {};
// CI Requirements Gate, Level 2: Cross-Reference
// Two manifests arrive at the runner: an order list and a product catalog.
// Index the product catalog once, then walk the order list,
// resolving each product in O(1) to compute revenue.

interface Order {
  id: string;
  productId: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

// TODO: Return a Map<productName, totalRevenue>.
// Step 1: index products by id into a Map so each lookup is O(1).
// Step 2: walk orders, look up the product, and accumulate quantity * price.
// If an order references a productId not found in the catalog, skip it.
function computeRevenue(orders: Order[], products: Product[]): Map<string, number> {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const orders: Order[] = [
  { id: 'o1', productId: 'p1', quantity: 2 },
  { id: 'o2', productId: 'p2', quantity: 1 },
  { id: 'o3', productId: 'p1', quantity: 3 },
  { id: 'o4', productId: 'p99', quantity: 5 }, // unknown product, skipped
];

const products: Product[] = [
  { id: 'p1', name: 'Widget', price: 10 },
  { id: 'p2', name: 'Gadget', price: 25 },
];

const result = computeRevenue(orders, products);
assert(result.get('Widget') === 50, 'Widget revenue is 50 (2+3 * 10)');
assert(result.get('Gadget') === 25, 'Gadget revenue is 25 (1 * 25)');
assert(result.size === 2, 'Map has 2 products');
assert(result.get('p99') === undefined, 'unknown product does not appear in result');
// ---End Tests
