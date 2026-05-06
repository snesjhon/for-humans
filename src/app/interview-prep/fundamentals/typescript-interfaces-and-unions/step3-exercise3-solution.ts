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

interface ApiPayload {
  devices: Device[];
  alarms: Alarm[];
}

function summarizePayload(payload: ApiPayload): {
  deviceCount: number;
  onlineCount: number;
  criticalAlarmCount: number;
} {
  return {
    deviceCount: payload.devices.length,
    onlineCount: payload.devices.filter(d => d.status === 'online').length,
    criticalAlarmCount: payload.alarms.filter(a => a.severity === 'critical').length,
  };
}

const payload: ApiPayload = {
  devices: [
    { id: 'dev-001', name: 'Reactor A', status: 'online', tags: [], createdAt: '2024-01-01' },
    { id: 'dev-002', name: 'Conveyor B', status: 'offline', tags: [], createdAt: '2024-01-01' },
    { id: 'dev-003', name: 'Pump C', status: 'maintenance', tags: [], createdAt: '2024-01-01' },
  ],
  alarms: [
    {
      id: 'alarm-001',
      deviceId: 'dev-001',
      severity: 'critical',
      event: { type: 'threshold', tagId: 'tag-1', threshold: 80, actual: 97 },
      triggeredAt: '2024-03-15T10:30:00Z',
    },
    {
      id: 'alarm-002',
      deviceId: 'dev-002',
      severity: 'warning',
      event: { type: 'connection', deviceId: 'dev-002', reason: 'timeout' },
      triggeredAt: '2024-03-15T11:00:00Z',
    },
  ],
};

const summary = summarizePayload(payload);
console.log(summary.deviceCount);        // PASS: 3
console.log(summary.onlineCount);        // PASS: 1
console.log(summary.criticalAlarmCount); // PASS: 1

export {};
