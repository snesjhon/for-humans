interface Device {
  id: string;
  name: string;
  isOnline: boolean;
}

function formatDevice(device: Device): string {
  const status = device.isOnline ? 'online' : 'offline';
  return `${device.name} (${status})`;
}

const reactor: Device = { id: 'dev-001', name: 'Reactor A', isOnline: true };
console.log(formatDevice(reactor)); // PASS: "Reactor A (online)"

const conveyor: Device = { id: 'dev-002', name: 'Conveyor B', isOnline: false };
console.log(formatDevice(conveyor)); // PASS: "Conveyor B (offline)"

export {};
