type AlarmEvent =
  | { type: 'threshold'; tagId: string; threshold: number; actual: number }
  | { type: 'connection'; deviceId: string; reason: string };

interface Alarm {
  id: string;
  deviceId: string;
  severity: 'critical' | 'warning' | 'info';
  event: AlarmEvent;
  triggeredAt: string;
}

function getCriticalAlarms(alarms: Alarm[]): Alarm[] {
  return alarms.filter(alarm => alarm.severity === 'critical');
}

const alarms: Alarm[] = [
  {
    id: 'alarm-001',
    deviceId: 'dev-001',
    severity: 'critical',
    event: { type: 'threshold', tagId: 'tag-temp', threshold: 80, actual: 97 },
    triggeredAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'alarm-002',
    deviceId: 'dev-002',
    severity: 'warning',
    event: { type: 'connection', deviceId: 'dev-002', reason: 'packet loss' },
    triggeredAt: '2024-03-15T11:00:00Z',
  },
];

console.log(getCriticalAlarms(alarms).length);    // PASS: 1
console.log(getCriticalAlarms(alarms)[0].id);     // PASS: 'alarm-001'

export {};
