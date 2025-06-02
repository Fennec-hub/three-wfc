import { reactive, readonly } from "vue";
import {
  CompatibleEdges,
  Tile2DData,
  Tile2DState,
  TileData,
  TileEdge,
  TileImageTransformData,
  TileRotate,
  Tiles2DState,
  TileVirtualTransform,
} from "../types";
import { useDB } from "./useDB";
import {
  EDITOR_2D_EDGES,
  EDITOR_3D_EDGES,
  TILE_THUMB_SIZE,
  TILE_TYPE_2D,
} from "../constants";
import { imgFileProcessor } from "./utils/imgFileProcessor";
import { useToast } from "vue-toastification";
import { canvasToBlob } from "./utils/canvasToBlob";
import { imgSmoothResizer } from "./utils/imgSmoothResizer";

const db = useDB();
const state = reactive<Tiles2DState>({});
const readonlyState = readonly(state);

const toast = useToast();

const loadWorldTiles = async (worldID: number) => {
  unList();
  return db.getWorldTiles(worldID).then((tiles) => {
    if (tiles == null) return false;
    tiles.forEach(_parse);
    return true;
  });
};

const _parse = (tile: TileData) => {
  const thumb = URL.createObjectURL(tile.thumb);
  const tileState = { ...tile, thumb };
  const tileEntry = { [tile.id]: tileState };

  if ("original" in tile) {
    const original = URL.createObjectURL(tile.original);
    const image = URL.createObjectURL(tile.image);
    Object.assign(tileState, { original, image });
  }

  Object.assign(state, tileEntry);
};

const create = async (tile: Omit<TileData, "id">) => {
  const id = await db.createTile(tile);

  if (id != null) _parse({ id, ...tile } as TileData);

  return id;
};

const upload2D = async (files: File[], world: number) => {
  return Promise.all(
    files.map(async (file) => {
      const imgResult = await imgFileProcessor(file).catch(() => null);

      if (!imgResult) {
        toast.error(`Upload failed: ${file.name}`);
        return null;
      }

      const data: Omit<Tile2DData, "id"> = {
        world,
        type: TILE_TYPE_2D,
        enabled: true,
        name: file.name.replace(/\.[^/.]+$/, ""),
        weight: 20,
        rotation: [false, false, false],
        reflect: [false, false],
        original: file,
        image: imgResult.image,
        thumb: imgResult.thumb,
        crop: imgResult.crop,
        width: imgResult.width,
        height: imgResult.height,
        resize: 100,
        rotate: 0,
        flip: { x: false, y: false },
        top: [],
        right: [],
        bottom: [],
        left: [],
      };

      const id = await create(data);

      if (id == null) toast.error(`Upload failed: ${file.name}`);

      return id;
    })
  );
};

const unList = () => {
  for (const id in state) {
    dispose(id as unknown as number);
    delete state[id];
  }
};

const dispose = (id: number) => {
  URL.revokeObjectURL(state[id].thumb);

  if ("original" in state[id]) {
    URL.revokeObjectURL(state[id].image);
    URL.revokeObjectURL(state[id].original);
  }

  // if ("object" in state[id]) {
  //   // Dispose 3D object
  // }
};

const update = (
  id: number,
  changes: Partial<Omit<TileData, "image" | "original">>
) => {
  Object.assign(state[id], changes);
  db.updateTile(id, changes);
};

const updateImage = async (
  id: number,
  {
    canvas,
    coordinates,
    imageTransforms: { flip, rotate },
  }: TileImageTransformData
) => {
  const blob = await canvasToBlob(canvas);

  if (!blob) return null;

  const tile = state[id] as Tile2DState;
  const oldImageURL = tile.image;
  const oldThumbURL = tile.thumb;

  const imageURL = URL.createObjectURL(blob);
  const thumb =
    coordinates.width <= TILE_THUMB_SIZE
      ? blob
      : await imgSmoothResizer(imageURL);

  if (!thumb) return null;

  const tileData = {
    image: blob,
    thumb,
    crop: {
      x: coordinates.left,
      y: coordinates.top,
      size: coordinates.width,
    },
    flip: { x: flip.horizontal, y: flip.vertical },
    rotate: (rotate / 90) as TileRotate,
  };

  const tileState = {
    ...tileData,
    image: imageURL,
    thumb: URL.createObjectURL(thumb),
  };

  URL.revokeObjectURL(oldImageURL);
  URL.revokeObjectURL(oldThumbURL);

  Object.assign(state[id], tileState);
  db.updateTile(id, tileData);

  return true;
};

const updateEdge = (
  id: number,
  edge: TileEdge,
  index: number,
  color?: string
) => {
  const edgeColors = [...state[id][edge]];

  if (index === -1) edgeColors.push("#ffffff");
  else if (!color) edgeColors.splice(index, 1);
  else edgeColors.splice(index, 1, color);

  update(id, { [edge]: edgeColors });
};

const remove = (id: number) => {
  dispose(id);
  delete state[id];
  db.deleteTile(id);
};

const compatibleEdges = (id: number, transform?: TileVirtualTransform) => {
  const tile = state[id];
  const edges = tile.type === TILE_TYPE_2D ? EDITOR_2D_EDGES : EDITOR_3D_EDGES;

  const tilesList = Object.values(state);

  const compatibleEdges: Partial<CompatibleEdges> = {};
  edges.forEach((edge, index) => {
    compatibleEdges[edge] = [];
    if (tile[edge].length === 0) return;

    const adjacentEdge = edges[index ^ 1];

    tilesList.forEach((adjacentTile) => {
      if (adjacentTile[adjacentEdge].length === 0) return;

      const match = tile[edge].every(
        (value: string | number, index: number) =>
          adjacentTile[adjacentEdge][index] === value
      );
      if (match) {
        compatibleEdges[edge]!.push(adjacentTile.id);
      }
    });
  });

  return compatibleEdges;
};

export const useTiles = () => ({
  state: readonlyState,
  loadWorldTiles,
  upload2D,
  create,
  update,
  updateImage,
  updateEdge,
  remove,
  unList,
  compatibleEdges,
});
