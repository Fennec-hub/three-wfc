export const loadBlob = async (url: string) =>
  fetch(url).then((res) => res.blob());
