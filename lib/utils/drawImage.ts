export const drawImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  scale: number
) => {
  ctx.drawImage(img, x * scale, y * scale, size * scale, size * scale);
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  scale: number
) => {
  ctx.strokeStyle = "red";
  ctx.strokeRect(x * scale, y * scale, size * scale, size * scale);
};
