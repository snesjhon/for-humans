// Exercise 2: Exhaustive Status Switches
// Write getStatusLabel with a never-check to make the switch exhaustive.

type DeviceStatus = 'online' | 'offline' | 'maintenance';

// TODO: Write getStatusLabel(status: DeviceStatus): string
//   'online'      -> 'Online'
//   'offline'     -> 'Offline'
//   'maintenance' -> 'Under Maintenance'
//
//   In the default branch, assign status to a variable typed as never.
//   This causes a compile error if a new status variant is added without a case.

export type { DeviceStatus };
