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

// TODO: Return { totalWeight, completeness }.
// totalWeight: sum of weight for flags that satisfy at least one required check.
// completeness: percentage of required check IDs covered by any relevant flag.
//
// A flag whose checks share no IDs with requiredChecks contributes nothing.
//
// Step 1: build a Set of required check IDs (the manifest).
// Step 2: walk flags. For each flag, intersect its checks with the Set.
//         If the intersection is empty, skip the flag.
// Step 3: for relevant flags, add their weight and mark covered check IDs.
// Step 4: completeness = (coveredCheckIds.size / requiredChecks.length) * 100.
function scoreFlagCompleteness(
  featureFlags: FeatureFlag[],
  requiredChecks: RequiredCheck[],
): FlagResult {
  throw new Error('not implemented');
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
