// Exercise 2: Alarm Interface with Nested Types
// Define Alarm using AlarmEvent and a severity union.

type AlarmEvent =
  | { type: 'threshold'; tagId: string; threshold: number; actual: number }
  | { type: 'connection'; deviceId: string; reason: string };

// TODO: Define the Alarm interface with:
//   id: string
//   deviceId: string
//   severity: 'critical' | 'warning' | 'info'
//   event: AlarmEvent
//   triggeredAt: string

// TODO: Write getCriticalAlarms(alarms: Alarm[]): Alarm[]
//   Returns only alarms where severity === 'critical'.

export type { AlarmEvent };
