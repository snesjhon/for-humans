type Profile = {
  name: string;
  stats: {
    points: number;
  };
};

// Goal: return a shallow clone so top-level fields can diverge while the nested
// stats object is still shared.
export function cloneProfile(profile: Profile): Profile {
  return profile;
}

// ---Tests
test('returns a new outer object', () => {
  const original: Profile = {
    name: 'Ava',
    stats: { points: 10 },
  };

  const clone = cloneProfile(original);

  expect(clone).not.toBe(original);
});

test('changing a top-level field on the clone does not change the original', () => {
  const original: Profile = {
    name: 'Ava',
    stats: { points: 10 },
  };

  const clone = cloneProfile(original);
  clone.name = 'Milo';

  expect(original.name).toBe('Ava');
  expect(clone.name).toBe('Milo');
});

test('changing a nested field on the clone still changes the original', () => {
  const original: Profile = {
    name: 'Ava',
    stats: { points: 10 },
  };

  const clone = cloneProfile(original);
  clone.stats.points = 42;

  expect(original.stats.points).toBe(42);
  expect(clone.stats).toBe(original.stats);
});
// ---End Tests
