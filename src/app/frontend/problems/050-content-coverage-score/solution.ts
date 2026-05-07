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
