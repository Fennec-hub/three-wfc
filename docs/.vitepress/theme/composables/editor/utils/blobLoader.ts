export const blobLoader = async (url: string) =>
  fetch(url).then((res) => res.blob());
