import { Injectable } from "@angular/core";
import { TileAssets } from "../../game-assets/tile-assets.db";
import { SpriteTile } from "../../models/cell.model";

@Injectable()
export class EditorService {
  public selectedAsset: SpriteTile
  public getAsset(name: string): SpriteTile | SpriteTile[] {
    return TileAssets[name]
  }
} 