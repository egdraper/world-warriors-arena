import { CanvasService } from "./services/canvas.service";
import { CharacterEditorService } from "./services/character-editor.service";
import { EditorService } from "./services/editor.service";
import { AssetsService } from "./services/assets.service";
import { GameMarkersService } from "./services/game-markers.service";
import { DrawService } from "./services/draw.service";
import { Engine } from "./services/engine.service";
import { GridService } from "./services/map.service";
import { NewFogOfWarService } from "./services/new-visibility.service";
import { ShortestPath } from "./services/shortest-path.service";

export class GSM {
  public static Canvas: CanvasService
  public static Assets: AssetsService
  public static ShortestPath: ShortestPath
  public static Draw: DrawService
  public static Map: GridService
  public static Editor: EditorService
  public static FogOfWar: NewFogOfWarService
  public static Engine: Engine
  public static CharacterEditor: CharacterEditorService
  public static GameMarker: GameMarkersService
}