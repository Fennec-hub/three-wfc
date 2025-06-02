import { TILE_THUMB_SIZE } from "../../constants";
import { imgLoader } from "./imgLoader";

export const imgSmoothResizer = async (
  source: string | HTMLImageElement,
  resize: number = TILE_THUMB_SIZE,
  pixelRatio: boolean = true
): Promise<Blob | null> => {
  const image =
    typeof source === "string"
      ? await imgLoader(source).catch(() => null)
      : source;

  if (!image) return null;

  resize *= pixelRatio ? window.devicePixelRatio : 1;

  const { naturalWidth: width, naturalHeight: height } = image;

  let currentCanvas = document.createElement("canvas");
  currentCanvas.width = width;
  currentCanvas.height = height;
  let ctx = currentCanvas.getContext("2d")!;

  ctx.drawImage(image, 0, 0);

  while (currentCanvas.width * 0.5 > resize) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = currentCanvas.width * 0.5;
    tempCanvas.height = currentCanvas.height * 0.5;

    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = "high";

    tempCtx.drawImage(currentCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
    currentCanvas = tempCanvas;
  }

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = resize;
  finalCanvas.height = resize;

  const finalCtx = finalCanvas.getContext("2d")!;
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = "high";

  finalCtx.drawImage(
    currentCanvas,
    0,
    0,
    finalCanvas.width,
    finalCanvas.height
  );

  return new Promise((res: (value: Blob | null) => void) =>
    finalCanvas.toBlob(res)
  );
};
