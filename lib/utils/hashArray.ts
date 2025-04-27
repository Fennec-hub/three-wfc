/**
 * Computes a 32-bit hash value for an array of strings.
 *
 * @param array - The array of strings to hash.
 * @returns The computed hash value.
 */
export const hashArray = (array: (string | number)[]) => {
  let hash = 0x811c9dc5;

  for (let i = 0, li = array.length; i < li; i++) {
    const str = `${array[i]}`;
    hash ^= str.length;
    hash = Math.imul(hash, 0x01000193) >>> 0;

    for (let j = 0, lj = str.length; j < lj; j++) {
      hash ^= str.charCodeAt(j);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }

  return hash;
};
