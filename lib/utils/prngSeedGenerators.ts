/**
 * Generates a deterministic seed value from a string input.
 * This is useful for creating reproducible random sequences from text inputs.
 *
 * @param input - String to generate a seed from
 * @returns A 32-bit integer seed value
 */
export function generateSeed(input: string): number {
  let hash = 0;

  if (input.length === 0) {
    return hash;
  }

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash);
}

/**
 * Generates a seed based on the current timestamp.
 * Useful for non-deterministic random sequences.
 *
 * @returns A seed based on current time
 */
export function generateTimeSeed(): number {
  return Math.floor(Date.now() * Math.random());
}

/**
 * Combines multiple values into a single seed.
 * Useful when you want to incorporate multiple factors into your seed.
 *
 * @param values - Array of numbers or strings to combine
 * @returns A combined seed value
 */
export function combineSeedValues(values: (number | string)[]): number {
  let seed = 17;

  for (const value of values) {
    if (typeof value === "string") {
      const stringHash = generateSeed(value);
      seed = seed * 37 + stringHash;
    } else {
      seed = seed * 37 + value;
    }
  }

  return Math.abs(seed) | 0;
}
