import { Injectable } from "@angular/core";
import { CanvasService } from "../../canvas/canvas.service";
import { CharacterEditorService } from "../../editor/character-edtor-palette/character-editor-pallete/character-editor.service";
import { EditorService } from "../../editor/editor-palette/editor.service";
import { AssetsService } from "../../game-assets/assets.service";
import { GridService } from "../grid.service";
import { NewFogOfWarService } from "../new-visibility.service";
import { FogOfWarService } from "../visibility.service";
import { AssetPainter } from "./painters/asset.paint";
import { BackgroundPainter } from "./painters/background.paint";
import { BlackOutEdgesPainter } from "./painters/black-out-edges.paint";
import { BlackOutFogPainter } from "./painters/black-out-fog.paint";
import { FogOfWarPainter } from "./painters/fog-of-war.paint";
import { GridLinePainter } from "./painters/grid-lines.paint";

@Injectable()
export class DrawService {
  public gridLinePainter: GridLinePainter
  public backgroundPainter: BackgroundPainter
  public blackOutEdgesPainter: BlackOutEdgesPainter
  public blackOutFogPainter: BlackOutFogPainter
  public fogOfWarPainter: FogOfWarPainter
  public assetPainter: AssetPainter

  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
    public fogOfWarService: FogOfWarService,
    public editorService: EditorService,
    public assetService: AssetsService,
    public characterEditorService: CharacterEditorService,
    public newFogOfWarService: NewFogOfWarService
  ) { 
    this.gridLinePainter = new GridLinePainter(canvasService, gridService, editorService)
    this.backgroundPainter = new BackgroundPainter(canvasService, gridService, editorService)
    this.blackOutEdgesPainter = new BlackOutEdgesPainter(canvasService, gridService)
    this.blackOutFogPainter = new BlackOutFogPainter(canvasService, gridService, assetService, newFogOfWarService)
    this.fogOfWarPainter = new FogOfWarPainter(canvasService, gridService, assetService, newFogOfWarService)
    this.assetPainter = new AssetPainter(canvasService, gridService, assetService, editorService, characterEditorService)
  }
}
