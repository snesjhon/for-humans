export {};

interface AlarmTag {
  id: number;
  name: string;
  severity: 'warning' | 'critical';
}

interface DeviceRow {
  id: string;
  label: string;
}

// Goal: accept any item shape with an ID, but preserve the exact ID type in the returned Set.
// TODO: constrain TItem so it must have an `id` that can live in a Set,
// then return a Set of exactly that inferred ID type.
function toIdSet<TItem extends { id: unknown }>(items: readonly TItem[]) {
  return new Set(items.map((item) => item.id));
}

const alarmIds = toIdSet([
  { id: 101, name: 'Overheat', severity: 'critical' } satisfies AlarmTag,
  { id: 102, name: 'Pressure drop', severity: 'warning' } satisfies AlarmTag,
]);

const deviceIds = toIdSet([
  { id: 'pump-1', label: 'Feed Pump' } satisfies DeviceRow,
  { id: 'fan-3', label: 'Cooling Fan' } satisfies DeviceRow,
]);

// Hover the values while solving:
// - alarmIds should become Set<number>
// - deviceIds should become Set<string>
