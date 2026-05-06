// Exercise 1: Union Types for Status Fields
// Replace isOnline: boolean with a DeviceStatus union.

// TODO: Define DeviceStatus as a union of 'online' | 'offline' | 'maintenance'

// TODO: Update the Device interface to use status: DeviceStatus instead of isOnline: boolean.
//   Keep: readonly id, name, createdAt, lastSeenAt?
//   Replace: isOnline: boolean -> status: DeviceStatus

// TODO: Update formatDevice(device: Device): string
//   Returns the device name followed by its status in parens.
//   Example: "Reactor A (online)" or "Conveyor B (maintenance)"

export {};
