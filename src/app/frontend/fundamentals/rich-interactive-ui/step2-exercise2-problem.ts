export {};

// Wall Blueprint, Level 2: predict auto-fill track count

// A grid uses repeat(auto-fill, minmax(minTrack, 1fr)).
// The browser can fit another track only if there is room for the new track
// plus the gap that precedes it.

// TODO: return how many tracks can fit.
// Formula hint:
// floor((container + gap) / (minTrack + gap)), but never less than 1.
function countAutoFillTracks(
  containerWidth: number,
  minTrackWidth: number,
  gap: number,
): number {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

assert(countAutoFillTracks(320, 160, 16) === 1, '320px fits one 160px card with 16px gap');
assert(countAutoFillTracks(520, 160, 16) === 3, '520px fits three 160px tracks with two gaps');
assert(countAutoFillTracks(900, 240, 24) === 3, '900px fits three 240px tracks with 24px gaps');
// ---End Tests
