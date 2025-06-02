export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((res: (value: Blob | null) => void) => canvas.toBlob(res));
