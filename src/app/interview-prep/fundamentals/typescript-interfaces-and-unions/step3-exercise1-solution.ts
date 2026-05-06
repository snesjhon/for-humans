type DeviceStatus = 'online' | 'offline' | 'maintenance';

interface Tag {
  id: string;
  name: string;
  unit: string;
  value: number;
}

interface Device {
  readonly id: string;
  name: string;
  status: DeviceStatus;
  tags: Tag[];
  createdAt: string;
  lastSeenAt?: string;
}

function getTagNames(device: Device): string[] {
  return device.tags.map(tag => tag.name);
}

const device: Device = {
  id: 'dev-001',
  name: 'Reactor A',
  status: 'online',
  createdAt: '2024-01-01',
  tags: [
    { id: 'tag-001', name: 'Temperature', unit: '°C', value: 72 },
    { id: 'tag-002', name: 'Pressure', unit: 'PSI', value: 14 },
  ],
};

console.log(getTagNames(device)); // PASS: ['Temperature', 'Pressure']

export {};
