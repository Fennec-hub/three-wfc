/**
 * Creates a random generator that produces deterministic values based on
 * a 3D grid and its origin.
 *
 * @param seed - The base seed for the random generator
 * @param width - The 3D grid width
 * @param height - The 3D grid height
 * @param origin - A Vector3 like, with x, y, z origin axis
 * @returns A function that takes a linear index and returns a deterministic random value
 */
export function prng3D(
  seed: number,
  width: number,
  height: number,
  origin: { x: number; y: number; z: number }
) {
  return function (index: number) {
    const relativeX = index % width;
    const relativeY = Math.floor(index / width) % height;
    const relativeZ = Math.floor(index / (width * height));

    const x = relativeX + origin.x;
    const y = relativeY + origin.y;
    const z = relativeZ + origin.z;

    const hash = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);

    let t = seed + Math.imul(hash, 0x9e3779b9);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
