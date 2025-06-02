import { EditorMode, TileTransform } from "./types";

export const EDITOR_DB_NAME = "WFCEditorDB";
export const EDITOR_DB_VERSION = 1;

export const WORLD_TYPE_2D = 0;
export const WORLD_TYPE_ISOMETRIC = 1;
export const WORLD_TYPE_3D = 2;
export const WORLD_TYPES = {
  [WORLD_TYPE_2D]: { name: "2D", icon: "bi-square" },
  [WORLD_TYPE_ISOMETRIC]: { name: "Isometric", icon: "la-cubes-solid" },
  [WORLD_TYPE_3D]: { name: "3D", icon: "hi-solid-cube" },
};

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

export const EDITOR_2D_EDGES = ["top", "bottom", "left", "right"] as const;
export const EDITOR_3D_EDGES = [...EDITOR_2D_EDGES, "front", "back"] as const;

export const TILE_TYPE_2D = 0;
export const TILE_TYPE_ISOMETRIC = 1;
export const TILE_TYPE_3D = 2;

export const PANEL_POSITION_RIGHT = 0;
export const PANEL_POSITION_CENTER = 1;
export const PANEL_POSITION_TARGET = 2;

export const TILE_THUMB_SIZE = 100;

export const TILE_TRANSFORM_FLIP_X = 0;
export const TILE_TRANSFORM_FLIP_Y = 1;
export const TILE_TRANSFORM_ROTATION_90 = 2;
export const TILE_TRANSFORM_ROTATION_180 = 3;
export const TILE_TRANSFORM_ROTATION_270 = 4;

export const REFLECTION_OPTIONS = [
  {
    label: "Horizontal",
    icon: "md-flip-round",
    tooltip: "<b>Flip</b> horizontally",
    style: "scaleX(-1)",
  },
  {
    label: "Vertical",
    icon: "md-flip-round",
    tooltip: "<b>Flip</b> Vertically",
    style: "scaleX(-1)",
    iconStyle: "rotate(90deg)",
  },
] as const;

export const ROTATION_OPTIONS = [
  {
    label: "90°",
    icon: "md-rotateright-round",
    tooltip: "<b>Rotate</b> 90° clockwise",
    style: "rotate(90deg)",
    iconStyle: "rotate(90deg)",
  },
  {
    label: "180°",
    icon: "md-rotateright-round",
    tooltip: "<b>Rotate</b> 180° clockwise",
    style: "rotate(180deg)",
    iconStyle: "rotate(180deg)",
  },
  {
    label: "270°",
    icon: "md-rotateright-round",
    tooltip: "<b>Rotate</b> 270° clockwise",
    style: "rotate(270deg)",
    iconStyle: "rotate(270deg)",
  },
] as const;

export const TILE_TRANSFORMATION: Record<
  TileTransform,
  {
    label: string;
    icon: string;
    tooltip: string;
    style: string;
    iconStyle?: string;
  }
> = [...REFLECTION_OPTIONS, ...ROTATION_OPTIONS];

export const THREE_AXES = ["x", "y", "z"] as const;
