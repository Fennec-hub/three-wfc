import { Object3D } from "three";
import {
  EDITOR_3D_EDGES,
  EDITOR_MODE_GRID,
  EDITOR_MODE_TILES,
  EDITOR_MODE_WORLD,
  PANEL_POSITION_CENTER,
  PANEL_POSITION_RIGHT,
  PANEL_POSITION_TARGET,
  THREE_AXES,
  TILE_TRANSFORM_FLIP_X,
  TILE_TRANSFORM_FLIP_Y,
  TILE_TRANSFORM_ROTATION_180,
  TILE_TRANSFORM_ROTATION_270,
  TILE_TRANSFORM_ROTATION_90,
  TILE_TYPE_2D,
  TILE_TYPE_3D,
  WORLD_TYPE_2D,
  WORLD_TYPE_3D,
  WORLD_TYPE_ISOMETRIC,
} from "./constants";

export type EditorMode =
  | typeof EDITOR_MODE_WORLD
  | typeof EDITOR_MODE_TILES
  | typeof EDITOR_MODE_GRID;

export type WorldType =
  | typeof WORLD_TYPE_2D
  | typeof WORLD_TYPE_ISOMETRIC
  | typeof WORLD_TYPE_3D;

export type PanelPosition =
  | typeof PANEL_POSITION_RIGHT
  | typeof PANEL_POSITION_CENTER
  | typeof PANEL_POSITION_TARGET;

export type TileTransform =
  | typeof TILE_TRANSFORM_FLIP_X
  | typeof TILE_TRANSFORM_FLIP_Y
  | typeof TILE_TRANSFORM_ROTATION_90
  | typeof TILE_TRANSFORM_ROTATION_180
  | typeof TILE_TRANSFORM_ROTATION_270;

export type TileVirtualTransform = [
  transform: TileTransform,
  axis: TileTransformAxis
];

export type TileTransformAxis = (typeof THREE_AXES)[number];

export type EditorTileType = typeof TILE_TYPE_2D | typeof TILE_TYPE_3D;

export type EditorTileEdges = (string | number)[];

export interface EditorState {
  loading: boolean;
  error: boolean;
  selectedWorld: number | null;
  selectedTile: number | null;
  selectedTransform: TileVirtualTransform | null;
  mode: EditorMode;
  expanded: boolean;
  position: PanelPosition;
  compatible: CompatibleEdges;
}

export interface WorldData {
  id: number;
  thumb?: Blob;
  type: WorldType;
  name: string;
  mode: EditorMode;
  cols: number;
  rows: number;
  tile: number | null;
  zoom: number;
  viewport: number[];
  tiles: number;
}

export interface WorldState extends Omit<WorldData, "thumb"> {
  thumb?: string;
}

export interface TileBaseData {
  id: number;
  enabled: boolean;
  type: EditorTileType;
  world: number;
  weight: number;
  name: string;
  thumb: Blob;
  top: EditorTileEdges;
  right: EditorTileEdges;
  bottom: EditorTileEdges;
  left: EditorTileEdges;
}

export interface Tile2DData extends TileBaseData {
  type: typeof TILE_TYPE_2D;
  image: Blob;
  original: Blob;
  rotation: [boolean, boolean, boolean];
  reflect: [boolean, boolean];
  width: number;
  height: number;
  resize: number;
  rotate: TileRotate;
  flip: TileFlip;
  crop: TileCrop;
}

export interface Tile3DData extends TileBaseData {
  type: typeof TILE_TYPE_3D;
  object: Blob;
  front: EditorTileEdges;
  back: EditorTileEdges;
}

export interface TileBaseState extends Omit<TileBaseData, "thumb"> {
  thumb: string;
}

export interface Tile2DState
  extends Omit<Tile2DData, "thumb" | "image" | "original"> {
  thumb: string;
  image: string;
  original: string;
}

export interface Tile3DState extends Omit<Tile3DData, "thumb" | "object"> {
  thumb: string;
  object: Object3D;
}

export type TileState = Tile2DState | Tile3DState;

export type Tiles2DState = Record<number, Tile2DState>;
export type Tiles3DState = Record<number, Tile3DState>;
export type WorldsState = Record<number, WorldState>;

export type CompatibleEdges = {
  top: number[];
  right: number[];
  bottom: number[];
  left: number[];
  front: number[];
  back: number[];
};
export type TileData = Tile2DData | Tile3DData;
export type TileEdge = (typeof EDITOR_3D_EDGES)[number];
export type TileCrop = { x: number; y: number; size: number };
export type TileFlip = { x: boolean; y: boolean };
export type TileRotate = 0 | 1 | 2 | 3;
export type TileImageTransformData = {
  canvas: HTMLCanvasElement;
  coordinates: { width: number; height: number; left: number; top: number };
  imageTransforms: {
    rotate: number;
    flip: { horizontal: boolean; vertical: boolean };
  };
};
