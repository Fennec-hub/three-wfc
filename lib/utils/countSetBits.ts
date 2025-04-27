const lookup = new Uint8Array(256);
for (let i = 0; i < 256; i++) lookup[i] = (i & 1) + lookup[i >> 1];

export const countSetBits = (bitmask: number) =>
  lookup[bitmask & 0xff] +
  lookup[(bitmask >> 8) & 0xff] +
  lookup[(bitmask >> 16) & 0xff] +
  lookup[(bitmask >> 24) & 0xff];
