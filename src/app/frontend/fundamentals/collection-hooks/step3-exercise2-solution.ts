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

function toIdSet<TItem extends { id: PropertyKey }>(
  items: readonly TItem[],
): Set<TItem['id']> {
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

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

type Expect<T extends true> = T;

type AlarmIdSetCheck = Expect<Equal<typeof alarmIds, Set<number>>>;
type DeviceIdSetCheck = Expect<Equal<typeof deviceIds, Set<string>>>;
