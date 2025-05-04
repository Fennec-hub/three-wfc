import { EditorMode } from "./types";

export const EDITOR_DB_NAME = "WFCEditorDB";
export const EDITOR_DB_VERSION = 1;

export const WORLD_TYPE_2D = 0;
export const WORLD_TYPE_ISOMETRIC = 1;
export const WORLD_TYPE_3D = 2;

export const EDITOR_MODE_COLLAPSE = -1;
export const EDITOR_MODE_WORLD = 0;
export const EDITOR_MODE_TILES = 1;
export const EDITOR_MODE_GRID = 2;

export const EDITOR_SECTIONS: Record<
  EditorMode,
  { name: string; icon: string }
> = {
  [EDITOR_MODE_WORLD]: { name: "World", icon: "gi-earth-africa-europe" },
  [EDITOR_MODE_TILES]: { name: "Tiles", icon: "hi-solid-puzzle" },
  [EDITOR_MODE_GRID]: { name: "Grid", icon: "md-gridon-outlined" },
};
