import Dexie, { type EntityTable } from "dexie";
import { ProjectData, ProjectState, Tile2DData, TileData3D } from "../types";
import { EDITOR_DB_NAME, EDITOR_DB_VERSION } from "../constants";
import { loadBlob } from "./utils/loadBlob";
import { Object3D } from "three";

class EditorDB {
  private readonly db: Dexie & {
    project: EntityTable<ProjectData, "id">;
    tile: EntityTable<Tile2DData | TileData3D, "id">;
  };
  private readonly project: EntityTable<ProjectData, "id">;
  private readonly tile: EntityTable<Tile2DData | TileData3D, "id">;

  constructor() {
    this.db = new Dexie(EDITOR_DB_NAME) as Dexie & {
      project: EntityTable<ProjectData, "id">;
      tile: EntityTable<Tile2DData | TileData3D, "id">;
    };

    this.db.version(EDITOR_DB_VERSION).stores({
      project: "++id, type",
      tile: "++id",
    });

    this.project = this.db.project;
    this.tile = this.db.tile;
  }

  async createProject(project: Omit<ProjectData, "id">) {
    return this.project.add(project).catch(() => null);
  }

  async createTile(tile: Omit<Tile2DData | TileData3D, "id">) {
    return this.tile.add(tile).catch(() => null);
  }

  async getProject(id: number) {
    return this.project.get(id).catch(() => undefined);
  }

  async getProjects() {
    return this.project.toArray();
  }

  async getProjectTiles(project: ProjectData) {
    return this.tile
      .where("id")
      .anyOf(project.tiles)
      .toArray()
      .catch(() => []);
  }

  async getTile<T extends Tile2DData | TileData3D>(
    id: number
  ): Promise<T | undefined> {
    return this.tile.get(id).catch(() => undefined) as Promise<T | undefined>;
  }

  async updateProject(id: number, changes: Partial<Omit<ProjectData, "id">>) {
    return this.project.update(id, changes).catch(() => null);
  }

  async projectThumb(id: number, thumb: Blob) {
    return this.project
      .update(id, { thumb })
      .then(() => true)
      .catch(() => false);
  }

  async updateTile(id: number, changes: Partial<Omit<Tile2DData, "id">>) {
    return this.tile.update(id, changes).catch(() => null);
  }

  async tileImage(id: number, image: string) {
    return loadBlob(image)
      .then((blob) => this.tile.update(id, { image: blob }))
      .then(() => true)
      .catch(() => false);
  }

  async tileObject(id: number, object: Object3D) {
    // Object3D to blob
    return null;
  }

  async deleteProject(id: number) {
    return this.project
      .get(id)
      .then(
        (project) =>
          !!(project && this.tile.where("id").anyOf(project.tiles).delete())
      )
      .catch(() => false);
  }

  async deleteTile(projectID: number, tileID: number) {
    try {
      const project = await this.getProject(projectID);
      if (project)
        this.updateProject(projectID, {
          tiles: project.tiles.filter((tile) => tile !== tileID),
        });

      await this.tile.delete(tileID);
      return true;
    } catch (error) {
      return false;
    }
  }

  async clear() {
    return this.db
      .delete()
      .then(() => this.db.open())
      .catch(() => null);
  }
}

const editorDB = new EditorDB();

export const useDB = () => editorDB;
