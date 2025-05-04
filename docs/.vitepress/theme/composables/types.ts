import { Object3D } from "three";
import {
  EDITOR_MODE_GRID,
  EDITOR_MODE_TILES,
  EDITOR_MODE_WORLD,
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

export type EditorTileEdges = (string | number)[];

export interface EditorState {
  world: number | null;
  mode: EditorMode;
  expanded: boolean;
}

export interface WorldState {
  id: number;
  name: string;
  thumb?: string;
  type: WorldType;
  mode: EditorMode;
  cols: number;
  rows: number;
  zoom: number;
  viewport: number[];
  tiles: number[];
}

export interface Tile2DState {
  id: number;
  world: number;
  name: string;
  image: string;
  top: EditorTileEdges;
  right: EditorTileEdges;
  bottom: EditorTileEdges;
  left: EditorTileEdges;
}

export interface Tile3DState extends Tile2DState {
  object: Object3D;
  front: EditorTileEdges;
  back: EditorTileEdges;
}

export type TileState = Tile2DState | Tile3DState;

export interface WorldData {
  id: number;
  thumb?: Blob;
  type: WorldType;
  name: string;
  mode: EditorMode;
  cols: number;
  rows: number;
  tiles: number[];
  tile: number | null;
  zoom: number;
  viewport: number[];
}

export interface Tile2DData {
  id: number;
  world: number;
  name: string;
  image: Blob;
  top: EditorTileEdges;
  right: EditorTileEdges;
  bottom: EditorTileEdges;
  left: EditorTileEdges;
  author?: number;
}

export interface TileData3D extends Tile2DData {
  blob: Blob;
  front: EditorTileEdges;
  back: EditorTileEdges;
}
