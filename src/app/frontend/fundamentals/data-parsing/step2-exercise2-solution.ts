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

function resolveAuditLogs(auditLogs: AuditLog[], users: User[]): ResolvedLog[] {
  // Step 1: index the user roster by ID (build the manifest)
  const userNameById = new Map(users.map((u) => [u.id, u.name]));

  // Step 2: walk logs and resolve each userId to a name
  return auditLogs.map((log) => ({
    id: log.id,
    userName: userNameById.get(log.userId) ?? 'Unknown',
    action: log.action,
    timestamp: log.timestamp,
  }));
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
