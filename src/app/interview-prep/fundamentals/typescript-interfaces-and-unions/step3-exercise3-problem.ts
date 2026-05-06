// Exercise 3: Composing the Full API Payload
// Build ApiPayload from Device[] and Alarm[], then write a summary function.

type DeviceStatus = 'online' | 'offline' | 'maintenance';

type AlarmEvent =
  | { type: 'threshold'; tagId: string; threshold: number; actual: number }
  | { type: 'connection'; deviceId: string; reason: string };

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

interface Alarm {
  id: string;
  deviceId: string;
  severity: 'critical' | 'warning' | 'info';
  event: AlarmEvent;
  triggeredAt: string;
}

// TODO: Define ApiPayload as { devices: Device[]; alarms: Alarm[] }

// TODO: Write summarizePayload(payload: ApiPayload): { deviceCount: number; onlineCount: number; criticalAlarmCount: number }
//   deviceCount:        total number of devices
//   onlineCount:        devices where status === 'online'
//   criticalAlarmCount: alarms where severity === 'critical'

export type { Device, Alarm };
