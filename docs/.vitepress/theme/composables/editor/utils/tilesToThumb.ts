import { imgLoader } from "./imgLoader";

export const generateTilesThumb = async (
  sources: string[],
  width: number = 250,
  height: number = 150,
  max: number = 10
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = width;
  canvas.height = height;

  const count = Math.min(sources.length, max);

  const { rows, cols } = optimalDimensions(count, width, height);

  const cellWidth = width / cols;
  const cellHeight = height / rows;

  for (let i = 0; i < length; i++) {
    const tile = sources[i];
    const img = await imgLoader(sources[i]);
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = col * cellWidth;
    const y = row * cellHeight;

    drawFitImg(ctx, img, x, y, cellWidth, cellHeight);
  }

  return new Promise((res: (value: Blob | null) => void) => canvas.toBlob(res));
};

function optimalDimensions(
  count: number,
  width: number,
  height: number
): { rows: number; cols: number } {
  const aspect = width / height;
  const ideal = Math.sqrt(count);
  const range = [Math.max(1, Math.floor(ideal) - 1), Math.ceil(ideal) + 1];
  const length = range[1] - range[0] + 1;

  return Array.from({ length }, (_, i) => {
    const rows = range[0] + i;
    const cols = Math.ceil(count / rows);
    const efficiency = count / (rows * cols);
    const ratioMatch =
      1 - Math.abs(cols / rows - aspect) / Math.max(cols / rows, aspect);
    return { rows, cols, score: efficiency * 0.8 + ratioMatch * 0.2 };
  }).sort((a, b) => b.score - a.score)[0];
}

function drawFitImg(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.save();

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  const srcWidth = img.naturalWidth;
  const srcHeight = img.naturalHeight;

  const ratio = Math.max(width / srcWidth, height / srcHeight);

  const drawWidth = srcWidth * ratio;
  const drawHeight = srcHeight * ratio;

  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

  ctx.restore();

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);
}
