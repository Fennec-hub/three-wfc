import smartcrop from "smartcrop";
import { imgLoader } from "./imgLoader";
import { imgSmoothResizer } from "./imgSmoothResizer";
import { imgCropper } from "./imgCropper";
import { TILE_THUMB_SIZE } from "../../constants";

export const imgFileProcessor = async (file: Blob) => {
  const originalURL = URL.createObjectURL(file);
  const image = await imgLoader(originalURL);

  const { naturalWidth: width, naturalHeight: height } = image;

  const size = Math.min(width, height);
  const resizeThumb = width > TILE_THUMB_SIZE || height > TILE_THUMB_SIZE;

  if (width === height) {
    const thumb =
      width <= TILE_THUMB_SIZE && height <= TILE_THUMB_SIZE
        ? file
        : await imgSmoothResizer(image);

    URL.revokeObjectURL(originalURL);

    return !thumb
      ? null
      : { image: file, thumb, width, height, crop: { x: 0, y: 0, size } };
  }

  const result = await smartcrop
    .crop(image, {
      width: size,
      height: size,
      minScale: 1,
      ruleOfThirds: true,
    })
    .catch(() => null);

  if (!result) {
    URL.revokeObjectURL(originalURL);
    return null;
  }

  const { x, y, width: cropSize } = result.topCrop;

  const cropped = await imgCropper(image, x, y, cropSize);

  if (!cropped) {
    URL.revokeObjectURL(originalURL);
    return null;
  }

  const croppedURL = URL.createObjectURL(cropped);
  const thumb =
    cropSize <= TILE_THUMB_SIZE ? cropped : await imgSmoothResizer(croppedURL);

  URL.revokeObjectURL(originalURL);
  URL.revokeObjectURL(croppedURL);

  if (!thumb) return null;

  return { image: cropped, thumb, width, height, crop: { x, y, size } };
};
