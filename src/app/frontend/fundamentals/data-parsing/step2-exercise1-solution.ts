export {};
// Customs Checkpoint — Level 2: Cross-Reference
// Two manifests arrive at the checkpoint: an order list and a product catalog.
// The officer indexes the product catalog once, then walks the order list,
// looking up each product in O(1) to compute revenue.

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

function computeRevenue(orders: Order[], products: Product[]): Map<string, number> {
  // Step 1: index the manifest (product catalog) by ID
  const productById = new Map(products.map((p) => [p.id, p]));

  // Step 2: walk orders and accumulate revenue per product name
  const revenue = new Map<string, number>();
  for (const order of orders) {
    const product = productById.get(order.productId);
    if (!product) continue;
    revenue.set(product.name, (revenue.get(product.name) ?? 0) + order.quantity * product.price);
  }
  return revenue;
}

/*
Sample data:

const orders: Order[] = [
  { id: 'o1', productId: 'p1', quantity: 2 },
  { id: 'o2', productId: 'p2', quantity: 1 },
  { id: 'o3', productId: 'p1', quantity: 3 },
];

const products: Product[] = [
  { id: 'p1', name: 'Widget', price: 10 },
  { id: 'p2', name: 'Gadget', price: 25 },
];

Expected: Map { 'Widget' => 50, 'Gadget' => 25 }
  Widget: (2 + 3) * 10 = 50
  Gadget: 1 * 25 = 25
*/
