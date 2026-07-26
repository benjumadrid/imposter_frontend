/**
 * Fisher-Yates shuffle — every permutation equally likely.
 * Unbiased, unpredictable, resets every call.
 */
export function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick `count` imposter indices from `playerCount` players.
 * Every player has exactly equal probability.
 * Returns a sorted array of 0-based indices.
 */
export function pickImposterIndices(playerCount, count) {
  const allIndices = Array.from({ length: playerCount }, (_, i) => i);
  const shuffled = fisherYates(allIndices);
  const picked = shuffled.slice(0, count);
  return fisherYates(picked);
}