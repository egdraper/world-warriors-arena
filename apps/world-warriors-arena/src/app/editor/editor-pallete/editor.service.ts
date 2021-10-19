import { Injectable } from "@angular/core";
import { getBackgroundCollection, getObjectCollection } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { Cell, SpriteBackgroundTile, SpriteTile } from "../../models/cell.model";

@Injectable()
export class EditorService {
  public selectedAsset: SpriteTile
  public hoveringCell: Cell
  public selectedGrowableAsset: string = "DrawableDirtRoad"
  public layerID = 1
  public backgroundDirty = false
  

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