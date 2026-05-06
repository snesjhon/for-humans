// Exercise 3: Discriminated Unions for Event Payloads
// Define AlarmEvent as a discriminated union and write describeAlarm.

// TODO: Define AlarmEvent as a discriminated union:
//   | { type: 'threshold'; tagId: string; threshold: number; actual: number }
//   | { type: 'connection'; deviceId: string; reason: string }

// TODO: Write describeAlarm(event: AlarmEvent): string
//   'threshold' branch: "Tag {tagId} exceeded {threshold} (actual: {actual})"
//   'connection' branch: "Device {deviceId} disconnected: {reason}"
//
//   TypeScript should narrow the type in each branch so fields exclusive
//   to one variant are not accessible in the other.

export {};
