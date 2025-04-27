import { WFCTile2D } from "./WFCTile2D";
import { WFCOptionsBuffer } from "./WFCOptionsBuffer";
import { hashArray } from "./utils/hashArray";

export class WFCTileBuffer {
  readonly count: number = 0;
  readonly weight!: Float32Array;
  readonly edges!: WFCOptionsBuffer[];
  readonly tiles: WFCTile2D[];
  initialEntropy: number = 0;

  constructor(tiles: WFCTile2D[], is2D: boolean = true) {
    for (let i = 0, l = tiles.length; i < l; i++)
      tiles.push(...tiles[i].transformClones());

    const count = tiles.length;
    this.tiles = tiles;
    this.count = count;
    this.weight = new Float32Array(count);
    this.edges = Array.from(
      { length: is2D ? 4 : 6 },
      () => new WFCOptionsBuffer(count, this)
    );

    this._initialize();

    return this;
  }

  private _initialize() {
    const count = this.count;
    const tiles = this.tiles;
    const edges = this.edges;
    const edgesLength = edges.length;
    const hashLookup = new Map<number, number>();
    const edgeKey = (tile: number, edge: number) => tile * edgesLength + edge;

    let sumOfWeights = 0;
    let sumOfWeightsLogWeights = 0;

    for (let tile = 0; tile < count; tile++) {
      const weight = tiles[tile].weight;
      this.weight[tile] = weight;
      sumOfWeights += weight;
      sumOfWeightsLogWeights += weight * Math.log(weight);

      for (let edge = 0; edge < edgesLength; edge++)
        hashLookup.set(edgeKey(tile, edge), hashArray(tiles[tile].edges[edge]));
    }

    this.initialEntropy =
      Math.log(sumOfWeights) - sumOfWeightsLogWeights / sumOfWeights;

    for (let tileA = 0; tileA < count; tileA++) {
      for (let tileB = 0; tileB < count; tileB++) {
        for (let edgeA = 0; edgeA < edgesLength; edgeA++) {
          const oppositeEdgeB = edgeA ^ 1;
          const hashA = hashLookup.get(edgeKey(tileA, edgeA));
          const hashB = hashLookup.get(edgeKey(tileB, oppositeEdgeB));

          if (hashA === hashB) edges[edgeA].setBit(tileA, tileB);
        }
      }
    }
  }

  getWeight(index: number) {
    return this.weight[index];
  }

  getEdgeMask(edge: number, index: number): Uint32Array {
    return this.edges[edge].mask(index);
  }
}
