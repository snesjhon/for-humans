type DeviceStatus = 'online' | 'offline' | 'maintenance';

interface Device {
  readonly id: string;
  name: string;
  status: DeviceStatus;
  createdAt: string;
  lastSeenAt?: string;
}

function formatDevice(device: Device): string {
  return `${device.name} (${device.status})`;
}

const reactor: Device = { id: 'dev-001', name: 'Reactor A', status: 'online', createdAt: '2024-01-01' };
console.log(formatDevice(reactor)); // PASS: 'Reactor A (online)'

const conveyor: Device = { id: 'dev-002', name: 'Conveyor B', status: 'maintenance', createdAt: '2024-01-01' };
console.log(formatDevice(conveyor)); // PASS: 'Conveyor B (maintenance)'

export {};
