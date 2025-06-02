import { computed, nextTick, reactive, readonly } from "vue";
import {
  EditorMode,
  EditorState,
  PanelPosition,
  Tile2DData,
  Tile2DState,
  Tile3DData,
  Tile3DState,
  TileEdge,
  TileImageTransformData,
  Tiles2DState,
  TileVirtualTransform,
  WorldData,
} from "../types";

import {
  EDITOR_MODE_TILES,
  EDITOR_MODE_WORLD,
  PANEL_POSITION_CENTER,
  PANEL_POSITION_RIGHT,
  PANEL_POSITION_TARGET,
} from "../constants";
import { useWorlds } from "./useWorlds";
import { useTiles } from "./useTiles";

const worlds = useWorlds();
const tiles = useTiles();

const state = reactive<EditorState>({
  loading: true,
  error: false,
  selectedWorld: null,
  selectedTile: null,
  selectedTransform: null,
  mode: EDITOR_MODE_WORLD,
  position: PANEL_POSITION_CENTER,
  expanded: true,
  compatible: {
    top: [],
    right: [],
    bottom: [],
    left: [],
    front: [],
    back: [],
  },
});

const readonlyState = readonly(state);
const worldsCount = computed(() => Object.keys(worlds.state).length);
const tilesCount = computed(() => Object.keys(tiles.state).length);

const initialize = async () => {
  const loaded = await worlds.initialize();

  if (!loaded) return _triggerError();

  if (worldsCount.value === 1) selectWorld(Object.values(worlds.state)[0].id);
  else setMode(EDITOR_MODE_WORLD);

  state.loading = false;
};

const setMode = (mode: EditorMode) => {
  state.mode = mode;

  if (mode === EDITOR_MODE_WORLD || !worldsCount.value || !tilesCount.value)
    return setPosition();
  console.log("setMode", mode);
  if (mode === EDITOR_MODE_TILES) {
    console.log("EDITOR_MODE_TILES");
    if (state.selectedTile == null)
      selectTile(Object.values(tiles.state)[0].id);
    setPosition(PANEL_POSITION_TARGET);
    return;
  }

  setPosition(PANEL_POSITION_RIGHT);
};

const setPosition = (position: PanelPosition = PANEL_POSITION_CENTER) =>
  (state.position = position);

const expand = (expand: boolean = true, mode?: EditorMode) => {
  if (!expand) setMode(EDITOR_MODE_WORLD);
  else if (mode != null) setMode(mode);

  state.expanded = expand;
};

const selectWorld = async (id: number | null) => {
  if (id === null) {
    state.selectedWorld = null;
    state.selectedTile = null;
    tiles.unList();
    setMode(EDITOR_MODE_WORLD);
    return;
  }

  if (id !== state.selectedWorld) {
    const loadedTiles = await tiles.loadWorldTiles(id);
    if (!loadedTiles) return _triggerError();
    state.selectedWorld = id;
  }

  setMode(EDITOR_MODE_TILES);
};

const createWorld = async (world: Omit<WorldData, "id">) => {
  const id = await worlds.create(world);
  if (id == null) return _triggerError();
  selectWorld(id);
};

const createTiles2D = async (files: File[]) => {
  const worldID = state.selectedWorld;
  if (worldID == null) return false;

  tiles.upload2D(files, worldID).then((tileList) => {
    tileList = tileList.filter((tile) => !!tile);
    if (!tileList.length) return;

    worlds.setTiles(worldID, tiles.state as Readonly<Tiles2DState>);
    selectTile(tileList[tileList.length - 1]!);
  });
};

const selectTile = (
  id: number | null,
  transform: TileVirtualTransform | null = null
) => {
  state.selectedTile = id;
  state.selectedTransform = transform;
  if (id != null) _setCompatibleEdges(id);
};

const updateTile = (id: number, changes: Partial<Tile2DData | Tile3DData>) => {
  tiles.update(id, changes);
  _setCompatibleEdges(id);
};

const updateTileImage = async (
  id: number,
  imageTransformData: TileImageTransformData
) => {
  const result = await tiles.updateImage(id, imageTransformData);
  if (result)
    worlds.setTiles(
      tiles.state[id].world,
      tiles.state as Readonly<Tiles2DState>
    );
};

const updateTileEdge = (
  id: number,
  edge: TileEdge,
  index: number,
  color?: string
) => {
  tiles.updateEdge(id, edge, index, color);
  _setCompatibleEdges(id);
};

const removeWorld = (id: number) => {
  worlds.remove(id);
  selectWorld(null);
};

const removeTile = async (id: number) => {
  const tile = tiles.state[id];

  if (state.selectedTile === id) {
    const tileValues = Object.values(tiles.state);
    const index = tileValues.indexOf(tile);

    if (index === -1) {
      selectTile(null);
      return;
    }

    const nextIndex =
      index < tileValues.length - 1 ? index + 1 : index > 0 ? index - 1 : null;

    selectTile(nextIndex != null ? tileValues[nextIndex].id : null);
  }

  tiles.remove(id);
  worlds.setTiles(tile.world, tiles.state as Readonly<Tiles2DState>);
};

const _triggerError = () => {
  setPosition();
  state.error = true;
};

const _setCompatibleEdges = (id: number, transform?: TileVirtualTransform) => {
  const compatibleEdges = tiles.compatibleEdges(id, transform);
  Object.entries(compatibleEdges).forEach(([edge, tiles]) => {
    state.compatible[edge].length = 0;
    state.compatible[edge].push(...tiles);
  });
};

export const useEditor = <T extends "2D" | "3D" = "2D">() => ({
  state: readonlyState,
  worlds: worlds.state,
  tiles: tiles.state as unknown as T extends "2D" ? Tile2DState : Tile3DState,
  worldsCount,
  tilesCount,
  initialize,
  setMode,
  expand,
  createWorld,
  updateWorld: worlds.update,
  selectWorld,
  createTiles2D,
  updateTile,
  updateTileImage,
  updateTileEdge,
  selectTile,
  setPosition,
  removeWorld,
  removeTile,
});
