const ROOT_INDEX = 1;

export class WFCMinHeap {
  private readonly keys: Uint32Array;
  private readonly entropy: Float32Array;
  private readonly keyToPos: Int32Array;

  private count: number;

  /**
   * Creates a new optimized Min Heap with a key-to-position map.
   * Assumes keys will be integers in the range [0, maxElements - 1].
   * @param count The maximum number of elements the heap can hold,
   *                    also defining the maximum key value + 1.
   */
  constructor(count: number) {
    this.count = 0;

    this.keys = new Uint32Array(count + ROOT_INDEX);
    this.entropy = new Float32Array(count + ROOT_INDEX);

    this.keyToPos = new Int32Array(count).fill(-1);
  }

  /** Number of elements currently in the heap. */
  get size(): number {
    return this.count;
  }

  /** Is the heap empty? */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Reads the current entropy associated with a given key.
   * Returns Positive Infinity if the key is not in the heap or out of range.
   *
   * @param key The key to look up.
   * @returns The entropy (entropy) or Number.POSITIVE_INFINITY.
   */
  read(key: number): number {
    const pos = this.keyToPos[key];
    return pos !== -1 ? this.entropy[pos] : Number.POSITIVE_INFINITY;
  }

  /**
   * Adds a key with a given entropy to the heap or updates it if it exists.
   * Throws an error if the heap is full and the key is new.
   *
   * @param key The key to add or update.
   * @param entropy The entropy associated with the key.
   */
  push(key: number, entropy: number): void {
    const newPos = this.count + ROOT_INDEX;
    this.keys[newPos] = key;
    this.entropy[newPos] = entropy;
    this.keyToPos[key] = newPos;
    this.count++;

    this.bubbleUp(newPos);
  }

  /**
   * Adds a key with a given entropy to the heap or updates it if it exists.
   * Throws an error if the heap is full and the key is new.
   *
   * @param key The key to add or update.
   * @param entropy The entropy associated with the key.
   */
  put(key: number, entropy: number): void {
    if (!this.update(key, entropy)) this.push(key, entropy);
  }

  /**
   * Explicitly updates the entropy of an existing key. Does nothing if the key isn't present.
   *
   * @param key The key whose entropy to update.
   * @param newEntropy The new entropy value.
   */
  update(key: number, newEntropy: number): boolean {
    const pos = this.keyToPos[key];
    if (pos === -1) return false;

    const oldEntropy = this.entropy[pos];
    this.entropy[pos] = newEntropy;

    if (newEntropy < oldEntropy) {
      this.bubbleUp(pos);
    } else {
      this.bubbleDown(pos);
    }

    return true;
  }

  /**
   * Removes and returns the key with the minimum entropy.
   * Returns undefined if the heap is empty.
   *
   * @returns The key with the minimum entropy, or undefined.
   */
  pop(): number | null {
    if (!this.count) {
      return null;
    }

    const minKey = this.keys[ROOT_INDEX];

    this.keyToPos[minKey] = -1;

    if (this.count > 1) {
      const lastPos = this.count + ROOT_INDEX - 1;
      const lastKey = this.keys[lastPos];

      this.keys[ROOT_INDEX] = lastKey;
      this.entropy[ROOT_INDEX] = this.entropy[lastPos];
      this.keyToPos[lastKey] = ROOT_INDEX;

      this.count--;

      this.bubbleDown(ROOT_INDEX);
    } else {
      this.count--;
    }

    return minKey;
  }

  /**
   * Returns the minimum entropy without removing the element.
   * Returns undefined if the heap is empty.
   */
  peek(): number | false {
    return this.count !== 0 && this.entropy[ROOT_INDEX];
  }

  /**
   * Returns the key with the minimum entropy without removing it.
   * Returns undefined if the heap is empty.
   */
  peekKey(): number | false {
    return this.count !== 0 && this.keys[ROOT_INDEX];
  }

  /**
   * Removes an element associated with a specific key from the heap.
   * Returns true if the key was found and removed, false otherwise.
   *
   * @param key The key of the element to remove.
   * @returns True if removal was successful, false if the key was not found.
   */
  remove(key: number): boolean {
    const pos = this.keyToPos[key];
    if (pos === -1) {
      return false;
    }

    this.keyToPos[key] = -1;

    const lastPos = this.count + ROOT_INDEX - 1;

    if (pos === lastPos) {
      this.count--;
    } else if (this.count > 1) {
      const lastKey = this.keys[lastPos];
      const lastEntropy = this.entropy[lastPos];

      this.keys[pos] = lastKey;
      this.entropy[pos] = lastEntropy;
      this.keyToPos[lastKey] = pos;

      this.count--;

      const parentIndex = pos >>> 1;
      if (pos > ROOT_INDEX && this.entropy[pos] < this.entropy[parentIndex]) {
        this.bubbleUp(pos);
      } else {
        this.bubbleDown(pos);
      }
    } else {
      this.count--;
    }

    return true;
  }

  clear(): void {
    this.count = 0;
    this.keyToPos.fill(-1);
  }

  /** Swaps two elements in the heap arrays and updates the map */
  private swap(i: number, j: number): void {
    const keys = this.keys;
    const entropy = this.entropy;
    const keyToPos = this.keyToPos;

    const key_i = keys[i];
    const key_j = keys[j];
    const entropy_i = entropy[i];
    const entropy_j = entropy[j];

    keys[i] = key_j;
    keys[j] = key_i;
    entropy[i] = entropy_j;
    entropy[j] = entropy_i;

    keyToPos[key_i] = j;
    keyToPos[key_j] = i;
  }

  /** Bubble an item up until its heap property is satisfied. */
  private bubbleUp(index: number): void {
    const priorities = this.entropy;
    const currentEntropy = priorities[index];

    while (index > ROOT_INDEX) {
      const parentIndex = index >>> 1;

      if (priorities[parentIndex] <= currentEntropy) {
        break;
      }

      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /** Bubble an item down until its heap property is satisfied. */
  private bubbleDown(index: number): void {
    const priorities = this.entropy;
    const currentEntropy = priorities[index];
    const heapSize = this.count + ROOT_INDEX;

    while (true) {
      const leftChildIdx = index << 1;
      const rightChildIdx = leftChildIdx + 1;
      let swapCandidateIdx = -1;

      if (
        leftChildIdx < heapSize &&
        priorities[leftChildIdx] < currentEntropy
      ) {
        swapCandidateIdx = leftChildIdx;
      }

      if (rightChildIdx < heapSize) {
        const rightEntropy = priorities[rightChildIdx];

        const comparisonEntropy =
          swapCandidateIdx === -1
            ? currentEntropy
            : priorities[swapCandidateIdx];

        if (rightEntropy < comparisonEntropy) {
          swapCandidateIdx = rightChildIdx;
        }
      }

      if (swapCandidateIdx === -1) {
        break;
      }

      this.swap(index, swapCandidateIdx);
      index = swapCandidateIdx;
    }
  }
}
