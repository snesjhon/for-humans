// Exercise 2: Readonly Fields and Factory Functions
// Add readonly id and createdAt to Device, then write a factory function.

// TODO: Define the Device interface with:
//   readonly id: string
//   name: string
//   isOnline: boolean
//   createdAt: string

// TODO: Write createDevice(id: string, name: string): Device
//   Returns a new Device with isOnline set to false and createdAt set to '2024-01-01'.

// After implementing, uncomment the line below to confirm the compile error:
// const d = createDevice('dev-001', 'Reactor A');
// d.id = 'dev-002'; // should be a TypeScript error

export {};
