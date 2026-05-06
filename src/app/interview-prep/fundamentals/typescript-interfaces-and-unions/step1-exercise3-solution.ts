interface Device {
  readonly id: string;
  name: string;
  isOnline: boolean;
  createdAt: string;
  lastSeenAt?: string;
}

function getLastSeen(device: Device): string {
  return device.lastSeenAt ?? 'never';
}

const withSeen: Device = {
  id: 'dev-001',
  name: 'Reactor A',
  isOnline: true,
  createdAt: '2024-01-01',
  lastSeenAt: '2024-03-15T10:30:00Z',
};
console.log(getLastSeen(withSeen)); // PASS: '2024-03-15T10:30:00Z'

const noSeen: Device = {
  id: 'dev-002',
  name: 'Conveyor B',
  isOnline: false,
  createdAt: '2024-01-01',
};
console.log(getLastSeen(noSeen)); // PASS: 'never'

export {};
