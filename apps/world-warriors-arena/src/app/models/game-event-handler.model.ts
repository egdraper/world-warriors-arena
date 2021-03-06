
import { Subject } from "rxjs"
import { MotionAsset } from "./assets.model"
import { SpriteTile, SpriteBackgroundTile, MousePosition } from "./cell.model"
import { MarkerIcon } from "./marker-icon.model"

export class KeyPressEventDetails {
  public ctrlPressed?: boolean = false
  public shiftPressed?: boolean = false
  public altPressed?: boolean = false
  public arrowDownPressed?: boolean = false
  public arrowLeftPressed?: boolean = false
  public arrowUpPressed?: boolean = false
  public arrowRightPressed?: boolean = false
  public keyPressed?: string = ""
  public mouseDown?: boolean = false
}

export class MouseEventDetails {
  cellId?: string
  hoveringPlayer: MotionAsset
  hoveringTerrain: SpriteTile
  hoveringBackground: SpriteBackgroundTile
  hoveringObject: SpriteTile
  markerIcon: MarkerIcon
  mouseX = 0
  mouseY = 0
  mouseMove: Subject<MousePosition> = new Subject()
}

