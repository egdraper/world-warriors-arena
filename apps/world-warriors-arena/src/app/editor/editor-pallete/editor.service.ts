import { Injectable } from "@angular/core";
import { SpriteTile } from "../../models/assets.model";
import { TileAssets } from "../../game-assets/tile-assets.db";

@Injectable()
export class EditorService {
  public selectedAsset: SpriteTile
  public getAsset(name: string): SpriteTile {
    return TileAssets[name]
  }
} 