// Goal: Extend the return type to include coverage -- the percentage of required categories touched by any relevant package.

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
): { totalCost: number; coverage: number } {
  const requiredIds = new Set(plan.requiredCategories.map(c => c.id));

  let totalCost = 0;
  const coveredIds = new Set<string>();

  for (const pkg of packages) {
    const relevantIds = pkg.categoryIds.filter(id => requiredIds.has(id));
    if (relevantIds.length === 0) continue;

    totalCost += pkg.productionCost;
    for (const id of relevantIds) {
      coveredIds.add(id);
    }
  }

  const coverage = (coveredIds.size / plan.requiredCategories.length) * 100;
  return { totalCost, coverage };
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

test('totalCost is the sum of relevant package costs', () => {
  const result = scoreEditionReadiness(plan, packages);
  expect(result.totalCost).toBe(7);
});

test('coverage is the percentage of required categories touched', () => {
  const result = scoreEditionReadiness(plan, packages);
  expect(result.coverage).toBe(75);
});

test('a category covered by two packages is not double-counted', () => {
  const overlap: ContentPackage[] = [
    { id: 'pkg-a', productionCost: 2, categoryIds: ['cat-tech'] },
    { id: 'pkg-b', productionCost: 3, categoryIds: ['cat-tech', 'cat-science'] },
  ];
  const result = scoreEditionReadiness(plan, overlap);
  expect(result.coverage).toBe(50);
});

test('returns 0% coverage when no packages match the plan', () => {
  const noMatch: ContentPackage[] = [
    { id: 'pkg-sports', productionCost: 2, categoryIds: ['cat-sports'] },
  ];
  const result = scoreEditionReadiness(plan, noMatch);
  expect(result.coverage).toBe(0);
  expect(result.totalCost).toBe(0);
});
// ---End Tests
