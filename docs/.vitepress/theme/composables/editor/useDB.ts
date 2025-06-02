import Dexie, { type EntityTable } from "dexie";
import { WorldData, TileData } from "../types";
import { EDITOR_DB_NAME, EDITOR_DB_VERSION } from "../constants";
import { Object3D } from "three";

class EditorDB {
  private readonly db: Dexie & {
    world: EntityTable<WorldData, "id">;
    tile: EntityTable<TileData, "id">;
  };
  private readonly world: EntityTable<WorldData, "id">;
  private readonly tile: EntityTable<TileData, "id">;

  constructor() {
    this.db = new Dexie(EDITOR_DB_NAME) as Dexie & {
      world: EntityTable<WorldData, "id">;
      tile: EntityTable<TileData, "id">;
    };

    this.db.version(EDITOR_DB_VERSION).stores({
      world: "++id, type",
      tile: "++id, world",
    });

    this.world = this.db.world;
    this.tile = this.db.tile;
  }

  async createWorld(world: Omit<WorldData, "id">) {
    return this.world.add(world).catch(() => null);
  }

  async createTile(tile: Omit<TileData, "id">) {
    return this.tile.add(tile).catch(() => null);
  }

  async getWorld(id: number) {
    return this.world.get(id).catch(() => undefined);
  }

  async getWorlds() {
    return this.world.toArray();
  }

  async getWorldTiles(id: number) {
    return this.tile
      .where("world")
      .equals(id)
      .toArray()
      .catch(() => null);
  }

  async getTile<T extends TileData>(id: number): Promise<T | undefined> {
    return this.tile.get(id).catch(() => undefined) as Promise<T | undefined>;
  }

  async updateWorld(id: number, changes: Partial<Omit<WorldData, "id">>) {
    return this.world.update(id, changes).catch(() => null);
  }

  async worldThumb(id: number, thumb: Blob) {
    return this.world
      .update(id, { thumb })
      .then(() => true)
      .catch(() => false);
  }

  async updateTile(id: number, changes: Partial<Omit<TileData, "id">>) {
    return this.tile.update(id, changes).catch(() => null);
  }

  async tileImage(id: number, image: Blob) {
    return this.tile
      .update(id, { image })
      .then(() => true)
      .catch(() => false);
  }

  async tileObject(id: number, object: Object3D) {
    // Object3D to blob
    return null;
  }

  async deleteWorld(id: number) {
    return this.world
      .delete(id)
      .then(async () => await this.tile.where({ world: id }).delete())
      .then(() => true)
      .catch(() => false);
  }

  async deleteTile(tileID: number) {
    return this.tile
      .delete(tileID)
      .then(() => true)
      .catch(() => false);
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
