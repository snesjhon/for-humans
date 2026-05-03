type User = {
  id: number;
  name: string;
};

type FetchUser = (id: number) => Promise<User>;

function readUserWithCallback(
  id: number,
  onComplete: (user: User) => void,
): void {
  setTimeout(() => {
    onComplete({ id, name: `User ${id}` });
  }, 20);
}

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 20);
  });
}

// Settle from the callback that finishes the work, not from setup time.
export function loadUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    readUserWithCallback(id, (user) => {
      resolve(user);
    });
  });
}

// Return the nested promise so the outer chain adopts it.
export function loadUppercaseName(id: number): Promise<string> {
  return Promise.resolve(id).then((userId) => {
    return fetchUser(userId).then((user) => user.name.toUpperCase());
  });
}

// Return the recovery branch so the chain switches to the retry.
export function loadUppercaseNameWithRetry(
  id: number,
  fetchUserImpl: FetchUser,
): Promise<string> {
  return fetchUserImpl(id)
    .then((user) => user.name.toUpperCase())
    .catch(() => {
      return fetchUserImpl(id).then((user) => user.name.toUpperCase());
    });
}
