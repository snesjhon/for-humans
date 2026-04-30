export {};
// Customs Checkpoint — Level 1: Flat Lookup
// The customs manifest is built from a single passenger list.
// Your job: scan each passenger once and tally by department.

interface Employee {
  id: string;
  name: string;
  department: string;
}

// TODO: Build a Map where key = department, value = count of employees in that department.
// Use a single pass. Do not call .filter() inside the loop.
// Hint: map.get(dept) ?? 0 retrieves the current count safely before incrementing.
function countByDepartment(employees: Employee[]): Map<string, number> {
  throw new Error('not implemented');
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
