import { Injectable } from "@angular/core";
import { getBackgroundCollection, getObjectCollection } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { SpriteBackgroundTile, SpriteTile } from "../../models/cell.model";

@Injectable()
export class EditorService {
  public selectedAsset: SpriteTile

  public findBackgroundCollection(category: string): SpriteBackgroundTile[] {
    return getBackgroundCollection(category)
  }

  public findObjectCollection(category: string): SpriteTile[] {
    return getObjectCollection(category)
  }
 
  public findBackgroundAsset(category: string, tileId: string): SpriteBackgroundTile {
    return getBackgroundCollection(category).find((tile: SpriteBackgroundTile) => tile.id === tileId)
  } 
 
  public findObjectAsset(category: string, tileId: string): SpriteTile {
    return getObjectCollection(category).find((tile: SpriteBackgroundTile) => tile.id === tileId)
  } 
} 