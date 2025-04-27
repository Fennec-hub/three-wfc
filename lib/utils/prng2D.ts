/**
 * Creates a random generator that produces deterministic values based on
 * a 2D grid position and its origin.
 *
 * @param seed - The base seed for the random generator
 * @param cols - The 2D grid columns count (width)
 * @param origin - A Vector2 like, with x, y origin axis
 * @returns A function that takes a linear index and returns a deterministic random value
 */
export function prng2D(
  seed: number,
  cols: number,
  origin: { x: number; y: number }
) {
  return function (index: number) {
    const x = (index % cols) + origin.x;
    const y = Math.floor(index / cols) + origin.y;
    const hash = (y << 16) ^ x;

    let t = seed + Math.imul(hash, 0x9e3779b9);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
