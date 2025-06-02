import { canvasToBlob } from "./canvasToBlob";

export const imgCropper = (
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number
): Promise<Blob | null> => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, x, y, size, size, 0, 0, size, size);

  return canvasToBlob(canvas);
};
