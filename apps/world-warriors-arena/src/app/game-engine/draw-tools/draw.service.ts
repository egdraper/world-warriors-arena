import { Injectable } from "@angular/core";
import { AssetPainter } from "./painters/asset.paint";
import { BackgroundPainter } from "./painters/background.paint";
import { BlackOutEdgesPainter } from "./painters/black-out-edges.paint";
import { BlackOutFogPainter } from "./painters/black-out-fog.paint";
import { FogOfWarPainter } from "./painters/fog-of-war.paint";
import { GridLinePainter } from "./painters/grid-lines.paint";
import { GameMarkerPainter } from "./painters/portal-tokens.paint";

@Injectable()
export class DrawService {
  public gridLinePainter: GridLinePainter
  public backgroundPainter: BackgroundPainter
  public blackOutEdgesPainter: BlackOutEdgesPainter
  public blackOutFogPainter: BlackOutFogPainter
  public fogOfWarPainter: FogOfWarPainter
  public assetPainter: AssetPainter
  public gameMarkerPainter: GameMarkerPainter

  constructor(
  ) { 
    this.gridLinePainter = new GridLinePainter()
    this.backgroundPainter = new BackgroundPainter()
    this.blackOutEdgesPainter = new BlackOutEdgesPainter()
    this.blackOutFogPainter = new BlackOutFogPainter()
    this.fogOfWarPainter = new FogOfWarPainter()
    this.assetPainter = new AssetPainter()
    this.gameMarkerPainter = new GameMarkerPainter()
  }
}
