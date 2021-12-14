import { AssetsService } from "./services/assets.service";
import { CanvasService } from "./services/canvas.service";
import { CharacterEditorService } from "./services/character-editor.service";
import { DrawService } from "./services/draw.service";
import { EditorService } from "./services/editor.service";
import { Engine } from "./services/engine.service";
import { GameEventsService } from "./services/game-events.service";
import { GameMarkersService } from "./services/game-markers.service";
import { MapService } from "./services/map.service";
import { NewFogOfWarService } from "./services/new-visibility.service";

export class GSM {
  public static Canvas: CanvasService
  public static Assets: AssetsService
  public static Draw: DrawService
  public static Map: MapService
  public static Editor: EditorService
  public static FogOfWar: NewFogOfWarService
  public static Engine: Engine
  public static CharacterEditor: CharacterEditorService
  public static GameMarker: GameMarkersService
  public static GameEvent: GameEventsService
}