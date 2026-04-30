export {};
// Customs Checkpoint — Level 3: Filter + Aggregate
// Required checks form the official clearance manifest.
// Each feature flag is a passenger that claims to satisfy some checks.
// Before adding a flag's weight to the tally, the officer confirms that
// at least one of its check claims actually appears on the manifest.

interface RequiredCheck {
  id: string;
  description: string;
}

interface FeatureFlag {
  id: string;
  weight: number;
  checks: string[]; // IDs of RequiredCheck items this flag satisfies
}

interface FlagResult {
  totalWeight: number;
  completeness: number; // percentage 0-100
}

function scoreFlagCompleteness(
  featureFlags: FeatureFlag[],
  requiredChecks: RequiredCheck[],
): FlagResult {
  // Step 1: build the manifest — Set of required check IDs
  const requiredCheckIds = new Set(requiredChecks.map((c) => c.id));

  let totalWeight = 0;
  const coveredCheckIds = new Set<string>();

  // Step 2 + 3: walk flags, filter by intersection, then accumulate
  for (const flag of featureFlags) {
    const relevantChecks = flag.checks.filter((checkId) => requiredCheckIds.has(checkId));
    if (relevantChecks.length === 0) continue; // not relevant — skip before accumulating

    totalWeight += flag.weight;
    for (const checkId of relevantChecks) {
      coveredCheckIds.add(checkId);
    }
  }

  // Step 4: compute completeness as a percentage
  const completeness = (coveredCheckIds.size / requiredChecks.length) * 100;

  return { totalWeight, completeness };
}

/*
Sample data:

const requiredChecks: RequiredCheck[] = [
  { id: 'chk-1', description: 'Dark mode toggle is persisted across sessions' },
  { id: 'chk-2', description: 'Flag is disabled by default in production' },
  { id: 'chk-3', description: 'Gradual rollout percentage is configurable' },
  { id: 'chk-4', description: 'Override is available per user ID' },
];

const featureFlags: FeatureFlag[] = [
  { id: 'flag-a', weight: 5, checks: ['chk-1', 'chk-2'] },
  { id: 'flag-b', weight: 3, checks: ['exp-1'] },          // irrelevant — no required check
  { id: 'flag-c', weight: 2, checks: ['chk-3', 'chk-4'] },
];

Expected: { totalWeight: 7, completeness: 100 }
  flag-a: relevant (chk-1, chk-2 are required), weight 5, covers chk-1 + chk-2
  flag-b: irrelevant (exp-1 not in required checks), skipped
  flag-c: relevant (chk-3, chk-4 are required), weight 2, covers chk-3 + chk-4
  totalWeight = 5 + 2 = 7
  coveredChecks = { chk-1, chk-2, chk-3, chk-4 } = 4 of 4
  completeness = (4 / 4) * 100 = 100
*/
