export {};
// Customs Checkpoint — Level 1: Flat Lookup
// The customs manifest is built from a single passenger list.
// Your job: scan each passenger once and tally by department.

interface Employee {
  id: string;
  name: string;
  department: string;
}

function countByDepartment(employees: Employee[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const employee of employees) {
    counts.set(employee.department, (counts.get(employee.department) ?? 0) + 1);
  }
  return counts;
}

/*
Sample data:

const employees: Employee[] = [
  { id: 'e1', name: 'Alice', department: 'Engineering' },
  { id: 'e2', name: 'Bob',   department: 'Design' },
  { id: 'e3', name: 'Carol', department: 'Engineering' },
  { id: 'e4', name: 'Dave',  department: 'Design' },
  { id: 'e5', name: 'Eve',   department: 'Product' },
];

Expected: Map { 'Engineering' => 2, 'Design' => 2, 'Product' => 1 }
*/
