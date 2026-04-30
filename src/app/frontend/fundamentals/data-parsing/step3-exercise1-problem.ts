export {};
// Customs Checkpoint — Level 3: Filter + Aggregate
// The framework is the official clearance manifest: only declared requirement IDs matter.
// Each control is a passenger carrying a stack of compliance claims.
// Before tallying cost, the officer checks whether the passenger's claims
// intersect with the framework manifest. No intersection — no tally.

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

/*
Sample data:

const framework: Framework = {
  name: 'Payment Card Industry Data Security Standard',
  requirements: [
    { id: 'pci-1', description: 'CVV numbers are not stored' },
    { id: 'pci-2', description: 'CC numbers are salted and hashed' },
    { id: 'pci-3', description: 'Databases are only accessed by explicitly authorized users' },
    { id: 'pci-4', description: 'Messages containing card info are always encrypted' },
  ],
};

const myImplementedControls: Control[] = [
  { id: 'control-1', cost: 2, requirements: ['pci-1'] },
  { id: 'control-2', cost: 3, requirements: ['nist-1'] }, // irrelevant — not a PCI requirement
  { id: 'control-3', cost: 1, requirements: ['pci-2', 'pci-3'] },
];

Expected: { totalCost: 3, coverage: 75 }
  control-1: relevant (pci-1 is in framework), cost 2, covers pci-1
  control-2: irrelevant (nist-1 not in framework), skipped
  control-3: relevant (pci-2 and pci-3 are in framework), cost 1, covers pci-2 + pci-3
  totalCost = 2 + 1 = 3
  coveredReqs = { pci-1, pci-2, pci-3 } = 3 of 4 framework reqs
  coverage = (3 / 4) * 100 = 75
*/
