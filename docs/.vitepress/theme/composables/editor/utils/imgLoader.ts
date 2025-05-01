export const imgLoader = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve: (value: HTMLImageElement) => void, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });

export const imgLoaderBatch = (srcs: string[]): Promise<HTMLImageElement[]> =>
  Promise.all(srcs.map((src) => imgLoader(src)));
