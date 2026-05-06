export {};
// Runtime Ledger, Level 1: Shared Identity
// Return a new user object with an updated name, without mutating the input object.

interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor';
}

function renameUser(user: User, nextName: string): User {
  return { ...user, name: nextName };
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const originalUser: User = { id: 'u1', name: 'Ava', role: 'admin' };
const renamed = renameUser(originalUser, 'Mina');

assert(renamed.name === 'Mina', 'returned object uses the new name');
assert(renamed.role === 'admin', 'other fields stay the same');
assert(originalUser.name === 'Ava', 'original object stays unchanged');
assert(renamed !== originalUser, 'returned user is a new object reference');
// ---End Tests
