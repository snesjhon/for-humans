export {};
// CI Requirements Gate, Level 2: Cross-Reference
// Audit logs arrive with only a userId stamped on each entry.
// Index the user roster first, then resolve each log entry
// by looking up the user name in O(1).

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: number;
}

interface User {
  id: string;
  name: string;
}

interface ResolvedLog {
  id: string;
  userName: string;
  action: string;
  timestamp: number;
}

// TODO: Return a ResolvedLog[] where each entry has the user's name resolved from
// the users array. If a userId has no matching user, use 'Unknown' as the name.
// Step 1: build a Map<userId, userName> from users.
// Step 2: walk auditLogs and produce a ResolvedLog for each entry.
function resolveAuditLogs(auditLogs: AuditLog[], users: User[]): ResolvedLog[] {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const users: User[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
];

const auditLogs: AuditLog[] = [
  { id: 'a1', userId: 'u1', action: 'login',         timestamp: 1000 },
  { id: 'a2', userId: 'u2', action: 'update_record', timestamp: 2000 },
  { id: 'a3', userId: 'u9', action: 'delete_record', timestamp: 3000 }, // unknown user
];

const result = resolveAuditLogs(auditLogs, users);
assert(result.length === 3, 'result has 3 entries');
assert(result[0].id === 'a1' && result[0].userName === 'Alice', 'a1 resolves to Alice');
assert(result[1].id === 'a2' && result[1].userName === 'Bob', 'a2 resolves to Bob');
assert(result[2].id === 'a3' && result[2].userName === 'Unknown', 'a3 resolves to Unknown');
assert(result[0].action === 'login' && result[0].timestamp === 1000, 'a1 action and timestamp are preserved');
// ---End Tests
