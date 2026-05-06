type AlarmEvent =
  | { type: 'threshold'; tagId: string; threshold: number; actual: number }
  | { type: 'connection'; deviceId: string; reason: string };

function describeAlarm(event: AlarmEvent): string {
  if (event.type === 'threshold') {
    return `Tag ${event.tagId} exceeded ${event.threshold} (actual: ${event.actual})`;
  }
  return `Device ${event.deviceId} disconnected: ${event.reason}`;
}

const thresholdEvent: AlarmEvent = { type: 'threshold', tagId: 'tag-temp', threshold: 80, actual: 95 };
console.log(describeAlarm(thresholdEvent)); // PASS: 'Tag tag-temp exceeded 80 (actual: 95)'

const connectionEvent: AlarmEvent = { type: 'connection', deviceId: 'dev-001', reason: 'network timeout' };
console.log(describeAlarm(connectionEvent)); // PASS: 'Device dev-001 disconnected: network timeout'

export {};
