export {};
// CI Requirements Gate, Level 1: Flat Lookup
// A pipeline run produces one job result per employee.
// Walk the job manifest once and tally results by department.

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
