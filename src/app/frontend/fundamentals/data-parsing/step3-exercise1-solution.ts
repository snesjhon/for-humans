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

function assessComplianceCost(
  framework: Framework,
  implementedControls: Control[],
): ComplianceResult {
  // Step 1: build the manifest — Set of framework requirement IDs
  const frameworkReqIds = new Set(framework.requirements.map((r) => r.id));

  let totalCost = 0;
  const coveredReqIds = new Set<string>();

  // Step 2 + 3: walk controls, filter by intersection, then accumulate
  for (const control of implementedControls) {
    const relevantReqs = control.requirements.filter((reqId) => frameworkReqIds.has(reqId));
    if (relevantReqs.length === 0) continue; // not relevant — skip before accumulating

    totalCost += control.cost;
    for (const reqId of relevantReqs) {
      coveredReqIds.add(reqId);
    }
  }

  // Step 4: compute coverage as a percentage
  const coverage = (coveredReqIds.size / framework.requirements.length) * 100;

  return { totalCost, coverage };
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
