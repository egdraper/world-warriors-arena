
import { Subject } from "rxjs"
import { MotionAsset } from "./assets.model"
import { SpriteTile, SpriteBackgroundTile } from "./cell.model"
import { MarkerIcon } from "./marker-icon.model"

export class KeyPressEventDetails {
  public ctrlPressed?: boolean = false
  public shiftPressed?: boolean = false
  public altPressed?: boolean = false
  public arrowDownPressed?: boolean = false
  public arrowLeftPressed?: boolean = false
  public arrowUpPressed?: boolean = false
  public arrowRightPressed?: boolean = false
  public mouseDown?: boolean = false
  public keyPressed?: string = ""
}

export class MouseEventDetails {
  cellId?: string
  hoveringPlayer: MotionAsset
  hoveringTerrain: SpriteTile
  hoveringBackground: SpriteBackgroundTile
  hoveringObject: SpriteTile
  markerIcon: MarkerIcon
  mouseX: number = 0
  mouseY: number = 0
  mouseMove: Subject<{mouseX: number, mouseY: number}> = new Subject()
}

