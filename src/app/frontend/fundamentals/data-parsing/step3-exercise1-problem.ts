export {};
// CI Requirements Gate, Level 3: Filter + Aggregate
// The framework defines the required checks: only those IDs matter.
// Each control is a job claiming to satisfy some requirements.
// Before tallying cost, the runner checks whether the job's claims
// intersect with the requirements index. No intersection, no tally.

interface Requirement {
  id: string;
  description: string;
}

interface Framework {
  name: string;
  requirements: Requirement[];
}

interface Control {
  id: string;
  cost: number;
  requirements: string[]; // requirement IDs this control covers
}

interface ComplianceResult {
  totalCost: number;
  coverage: number; // percentage 0-100
}

// TODO: Return { totalCost, coverage }.
// totalCost: sum of cost for controls that cover at least one framework requirement.
// coverage: percentage of framework requirement IDs covered by any relevant control.
//
// A control whose requirements share no IDs with the framework is irrelevant
// and must not contribute to totalCost.
//
// Step 1: build a Set of framework requirement IDs (the manifest).
// Step 2: walk controls. For each control, filter its requirements to those
//         present in the Set. If none match, skip the control entirely.
// Step 3: for relevant controls, add the control's cost and mark covered req IDs.
// Step 4: coverage = (coveredReqIds.size / framework.requirements.length) * 100.
function assessComplianceCost(
  framework: Framework,
  implementedControls: Control[],
): ComplianceResult {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const framework: Framework = {
  name: 'Payment Card Industry Data Security Standard',
  requirements: [
    { id: 'pci-1', description: 'CVV numbers are not stored' },
    { id: 'pci-2', description: 'CC numbers are salted and hashed' },
    { id: 'pci-3', description: 'Databases are only accessed by explicitly authorized users' },
    { id: 'pci-4', description: 'Messages containing card info are always encrypted' },
  ],
};

const implementedControls: Control[] = [
  { id: 'control-1', cost: 2, requirements: ['pci-1'] },
  { id: 'control-2', cost: 3, requirements: ['nist-1'] }, // irrelevant, not a PCI requirement
  { id: 'control-3', cost: 1, requirements: ['pci-2', 'pci-3'] },
];

const result = assessComplianceCost(framework, implementedControls);
assert(result.totalCost === 3, 'totalCost is 3 (control-1 cost 2 + control-3 cost 1)');
assert(result.coverage === 75, 'coverage is 75% (3 of 4 requirements covered)');
// ---End Tests
