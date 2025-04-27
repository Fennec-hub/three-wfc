import { WFCTile2D } from "../WFCTile2D";

const EDGES = ["top", "bottom", "left", "right"] as const;

/**
 * Annotate tiles by sampling color + Sobel edge features for edges.
 *
 * @param tiles Array of WFCTile2D instances
 * @param tolerance Color quantization tolerance (0–1), ideally between 0.05 and 0.3 for slight shadow or antiaging correction.
 * @param sobelThreshold The sobel edge detection strength (0-100)
 *
 * @returns Annotated tiles
 */
export function annotateTiles2DEdges(
  tiles: WFCTile2D[],
  tolerance: number = 0.05,
  sobelThreshold: number = 30
): WFCTile2D[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  tolerance = tolerance * 255;

  for (const tile of tiles) {
    const image = tile.image;
    const width = (image as HTMLImageElement).naturalWidth || image.width;
    const height = (image as HTMLImageElement).naturalHeight || image.height;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);

    const edgeStrength = computeSobelMagnitude(ctx, width, height);

    for (const side of EDGES) {
      tile[side].length = 0;
      const segments = segmentFromGradient(edgeStrength[side], sobelThreshold);

      for (const [start, end] of segments) {
        if (side === "top" || side === "bottom") {
          const y = side === "top" ? 0 : height - 1;
          const xStart = Math.floor(start * width);
          const xEnd = Math.floor(end * width);
          const data = ctx.getImageData(xStart, y, xEnd - xStart, 1).data;
          tile[side].push(getAverageColor(data, tolerance));
        } else {
          const x = side === "left" ? 0 : width - 1;
          const yStart = Math.floor(start * height);
          const yEnd = Math.floor(end * height);
          const data = ctx.getImageData(x, yStart, 1, yEnd - yStart).data;
          tile[side].push(getAverageColor(data, tolerance));
        }
      }
    }
  }

  return tiles;
}
// === Helper functions ===

function segmentFromGradient(
  line: Float32Array,
  threshold: number
): [number, number][] {
  const segments: [number, number][] = [];
  let start = 0;
  let inSegment = false;
  const len = line.length;

  for (let i = 0; i < len; i++) {
    if (line[i] >= threshold) {
      if (!inSegment) {
        start = i;
        inSegment = true;
      }
    } else if (inSegment) {
      segments.push([start / len, i / len]);
      inSegment = false;
    }
  }

  if (inSegment) {
    segments.push([start / len, 1]);
  }

  return segments.length ? segments : [[0, 1]];
}

function quantizeChannel(value: number, tolerance: number): number {
  return Math.round(value / tolerance) * tolerance;
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  return `#${[r, g, b]
    .map((v) => Math.round(v).toString(16).padStart(2, "0"))
    .join("")}${a < 255 ? a.toString(16).padStart(2, "0") : ""}`;
}

function getAverageColor(data: Uint8ClampedArray, tolerance = 0): string {
  let r = 0,
    g = 0,
    b = 0,
    a = 0,
    count = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    a += data[i + 3];
  }
  r /= count;
  g /= count;
  b /= count;
  a /= count;
  if (tolerance > 0) {
    r = quantizeChannel(r, tolerance);
    g = quantizeChannel(g, tolerance);
    b = quantizeChannel(b, tolerance);
    a = a < 255 ? quantizeChannel(a, tolerance) : 255;
  }
  return rgbaToHex(r, g, b, a);
}

function computeSobelMagnitude(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number
) {
  const srcData = ctx.getImageData(0, 0, w, h).data;
  const gray = new Float32Array(w * h);

  // Convert to grayscale
  for (let i = 0; i < w * h; i++) {
    const offset = i * 4;
    gray[i] =
      0.299 * srcData[offset] +
      0.587 * srcData[offset + 1] +
      0.114 * srcData[offset + 2];
  }

  const magnitude = new Float32Array(w * h);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;

      const gx =
        -gray[i - w - 1] -
        2 * gray[i - 1] -
        gray[i + w - 1] +
        gray[i - w + 1] +
        2 * gray[i + 1] +
        gray[i + w + 1];

      const gy =
        -gray[i - w - 1] -
        2 * gray[i - w] -
        gray[i - w + 1] +
        gray[i + w - 1] +
        2 * gray[i + w] +
        gray[i + w + 1];

      magnitude[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  function extractEdgeLine(direction: "top" | "bottom" | "left" | "right") {
    const line =
      direction === "top" || direction === "bottom"
        ? new Float32Array(w)
        : new Float32Array(h);

    if (direction === "top") {
      for (let x = 0; x < w; x++) line[x] = magnitude[1 * w + x];
    } else if (direction === "bottom") {
      for (let x = 0; x < w; x++) line[x] = magnitude[(h - 2) * w + x];
    } else if (direction === "left") {
      for (let y = 0; y < h; y++) line[y] = magnitude[y * w + 1];
    } else if (direction === "right") {
      for (let y = 0; y < h; y++) line[y] = magnitude[y * w + (w - 2)];
    }

    return line;
  }

  return {
    top: extractEdgeLine("top"),
    bottom: extractEdgeLine("bottom"),
    left: extractEdgeLine("left"),
    right: extractEdgeLine("right"),
  };
}
