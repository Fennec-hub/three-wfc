/**
 * A simple and fast deterministic PRNG algorithm.
 *
 * @param seed - The initial integer seed value for the generator.
 * @returns A function that, when called, returns the next pseudo-random
 *          floating-point number between 0 (inclusive) and 1 (exclusive)
 *          in the sequence.
 */
export function prng(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A deterministic PRNG algorithm that generates values based on seed and index.
 *
 * @param seed - The initial integer seed value for the generator.
 * @returns A function that takes an index and returns a deterministic
 *          floating-point number between 0 (inclusive) and 1 (exclusive)
 *          based on that index and the original seed.
 */
export function indexedPrng(seed: number) {
  return function (index: number) {
    let t = seed + Math.imul(index, 0x9e3779b9);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
