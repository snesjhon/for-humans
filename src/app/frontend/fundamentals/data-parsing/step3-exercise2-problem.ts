export {};
// CI Requirements Gate, Level 3: Filter + Aggregate
// Required checks form the requirements manifest.
// Each feature flag is a job that claims to satisfy some checks.
// Before adding a flag's weight to the tally, the runner confirms that
// at least one of its check claims appears on the requirements index.

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

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const requiredChecks: RequiredCheck[] = [
  { id: 'chk-1', description: 'Dark mode toggle is persisted across sessions' },
  { id: 'chk-2', description: 'Flag is disabled by default in production' },
  { id: 'chk-3', description: 'Gradual rollout percentage is configurable' },
  { id: 'chk-4', description: 'Override is available per user ID' },
];

const featureFlags: FeatureFlag[] = [
  { id: 'flag-a', weight: 5, checks: ['chk-1', 'chk-2'] },
  { id: 'flag-b', weight: 3, checks: ['exp-1'] },          // irrelevant, not a required check
  { id: 'flag-c', weight: 2, checks: ['chk-3', 'chk-4'] },
];

const result = scoreFlagCompleteness(featureFlags, requiredChecks);
assert(result.totalWeight === 7, 'totalWeight is 7 (flag-a 5 + flag-c 2)');
assert(result.completeness === 100, 'completeness is 100% (all 4 checks covered)');
// ---End Tests
