import { Object3D } from "three";
import {
  PROJECT_MODE_GRID,
  PROJECT_MODE_TILES,
  PROJECT_MODE_NONE,
  PROJECT_TYPE_2D,
  PROJECT_TYPE_3D,
  PROJECT_TYPE_ISOMETRIC,
} from "./constants";

export type ProjectType =
  | typeof PROJECT_TYPE_2D
  | typeof PROJECT_TYPE_ISOMETRIC
  | typeof PROJECT_TYPE_3D;

export type ProjectMode =
  | typeof PROJECT_MODE_NONE
  | typeof PROJECT_MODE_TILES
  | typeof PROJECT_MODE_GRID;

export type EditorTileEdges = (string | number)[];

export interface EditorState {
  projects: number[];
  project: number | null;
}

export interface ProjectState {
  id: number;
  name: string;
  thumb?: string;
  type: ProjectType;
  mode: ProjectMode;
  cols: number;
  rows: number;
  zoom: number;
  viewport: number[];
  tiles: number[];
}

export interface Tile2DState {
  id: number;
  project: number;
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

export interface ProjectData {
  id: number;
  thumb?: Blob;
  type: ProjectType;
  name: string;
  mode: ProjectMode;
  cols: number;
  rows: number;
  tiles: number[];
  tile: number | null;
  zoom: number;
  viewport: number[];
}

export interface Tile2DData {
  id: number;
  project: number;
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
