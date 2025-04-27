import { Color, Vector2 } from "three";
import { WFCTile2D } from "./WFCTile2D";
import { WFC2DBuffer } from "./WFC2DBuffer";

export class WFC2D {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  size: number;
  drawGrid: boolean = false;
  wfcBuffer!: WFC2DBuffer;
  seed?: number | undefined;
  readonly offset: Vector2 = new Vector2();
  readonly tiles: WFCTile2D[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor({
    canvas,
    width,
    height,
    cellSize,
    seed,
    drawGrid,
  }: {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    cellSize: number;
    seed?: number;
    drawGrid?: boolean;
  }) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.size = cellSize;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = width;
    this.canvas.height = height;

    if (seed) this.seed = seed;
    this.drawGrid = !!drawGrid;
  }

  addTile(...tiles: WFCTile2D[]) {
    this.tiles.push(...tiles);
  }

  removeTile(...tiles: WFCTile2D[]) {
    tiles.forEach((tile) => {
      const index = this.tiles.indexOf(tile);
      if (!~index) return;
      this.tiles.splice(index, 1);
    });
  }

  clear() {
    this.tiles.length = 0;
  }

  init() {
    const cols = Math.ceil(this.width / this.size);
    const rows = Math.ceil(this.height / this.size);

    this.canvas.width = cols * this.size;
    this.canvas.height = rows * this.size;

    this.wfcBuffer = new WFC2DBuffer(this.tiles, cols, rows, this.seed);
  }

  collapseAll() {
    if (!this.wfcBuffer) {
      console.error("WFC not initialized. Call init() first.");
      return false;
    }

    return this.wfcBuffer.collapseAll();
  }

  collapse() {
    if (!this.wfcBuffer) {
      console.error("WFC not initialized. Call init() first.");
      return false;
    }
    return this.wfcBuffer.collapse();
  }

  collapseCell(index: number) {
    if (!this.wfcBuffer) {
      console.error("WFC not initialized. Call init() first.");
      return false;
    }
    return this.wfcBuffer.collapseCell(index);
  }

  /**
   * Draws the current state of the WFC grid onto the canvas.
   * Applies transformations (rotation, reflection) dynamically for debugging.
   */
  draw() {
    const ctx = this.ctx;
    const wfcBuffer = this.wfcBuffer;
    const cols = wfcBuffer.cols;
    const rows = wfcBuffer.rows;
    const tiles = this.tiles;
    const cellSize = this.size;
    const offsetX = this.offset.x;
    const offsetY = this.offset.y;
    const grid = this.drawGrid;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = "#555";

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = y * cols + x;
        const drawX = x * cellSize + offsetX;
        const drawY = y * cellSize + offsetY;

        if (wfcBuffer.collapsed[index] !== -1) {
          const tileIndex = wfcBuffer.collapsedTile(index);

          const tile = tileIndex !== -1 ? tiles[tileIndex] : null;

          if (tile && tile.image) {
            const content = tile.image;
            const needsTransform =
              tile._rotation !== 0 || tile._reflectX || tile._reflectY;

            if (needsTransform) {
              ctx.save();

              const centerX = drawX + cellSize / 2;
              const centerY = drawY + cellSize / 2;
              ctx.translate(centerX, centerY);

              if (tile._rotation > 0) {
                ctx.rotate((tile._rotation * Math.PI) / 2);
              }

              if (tile._reflectX || tile._reflectY) {
                ctx.scale(tile._reflectX ? -1 : 1, tile._reflectY ? -1 : 1);
              }

              const halfSize = cellSize / 2;

              if (content instanceof Color) {
                ctx.fillStyle = `#${content.getHexString()}`;

                ctx.fillRect(-halfSize, -halfSize, cellSize, cellSize);
              } else {
                ctx.drawImage(
                  content,
                  -halfSize,
                  -halfSize,
                  cellSize,
                  cellSize
                );
              }

              ctx.restore();
            } else {
              if (content instanceof Color) {
                ctx.fillStyle = `#${content.getHexString()}`;
                ctx.fillRect(drawX, drawY, cellSize, cellSize);
              } else {
                ctx.drawImage(content, drawX, drawY, cellSize, cellSize);
              }
            }

            if (grid) ctx.strokeRect(drawX, drawY, cellSize, cellSize);
          } else {
            ctx.fillStyle = "magenta";
            ctx.fillRect(drawX, drawY, cellSize, cellSize);
            console.error(
              `Collapsed cell [${x}, ${y}] (index ${index}) has invalid tile index ${tileIndex} or missing content.`
            );
          }
        } else {
          ctx.strokeRect(drawX, drawY, cellSize, cellSize);

          const numOptions = wfcBuffer.options.size(index);
          const maxOptions = wfcBuffer.tiles.count;
          const entropyFactor = numOptions / maxOptions;

          const greyValue = Math.floor(50 + entropyFactor * 100);
          ctx.fillStyle = `rgba(${greyValue}, ${greyValue}, ${greyValue}, 0.7)`;
          ctx.fillRect(drawX, drawY, cellSize, cellSize);

          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `bold ${cellSize * 0.4}px sans-serif`;
          ctx.fillText(
            numOptions.toString(),
            drawX + cellSize / 2,
            drawY + cellSize / 2
          );

          ctx.fillStyle = "#cccccc";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.font = `${cellSize * 0.2}px sans-serif`;
          ctx.fillText(index.toString(), drawX + 2, drawY + 2);
        }
      }
    }
  }
}
