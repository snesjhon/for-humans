// Goal: preserve valid falsy values and use the fallback only for null or
// undefined.
export function chooseValue<T>(value: T | null | undefined, fallback: T): T {
  return value || fallback;
}

// ---Tests
test('falls back for undefined', () => {
  expect(chooseValue(undefined, 'Untitled')).toBe('Untitled');
});

test('falls back for null', () => {
  expect(chooseValue(null, 'Untitled')).toBe('Untitled');
});

test('preserves 0', () => {
  expect(chooseValue(0, 10)).toBe(0);
});

test('preserves false', () => {
  expect(chooseValue(false, true)).toBe(false);
});

test('preserves the empty string', () => {
  expect(chooseValue('', 'fallback')).toBe('');
});
// ---End Tests
