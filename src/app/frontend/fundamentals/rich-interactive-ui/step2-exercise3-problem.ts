export {};

// Wall Blueprint, Level 2: when auto-fill and auto-fit diverge

interface TrackComparison {
  autoFillTracks: number;
  autoFitTracks: number;
}

function countAutoFillTracks(
  containerWidth: number,
  minTrackWidth: number,
  gap: number,
): number {
  return Math.max(1, Math.floor((containerWidth + gap) / (minTrackWidth + gap)));
}

// TODO:
// - autoFillTracks should stay at the number of tracks the container can hold
// - autoFitTracks should collapse empty tracks, so it is the smaller of:
//   1. possible tracks
//   2. rendered item count
function compareAutoTracks(
  containerWidth: number,
  minTrackWidth: number,
  gap: number,
  itemCount: number,
): TrackComparison {
  throw new Error('not implemented');
}

// ---Tests
function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const roomy = compareAutoTracks(900, 200, 20, 2);
assert(roomy.autoFillTracks === 4, 'auto-fill keeps all four possible tracks');
assert(roomy.autoFitTracks === 2, 'auto-fit collapses empty tracks down to the item count');

const full = compareAutoTracks(900, 200, 20, 4);
assert(full.autoFillTracks === 4, 'auto-fill stays at four when every track is occupied');
assert(full.autoFitTracks === 4, 'auto-fit matches auto-fill when there are no empty tracks');
// ---End Tests
