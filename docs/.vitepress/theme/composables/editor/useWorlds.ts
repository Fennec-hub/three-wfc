import { reactive, readonly } from "vue";
import {
  Tiles2DState,
  TileState,
  WorldData,
  WorldsState,
  WorldState,
} from "../types";
import { useDB } from "./useDB";
import { tilesToThumb } from "./utils/tilesToThumb";

const db = useDB();

const state = reactive<WorldsState>({});
const readonlyState = readonly(state);

const initialize = () =>
  db
    .getWorlds()
    .then((data) => data.forEach(_parse))
    .then(() => true)
    .catch(() => false);

const _parse = (world: WorldData) => {
  const thumb = world.thumb && URL.createObjectURL(world.thumb);
  const entry = { [world.id]: { ...world, thumb } };

  Object.assign(state, entry);
};

const create = async (world: Omit<WorldData, "id">) => {
  const id = await db.createWorld(world);

  if (id != null) _parse({ ...world, id });

  return id;
};

const update = (id: number, changes: Partial<WorldData>) => {
  Object.assign(state[id], changes);
  db.updateWorld(id, changes);
};

const setTiles = async (id: number, tiles: Readonly<Tiles2DState>) => {
  const worldImages = Object.values(tiles).map((tile) => tile.thumb);

  update(id, { tiles: worldImages.length });

  const thumb = await tilesToThumb(worldImages).catch(() => null);

  if (!thumb) return null;

  _dispose(id);

  Object.assign(state[id], { thumb: URL.createObjectURL(thumb) });
  db.updateWorld(id, { thumb });
};

const remove = (id: number) => {
  _dispose(id);
  db.deleteWorld(id);
  delete state[id];
};

const _dispose = (id: number) => {
  if (state[id].thumb) URL.revokeObjectURL(state[id].thumb);
};

export const useWorlds = () => ({
  state: readonlyState,
  initialize,
  create,
  update,
  remove,
  setTiles,
});
