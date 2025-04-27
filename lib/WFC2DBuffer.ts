import {
  TILE_EDGE_BOTTOM,
  TILE_EDGE_LEFT,
  TILE_EDGES_NAMES,
  TILE_EDGE_TOP,
  TILE_EDGES_COUNT,
} from "./constants";

import { WFCMinHeap } from "./WFCMinHeap";
import { WFCOptionsBuffer } from "./WFCOptionsBuffer";
import { WFCTile2D } from "./WFCTile2D";
import { WFCTileBuffer } from "./WFCTileBuffer";
import { WFCStackBuffer } from "./WFCStackBuffer";
import { indexedPrng } from "./utils/prng";

export class WFC2DBuffer {
  readonly count: number;
  readonly tiles: WFCTileBuffer;
  readonly entropyHeap: WFCMinHeap;
  readonly options: WFCOptionsBuffer;
  readonly stackBuffer: WFCStackBuffer;
  readonly collapsed: Int16Array;
  readonly rows: number;
  readonly cols: number;
  readonly seed?: number;
  readonly noise: number;

  readonly random: (index: number) => number;

  constructor(
    tiles: WFCTile2D[],
    cols: number,
    rows: number,
    seed?: number,
    noise: number = 0.00001
  ) {
    const count = cols * rows;
    this.count = count;
    this.cols = cols;
    this.rows = rows;
    this.seed = seed;
    this.noise = noise;
    this.random = seed ? indexedPrng(seed) : Math.random;

    this.tiles = new WFCTileBuffer(tiles);
    this.options = new WFCOptionsBuffer(count, this.tiles);
    this.collapsed = new Int16Array(count);
    this.entropyHeap = new WFCMinHeap(count);
    this.stackBuffer = new WFCStackBuffer(count);

    const initialEntropy = this.tiles.initialEntropy;
    const { options, collapsed, entropyHeap, random: _random } = this;

    for (let i = 0; i < count; i++) {
      collapsed[i] = -1;
      options.enableAll(i);
      entropyHeap.push(i, initialEntropy + _random(i) * noise);
    }
  }

  get isCompleted() {
    return this.entropyHeap.isEmpty();
  }

  get remainingCells() {
    return this.entropyHeap.size;
  }

  /**
   *
   * @returns
   */
  collapse(): boolean {
    const cellIndex = this.entropyHeap.pop();
    return cellIndex !== null && this._collapseCell(cellIndex);
  }

  /**
   * Repeatedly calls `collapse()` until all cells are collapsed or a contradiction occurs.
   * @returns `true` if the entire grid was successfully collapsed, `false` if a contradiction occurred.
   */
  collapseAll(): boolean {
    while (!this.entropyHeap.isEmpty()) {
      if (!this.collapse()) return !this.entropyHeap.isEmpty();
    }

    return true;
  }

  /**
   * Collapses a specific cell to a randomly chosen valid tile based on current options
   * and propagates the constraints.
   *
   * @param index - The index of the cell to collapse.
   *
   * @returns `true` if the cell was successfully collapsed and propagated,
   *          `false` if the index is invalid, the cell is already collapsed,
   *          the cell has no options (contradiction), or propagation fails.
   */
  collapseCell(index: number): boolean {
    if (index < 0 || index >= this.count) {
      console.error(`WFC CollapseCell: Invalid index ${index}.`);
      return false;
    }

    if (this.collapsed[index] !== -1) return true;

    const initialOptionCount = this.options.size(index);
    if (!initialOptionCount) {
      console.error(
        `WFC Contradiction: Attempting to collapse cell ${index} which already has no options.`
      );
      return false;
    }

    return this._collapseCell(index);
  }

  /**
   * Returns the collapsed cell tile's index, or `-1` if un-collapsed
   *
   * @param index
   * @returns The collapsed cell tile's index, `-1` if un-collapsed.
   */
  collapsedTile(index: number) {
    return this.collapsed[index];
  }

  /**
   * Internal helper to perform the collapse logic for a specific cell index.
   *
   * @param index The index of the cell to collapse.
   * @returns `true` on success, `false` on failure (contradiction during choice or propagation).
   * @private
   */
  private _collapseCell(index: number): boolean {
    const tileBuffer = this.tiles;
    const possibleOptions = this.options.indices(index)!;
    const count = possibleOptions.length;

    let sumOfWeights = 0;
    for (let i = 0; i < count; i++) {
      sumOfWeights += tileBuffer.getWeight(possibleOptions[i]);
    }

    let randomWeight = this.random(index + count) * sumOfWeights;
    let selectedTile = 0;
    for (let i = 0; i < count; i++) {
      const tileIndex = possibleOptions[i];
      randomWeight -= tileBuffer.getWeight(tileIndex);
      if (randomWeight <= 0) {
        selectedTile = tileIndex;
        break;
      }
    }

    this.options.collapse(index, selectedTile);
    this.collapsed[index] = selectedTile;
    this.entropyHeap.remove(index);

    if (!this._propagate(index)) {
      console.error(
        `WFC Collapse Failed: Contradiction detected during propagation after collapsing cell ${index} to tile ${selectedTile}.`
      );
      return false;
    }

    if (this.entropyHeap.peek() === 0) this.collapse();

    return true;
  }

  /**
   * Propagates constraints starting from a cell whose options have been reduced.
   * Uses an iterative approach with a stack and a Set to track items currently on the stack.
   *
   * @param cellIdx The index of the cell that triggered the propagation.
   * @returns `true` if propagation completed successfully, `false` if a contradiction was detected.
   */
  private _propagate(cellIdx: number): boolean {
    const stack = this.stackBuffer.reset();
    const options = this.options;
    //const tiles = this.tiles;
    const cols = this.cols;
    const rows = this.rows;
    const collapsed = this.collapsed;
    //const cellPosition = {};

    let stackCellIdx: number | undefined = cellIdx;
    while (stackCellIdx !== undefined) {
      const cellX = stackCellIdx % cols;
      const cellY = Math.floor(stackCellIdx / cols);

      for (let edgeIdx = 0; edgeIdx < TILE_EDGES_COUNT; edgeIdx++) {
        let neighborX = cellX;
        let neighborY = cellY;

        switch (edgeIdx) {
          case TILE_EDGE_TOP:
            if (cellY === 0) continue;
            neighborY--;
            break;
          case TILE_EDGE_BOTTOM:
            if (cellY === rows - 1) continue;
            neighborY++;
            break;
          case TILE_EDGE_LEFT:
            if (cellX === 0) continue;
            neighborX--;
            break;
          default:
            if (cellX === cols - 1) continue;
            neighborX++;
            break;
        }
        const neighborIdx = neighborY * cols + neighborX;

        if (collapsed[neighborIdx] !== -1) continue;

        // The opposite edge for the neighbor
        //const neighborEdge = edge ^ 1; // Bitwise XOR to get opposite edge

        const changed = options.propagate(stackCellIdx, neighborIdx, edgeIdx);

        if (changed) {
          this._computeEntropy(neighborIdx);
          stack.push(neighborIdx);
          continue;
        }

        if (changed === null) {
          console.error(
            `WFC Propagation Contradiction: Cell "${neighborIdx}" (Neighbor of "${stackCellIdx}" on the "${
              TILE_EDGES_NAMES[edgeIdx ^ 1]
            }" edge) has no options left after propagation from cell ${stackCellIdx}.`
          );
          this.entropyHeap.remove(stackCellIdx);
          return false;
        }
      }

      stackCellIdx = stack.pop();
    }

    return true;
  }

  /** Recomputes the Shannon entropy for a given cell */
  private _computeEntropy(index: number): void {
    const possibleOptions = this.options.indices(index)!;

    const optionsCount = possibleOptions.length;

    if (optionsCount === 1) {
      this.entropyHeap.update(index, 0);
      return;
    }

    let sumOfWeights = 0;
    let sumOfWeightsLogWeights = 0;
    const tileData = this.tiles;
    for (let i = 0; i < optionsCount; i++) {
      const tileIndex = possibleOptions[i];
      const weight = tileData.getWeight(tileIndex);
      sumOfWeights += weight;
      sumOfWeightsLogWeights += weight * Math.log(weight);
    }

    const entropy =
      Math.log(sumOfWeights) - sumOfWeightsLogWeights / sumOfWeights;

    this.entropyHeap.update(index, entropy + this.random(index) * this.noise);
  }
}
