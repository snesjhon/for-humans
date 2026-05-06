// Exercise 1: Composing Interfaces
// Define Tag and update Device to include tags: Tag[].

type DeviceStatus = 'online' | 'offline' | 'maintenance';

// TODO: Define the Tag interface with:
//   id: string
//   name: string
//   unit: string
//   value: number

// TODO: Define the Device interface with:
//   readonly id: string
//   name: string
//   status: DeviceStatus
//   tags: Tag[]
//   createdAt: string
//   lastSeenAt?: string

// TODO: Write getTagNames(device: Device): string[]
//   Returns the name field of each tag in device.tags.

export type { DeviceStatus };
