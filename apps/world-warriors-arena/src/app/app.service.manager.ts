import { CanvasService } from "./canvas/canvas.service";
import { CharacterEditorService } from "./editor/character-edtor-palette/character-editor-pallete/character-editor.service";
import { EditorService } from "./editor/editor-palette/editor.service";
import { AssetsService } from "./game-assets/assets.service";
import { GameMarkersService } from "./game-assets/game-markers";
import { DrawService } from "./game-engine/draw-tools/draw.service";
import { Engine } from "./game-engine/engine";
import { GridService } from "./game-engine/grid.service";
import { NewFogOfWarService } from "./game-engine/new-visibility.service";
import { ShortestPath } from "./game-engine/shortest-path";

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