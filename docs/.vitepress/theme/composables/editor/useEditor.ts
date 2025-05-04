import { reactive, readonly } from "vue";
import { EditorMode, EditorState } from "../types";
import { useTiles } from "./useTiles";
import { useWorlds } from "./useWorlds";

import { EDITOR_MODE_WORLD } from "../constants";

const worlds = useWorlds();
const tiles = useTiles();

const state = reactive<EditorState>({
  world: null,
  mode: EDITOR_MODE_WORLD,
  expanded: false,
});

const initialize = worlds.initialize;
const setMode = (mode: EditorMode) => (state.mode = +mode as any);
const expand = (expand: boolean = true, mode?: EditorMode) => {
  if (!expand) setMode(EDITOR_MODE_WORLD);
  else if (mode != null) setMode(mode);

  state.expanded = expand;
};
const selectWorld = (id: number) => (state.world = id);

export const useEditor = () => ({
  state: readonly(state),
  initialize,
  setMode,
  expand,
  selectWorld,
});
