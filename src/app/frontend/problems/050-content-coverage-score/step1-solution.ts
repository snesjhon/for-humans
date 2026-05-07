// Goal: Return the total production cost for content packages that cover at least one required category.

interface Category {
  id: string;
  label: string;
}

interface PublicationPlan {
  name: string;
  requiredCategories: Category[];
}

interface ContentPackage {
  id: string;
  productionCost: number;
  categoryIds: string[];
}

export function scoreEditionReadiness(
  plan: PublicationPlan,
  packages: ContentPackage[],
): { totalCost: number } {
  const requiredIds = new Set(plan.requiredCategories.map(c => c.id));

  let totalCost = 0;

  for (const pkg of packages) {
    const relevantIds = pkg.categoryIds.filter(id => requiredIds.has(id));
    if (relevantIds.length === 0) continue;
    totalCost += pkg.productionCost;
  }

  return { totalCost };
}

// ---Tests
const plan: PublicationPlan = {
  name: 'May Edition',
  requiredCategories: [
    { id: 'cat-tech', label: 'Technology' },
    { id: 'cat-culture', label: 'Arts & Culture' },
    { id: 'cat-science', label: 'Science' },
    { id: 'cat-opinion', label: 'Opinion' },
  ],
};

const packages: ContentPackage[] = [
  { id: 'pkg-stem', productionCost: 4, categoryIds: ['cat-tech', 'cat-science'] },
  { id: 'pkg-arts', productionCost: 3, categoryIds: ['cat-culture'] },
  { id: 'pkg-sports', productionCost: 2, categoryIds: ['cat-sports'] },
];

test('counts only packages with at least one required category', () => {
  const result = scoreEditionReadiness(plan, packages);
  expect(result.totalCost).toBe(7);
});

test('excludes packages whose categories are not in the plan', () => {
  const noOverlap: ContentPackage[] = [
    { id: 'pkg-sports', productionCost: 5, categoryIds: ['cat-sports'] },
  ];
  const result = scoreEditionReadiness(plan, noOverlap);
  expect(result.totalCost).toBe(0);
});

test('counts a package only once even when it covers multiple required categories', () => {
  const multiMatch: ContentPackage[] = [
    { id: 'pkg-stem', productionCost: 4, categoryIds: ['cat-tech', 'cat-science'] },
  ];
  const result = scoreEditionReadiness(plan, multiMatch);
  expect(result.totalCost).toBe(4);
});
// ---End Tests
