interface Device {
  readonly id: string;
  name: string;
  isOnline: boolean;
  createdAt: string;
}

function createDevice(id: string, name: string): Device {
  return { id, name, isOnline: false, createdAt: '2024-01-01' };
}

const device = createDevice('dev-001', 'Reactor A');
console.log(device.id);       // PASS: 'dev-001'
console.log(device.name);     // PASS: 'Reactor A'
console.log(device.isOnline); // PASS: false
console.log(device.createdAt); // PASS: '2024-01-01'

// device.id = 'dev-002'; // PASS: compile error — Cannot assign to 'id' because it is a read-only property.

export {};
