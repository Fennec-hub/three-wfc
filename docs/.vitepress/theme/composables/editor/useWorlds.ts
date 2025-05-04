import { reactive, readonly } from "vue";
import { WorldData, WorldState } from "../types";
import { useDB } from "./useDB";
import { useTiles } from "./useTiles";
import { generateTilesThumb } from "./utils/tilesToThumb";

const db = useDB();
const tiles = useTiles();

const state = reactive<Record<number, WorldState>>({});

const initialize = async () =>
  db.getWorlds().then((data) => data.forEach(parse));

const parse = (project: WorldData) => {
  const thumb = project.thumb && URL.createObjectURL(project.thumb);
  const entry = { [project.id]: { ...project, thumb } };

  Object.assign(state, entry);
};

const create = (project: WorldData) => {
  parse(project);
  db.createWorld(project);
};

const list = () => Object.keys(state);

const read = (id: number) => readonly(state[id]);

const update = (id: number, changes: Partial<WorldData>) => {
  Object.assign(state[id], changes);
  db.updateWorld(id, changes);
};

const thumb = async (id: number) => {
  const project = state[id];
  const projectImages = project.tiles.map((tile) => tiles.read(tile).image);
  const thumb = await generateTilesThumb(projectImages);

  if (!thumb) return null;

  project.thumb = URL.createObjectURL(thumb);
  update(id, { thumb });
};

const remove = (id: number) => {
  if (state[id].thumb) URL.revokeObjectURL(state[id].thumb);
  delete state[id];
  db.deleteWorld(id);
};

export const useWorlds = () => ({
  initialize,
  create,
  list,
  read,
  update,
  remove,
  thumb,
});
