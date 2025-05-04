export const imgLoader = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve: (value: HTMLImageElement) => void, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = source;
  });

export const imgLoaderBatch = (
  sources: string[]
): Promise<HTMLImageElement[]> =>
  Promise.all(sources.map((src) => imgLoader(src)));
