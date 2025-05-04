import { reactive, readonly } from "vue";
import {
  WorldData,
  Tile2DState,
  Tile3DState,
  Tile2DData,
  TileData3D,
} from "../types";
import { useDB } from "./useDB";

const db = useDB();
const state = reactive<Record<number, Tile2DState | Tile3DState>>({});

const load = async (project: WorldData) => {
  unList();
  db.getWorldTiles(project).then((tiles) => tiles.forEach(parse));
};

const parse = (tile: Tile2DData | TileData3D) => {
  const image = tile.image && URL.createObjectURL(tile.image);
  const entry = { [tile.id]: { ...tile, image } };

  Object.assign(state, entry);
};

const create = (tile: Tile2DData | TileData3D) => {
  parse(tile);
  db.createTile(tile);
};

const list = () => Object.keys(state);
const unList = () => {
  for (const id in state) {
    dispose(id as unknown as number);
    delete state[id];
  }
};
const dispose = (id: number) => {
  URL.revokeObjectURL(state[id].image);

  // if ("object" in state[id]) {
  //   // Dispose 3D object
  // }
};

const read = (id: number) => readonly(state[id]);

const update = (id: number, changes: Partial<Tile2DData | TileData3D>) => {
  Object.assign(state[id], changes);
  db.updateTile(id, changes);
};

const remove = (project: number, id: number) => {
  dispose(id);
  db.deleteTile(project, id);
};

const updateEdge = (
  tile: number,
  edge: number,
  values: (number | string)[]
) => {
  state[tile][edge].length = 0;
  state[tile][edge].push(...values);
  db.updateTile(tile, { [edge]: values });
};

export const useTiles = () => ({
  load,
  create,
  list,
  read,
  update,
  remove,
  unList,
  updateEdge,
});
