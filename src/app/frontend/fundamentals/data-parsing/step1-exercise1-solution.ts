export {};
// CI Requirements Gate, Level 1: Flat Lookup
// A pipeline run produces one job result per employee.
// Walk the job manifest once and tally results by department.

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

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const employees: Employee[] = [
  { id: 'e1', name: 'Alice', department: 'Engineering' },
  { id: 'e2', name: 'Bob',   department: 'Design' },
  { id: 'e3', name: 'Carol', department: 'Engineering' },
  { id: 'e4', name: 'Dave',  department: 'Design' },
  { id: 'e5', name: 'Eve',   department: 'Product' },
];

const result = countByDepartment(employees);
assert(result.get('Engineering') === 2, 'Engineering has 2 employees');
assert(result.get('Design') === 2, 'Design has 2 employees');
assert(result.get('Product') === 1, 'Product has 1 employee');
assert(result.size === 3, 'Map has exactly 3 departments');
// ---End Tests
