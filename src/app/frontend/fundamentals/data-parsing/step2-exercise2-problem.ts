export {};
// Customs Checkpoint — Level 2: Cross-Reference
// Audit logs arrive with only a userId stamped on each entry.
// The officer indexes the user roster first, then resolves each log entry
// by looking up the passenger name in O(1).

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

/*
Sample data:

const users: User[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
];

const auditLogs: AuditLog[] = [
  { id: 'a1', userId: 'u1', action: 'login',        timestamp: 1000 },
  { id: 'a2', userId: 'u2', action: 'update_record', timestamp: 2000 },
  { id: 'a3', userId: 'u9', action: 'delete_record', timestamp: 3000 }, // unknown user
];

Expected:
  [
    { id: 'a1', userName: 'Alice',   action: 'login',         timestamp: 1000 },
    { id: 'a2', userName: 'Bob',     action: 'update_record', timestamp: 2000 },
    { id: 'a3', userName: 'Unknown', action: 'delete_record', timestamp: 3000 },
  ]
*/
