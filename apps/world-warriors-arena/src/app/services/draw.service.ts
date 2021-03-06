import { Injectable } from "@angular/core";
import { AssetPainter } from "../painters/asset.paint";
import { BlackOutEdgesPainter } from "../painters/black-out-edges.paint";
import { BlackOutFogPainter } from "../painters/black-out-fog.paint";
import { FogOfWarPainter } from "../painters/fog-of-war.paint";
import { GridLinePainter } from "../painters/grid-lines.paint";
import { MovingAssetPainter } from "../painters/moving-asset.paint";
import { GameMarkerPainter } from "../painters/portal-tokens.paint";

@Injectable()
export class DrawService {
  public gridLinePainter: GridLinePainter
  public blackOutEdgesPainter: BlackOutEdgesPainter
  public blackOutFogPainter: BlackOutFogPainter
  public fogOfWarPainter: FogOfWarPainter
  public assetPainter: AssetPainter
  public gameMarkerPainter: GameMarkerPainter
  public movingAsset: MovingAssetPainter

  constructor(
  ) { 
    this.gridLinePainter = new GridLinePainter()
    this.blackOutEdgesPainter = new BlackOutEdgesPainter()
    this.blackOutFogPainter = new BlackOutFogPainter()
    this.fogOfWarPainter = new FogOfWarPainter()
    this.assetPainter = new AssetPainter()
    this.gameMarkerPainter = new GameMarkerPainter()
    this.movingAsset = new MovingAssetPainter()
  }
}
