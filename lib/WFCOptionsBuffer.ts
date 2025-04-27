import { BITS_MASK_CHUNK, BITS_MASK_CHUNK_LOG2 } from "./constants";
import { countSetBits } from "./utils/countSetBits";
import { WFCTileBuffer } from "./WFCTileBuffer";

/**
 * High-performance bitmask buffer optimized for speed.
 * Includes a fast path for masks fitting within a single 32-bit chunk.
 * Caller MUST ensure all inputs (indices, lengths) are valid.
 */
export class WFCOptionsBuffer {
  readonly array: Uint32Array;
  readonly count: number;
  readonly stride: number;
  readonly maskSize: number;
  readonly monoChunk: boolean;
  readonly tiles: WFCTileBuffer;

  private readonly unionMask: Uint32Array;
  private readonly tileIndices: Uint16Array;
  private readonly tailMask: number;

  constructor(count: number, tiles: WFCTileBuffer) {
    this.tiles = tiles;
    const optionsCount = tiles.count;
    this.count = tiles.count;
    this.stride = Math.ceil(optionsCount / BITS_MASK_CHUNK);
    this.maskSize = optionsCount;

    this.monoChunk = this.stride === 1;

    this.array = new Uint32Array(count * this.stride);

    const bitsInLastChunk = optionsCount % BITS_MASK_CHUNK;
    this.tailMask =
      bitsInLastChunk === 0 ? 0xffffffff : (1 << bitsInLastChunk) - 1;

    this.tileIndices = new Uint16Array(this.maskSize);
    this.unionMask = new Uint32Array(this.stride);
  }

  /**
   * Sets a specific bit.
   * @param index     The index of the cell
   * @param position  The position of the bit to set/clear
   */
  setBit(index: number, position: number): void {
    if (this.monoChunk) {
      this.array[index] |= 1 << position;
      return;
    }

    const startIndex = index * this.stride;
    const chunkOffset = position >>> BITS_MASK_CHUNK_LOG2;
    const bitPosition = position & (BITS_MASK_CHUNK - 1);

    this.array[startIndex + chunkOffset] |= 1 << bitPosition;
  }

  /** Enables all possible states (bits) for an item. */
  enableAll(index: number): void {
    if (this.monoChunk) {
      this.array[index] = this.tailMask;
    } else {
      const startIndex = index * this.stride;
      const endIndex = startIndex + this.stride;
      this.array.fill(0xffffffff, startIndex, endIndex - 1);
      this.array[endIndex - 1] = this.tailMask;
    }
  }

  /**
   * Collapse the cell's option to a single
   *
   * @param index
   * @param position
   */
  collapse(index: number, position: number): void {
    if (this.monoChunk) {
      this.array[index] = 1 << position;
      return;
    }

    const startIndex = index * this.stride;
    const chunkOffset = position >>> BITS_MASK_CHUNK_LOG2;
    const bitPosition = position & (BITS_MASK_CHUNK - 1);
    const absoluteChunkIndex = startIndex + chunkOffset;

    for (let i = 0; i < this.stride; i++) {
      this.array[startIndex + i] = 0;
    }

    this.array[absoluteChunkIndex] = 1 << bitPosition;
  }

  /**
   * Sets up a cell's neighboring constraints based on the current state of another cell.
   *
   * @param cellIdx The index of the reference cell
   * @param neighborIdx The index of the neighbor cell to be constrained
   * @param edgeIdx The edge index on the neighbor that connects to the reference cell
   * @param tiles The tile buffer containing compatibility information
   * @param tilesDefinitions The tile definitions (for debugging)
   *
   * @return
   *    - `true`, to signal changes.
   *    - `false`, nothing changed.
   *    - `null`, to signal a zero remaining cells contradiction.
   */
  propagate(
    cellIdx: number,
    neighborIdx: number,
    edgeIdx: number
  ): boolean | null {
    const tiles = this.tiles;
    const cellMask = this.mask(cellIdx);
    const stride = this.stride;
    const tilesCount = tiles.count;
    const unionMask = this.unionMask.fill(0);

    for (let chunkIdx = 0; chunkIdx < stride; chunkIdx++) {
      const cellChunkBits = cellMask[chunkIdx];
      if (cellChunkBits === 0) continue;

      const baseBitPos = chunkIdx * BITS_MASK_CHUNK;

      let remainingBits = cellChunkBits;
      while (remainingBits !== 0) {
        const lsb = remainingBits & -remainingBits;
        const bitIdx = 31 - Math.clz32(lsb);
        remainingBits &= ~lsb;

        const tileAIndex = baseBitPos + bitIdx;

        if (tileAIndex >= tilesCount) continue;

        const constraintMask = tiles.getEdgeMask(edgeIdx, tileAIndex);

        for (let i = 0; i < stride; i++) {
          unionMask[i] |= constraintMask[i];
        }
      }
    }

    if (!this.intersect(neighborIdx, unionMask)) return false;

    return this.size(neighborIdx) ? true : null;
  }

  /**
   * Performs bitwise AND intersection between the mask at the given index
   * and the provided mask. Modifies the internal mask in place.
   *
   * @param index The index of the mask to modify.
   * @param mask The mask to intersect with.

   */
  intersect(index: number, mask: Uint32Array): boolean {
    let changed = false;

    if (this.monoChunk) {
      const originalValue = this.array[index];
      const maskChunk = mask[0] ?? 0;
      const newValue = originalValue & maskChunk;

      const needsSpecificMask = this.count % 32 !== 0;
      const comparisonMask = needsSpecificMask ? this.tailMask : 0xffffffff;

      this.array[index] = newValue;

      changed =
        (newValue & comparisonMask) !== (originalValue & comparisonMask);
    } else {
      const stride = this.stride;
      const startIndex = index * stride;
      const arr = this.array;

      for (let i = 0; i < stride; ++i) {
        const chunkIndex = startIndex + i;
        const originalChunkValue = arr[chunkIndex];
        const maskChunk = mask[i] ?? 0;
        const newChunkValue = originalChunkValue & maskChunk;

        const isLastChunk = i === stride - 1;

        const needsSpecificMask = isLastChunk && this.count % 32 !== 0;
        const comparisonMask = needsSpecificMask ? this.tailMask : 0xffffffff;

        if (
          (newChunkValue & comparisonMask) !==
          (originalChunkValue & comparisonMask)
        ) {
          changed = true;
        }

        arr[chunkIndex] = newChunkValue;
      }
    }

    return changed;
  }

  /** Counts the number of enabled states (set bits). */
  size(index: number): number {
    if (this.monoChunk) {
      return countSetBits(this.array[index] & this.tailMask);
    }

    let count = 0;
    const startIndex = index * this.stride;
    const endIndex = startIndex + this.stride;
    const arr = this.array;

    for (let i = startIndex; i < endIndex - 1; i++) {
      count += countSetBits(arr[i]);
    }

    count += countSetBits(arr[endIndex - 1] & this.tailMask);

    return count;
  }

  /** Returns a view (subarray) of the mask. */
  mask(index: number): Uint32Array {
    if (this.monoChunk) return this.array.subarray(index, index + 1);

    const startIndex = index * this.stride;
    return this.array.subarray(startIndex, startIndex + this.stride);
  }

  /**
   * Gets the index of the single set bit, assuming the mask at 'index'
   * represents a collapsed state with exactly one option enabled.
   * Uses a fast clz32 method.
   * Returns -1 if the guarantee is violated (no bits set).
   *
   * @param index The index of the collapsed cell.
   * @returns The index of the single set bit, or -1 if none found (error).
   */
  tile(index: number): number {
    const arr = this.array;

    if (this.monoChunk) {
      const chunk = arr[index] & this.tailMask;
      if (chunk === 0) return -1;

      return 31 - Math.clz32(chunk);
    } else {
      const startIndex = index * this.stride;
      const endIndex = startIndex + this.stride;

      for (let i = startIndex; i < endIndex; i++) {
        let chunk = arr[i];

        if (i === endIndex - 1) chunk &= this.tailMask;

        if (chunk === 0) continue;

        const baseBitPos = (i - startIndex) * BITS_MASK_CHUNK;
        const indexInChunk = 31 - Math.clz32(chunk);
        const absoluteBitPos = baseBitPos + indexInChunk;

        return absoluteBitPos;
      }
    }

    return -1;
  }

  /**
   * Gets the indices of all set bits in the given mask.
   * @param index The index of the mask to check
   * @returns Array of indices of set bits, or null if no bits are set
   */
  indices(index: number): Uint16Array | null {
    const indices = this.tileIndices;
    const arr = this.array;
    const maskLen = this.maskSize;
    let counter = 0;

    if (this.monoChunk) {
      const chunk = arr[index] & this.tailMask;
      if (chunk === 0) return null;

      counter = this._extractSetBits(chunk, 0, maskLen, indices, counter);
    } else {
      const stride = this.stride;
      const startIndex = index * stride;
      const endIndex = startIndex + stride;

      for (let chunkIdx = startIndex; chunkIdx < endIndex; chunkIdx++) {
        let chunk = arr[chunkIdx];

        if (chunkIdx === endIndex - 1) {
          chunk &= this.tailMask;
        }

        if (chunk === 0) continue;

        const baseBitPos = (chunkIdx - startIndex) * BITS_MASK_CHUNK;

        if (baseBitPos >= maskLen) break;

        counter = this._extractSetBits(
          chunk,
          baseBitPos,
          maskLen,
          indices,
          counter
        );
      }
    }

    return counter === 0 ? null : indices.subarray(0, counter);
  }

  /**
   * Helper method to extract set bit indices from a single chunk.
   * Uses bitwise operations for reliability and performance.
   *
   * @param chunk The 32-bit integer chunk to process.
   * @param baseBitPos The starting bit position offset for this chunk.
   * @param maskLength The overall mask length limit.
   * @param setIndices The array to store the found indices.
   * @param currentCount The current number of indices already found and stored.
   * @returns The updated count of indices found after processing this chunk.
   */
  private _extractSetBits(
    chunk: number,
    baseBitPos: number,
    maskLength: number,
    setIndices: Uint16Array,
    currentCount: number
  ): number {
    while (chunk !== 0) {
      const lsb = chunk & -chunk;

      const bitInChunk = 31 - Math.clz32(lsb);

      const absoluteBitPos = baseBitPos + bitInChunk;

      if (absoluteBitPos < maskLength) {
        setIndices[currentCount++] = absoluteBitPos;
      }

      chunk &= ~lsb;
    }

    return currentCount;
  }
}
