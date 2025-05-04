import Dexie, { type EntityTable } from "dexie";
import { WorldData, WorldState, Tile2DData, TileData3D } from "../types";
import { EDITOR_DB_NAME, EDITOR_DB_VERSION } from "../constants";
import { blobLoader } from "./utils/blobLoader";
import { Object3D } from "three";

class EditorDB {
  private readonly db: Dexie & {
    world: EntityTable<WorldData, "id">;
    tile: EntityTable<Tile2DData | TileData3D, "id">;
  };
  private readonly world: EntityTable<WorldData, "id">;
  private readonly tile: EntityTable<Tile2DData | TileData3D, "id">;

  constructor() {
    this.db = new Dexie(EDITOR_DB_NAME) as Dexie & {
      world: EntityTable<WorldData, "id">;
      tile: EntityTable<Tile2DData | TileData3D, "id">;
    };

    this.db.version(EDITOR_DB_VERSION).stores({
      world: "++id, type",
      tile: "++id",
    });

    this.world = this.db.world;
    this.tile = this.db.tile;
  }

  async createWorld(world: Omit<WorldData, "id">) {
    return this.world.add(world).catch(() => null);
  }

  async createTile(tile: Omit<Tile2DData | TileData3D, "id">) {
    return this.tile.add(tile).catch(() => null);
  }

  async getWorld(id: number) {
    return this.world.get(id).catch(() => undefined);
  }

  async getWorlds() {
    return this.world.toArray();
  }

  async getWorldTiles(world: WorldData) {
    return this.tile
      .where("id")
      .anyOf(world.tiles)
      .toArray()
      .catch(() => []);
  }

  async getTile<T extends Tile2DData | TileData3D>(
    id: number
  ): Promise<T | undefined> {
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

  async updateTile(id: number, changes: Partial<Omit<Tile2DData, "id">>) {
    return this.tile.update(id, changes).catch(() => null);
  }

  async tileImage(id: number, image: string) {
    return blobLoader(image)
      .then((blob) => this.tile.update(id, { image: blob }))
      .then(() => true)
      .catch(() => false);
  }

  async tileObject(id: number, object: Object3D) {
    // Object3D to blob
    return null;
  }

  async deleteWorld(id: number) {
    return this.world
      .get(id)
      .then(
        (world) =>
          !!(world && this.tile.where("id").anyOf(world.tiles).delete())
      )
      .catch(() => false);
  }

  async deleteTile(worldID: number, tileID: number) {
    try {
      const world = await this.getWorld(worldID);
      if (world)
        this.updateWorld(worldID, {
          tiles: world.tiles.filter((tile) => tile !== tileID),
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
