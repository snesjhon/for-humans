export {};
// Customs Checkpoint — Level 3: Filter + Aggregate
// Multiple frameworks each define their own set of requirements.
// One set of implemented controls is assessed against every framework independently.
// The officer runs a separate checkpoint for each framework manifest
// and records the tally in a Map keyed by framework name.

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

interface FrameworkResult {
  totalCost: number;
  coverage: number; // percentage 0-100
}

function multiFrameworkReport(
  frameworks: Framework[],
  implementedControls: Control[],
): Map<string, FrameworkResult> {
  const report = new Map<string, FrameworkResult>();

  for (const framework of frameworks) {
    // Step 1: build the manifest for this framework
    const frameworkReqIds = new Set(framework.requirements.map((r) => r.id));

    let totalCost = 0;
    const coveredReqIds = new Set<string>();

    // Step 2 + 3: walk controls, filter by intersection, accumulate
    for (const control of implementedControls) {
      const relevantReqs = control.requirements.filter((reqId) => frameworkReqIds.has(reqId));
      if (relevantReqs.length === 0) continue;

      totalCost += control.cost;
      for (const reqId of relevantReqs) {
        coveredReqIds.add(reqId);
      }
    }

    // Step 4: compute coverage for this framework
    const coverage = (coveredReqIds.size / framework.requirements.length) * 100;
    report.set(framework.name, { totalCost, coverage });
  }

  return report;
}

/*
Sample data:

const frameworks: Framework[] = [
  {
    name: 'PCI-DSS',
    requirements: [
      { id: 'pci-1', description: 'CVV numbers are not stored' },
      { id: 'pci-2', description: 'CC numbers are salted and hashed' },
    ],
  },
  {
    name: 'SOC 2',
    requirements: [
      { id: 'soc-1', description: 'Access logs are retained for 12 months' },
      { id: 'soc-2', description: 'Encryption at rest is enforced' },
      { id: 'soc-3', description: 'Incident response plan is documented' },
    ],
  },
];

const implementedControls: Control[] = [
  { id: 'ctrl-1', cost: 4, requirements: ['pci-1', 'pci-2'] },
  { id: 'ctrl-2', cost: 2, requirements: ['soc-1', 'soc-2'] },
  { id: 'ctrl-3', cost: 1, requirements: ['nist-1'] }, // irrelevant to both frameworks
];

Expected:
  Map {
    'PCI-DSS' => { totalCost: 4, coverage: 100 },
    'SOC 2'   => { totalCost: 2, coverage: 66.66... },
  }
  PCI-DSS: ctrl-1 covers pci-1 + pci-2 (both reqs), cost 4. coverage = 2/2 * 100 = 100.
  SOC 2:   ctrl-2 covers soc-1 + soc-2 (2 of 3 reqs), cost 2. coverage = 2/3 * 100 = 66.67.
           ctrl-3 irrelevant. ctrl-1 has no soc-* reqs, also irrelevant.
*/
