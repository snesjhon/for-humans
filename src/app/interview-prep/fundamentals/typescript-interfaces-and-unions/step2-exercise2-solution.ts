type DeviceStatus = 'online' | 'offline' | 'maintenance';

function getStatusLabel(status: DeviceStatus): string {
  switch (status) {
    case 'online': return 'Online';
    case 'offline': return 'Offline';
    case 'maintenance': return 'Under Maintenance';
    default: {
      const exhausted: never = status;
      throw new Error(`Unhandled status: ${exhausted}`);
    }
  }
}

console.log(getStatusLabel('online'));      // PASS: 'Online'
console.log(getStatusLabel('offline'));     // PASS: 'Offline'
console.log(getStatusLabel('maintenance')); // PASS: 'Under Maintenance'

export {};
