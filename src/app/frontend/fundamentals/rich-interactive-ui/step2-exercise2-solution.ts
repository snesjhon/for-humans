export {};

// Wall Blueprint, Level 2: predict auto-fill track count

function countAutoFillTracks(
  containerWidth: number,
  minTrackWidth: number,
  gap: number,
): number {
  return Math.max(1, Math.floor((containerWidth + gap) / (minTrackWidth + gap)));
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
