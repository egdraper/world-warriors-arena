import { MotionAsset } from "./assets.model"
import { SpriteTile, SpriteBackgroundTile } from "./cell.model"

export class EventStateDetails {
  cellId: string
  hoveringPlayer: MotionAsset
  hoveringTerrain: SpriteTile
  hoveringBackground: SpriteBackgroundTile
  hoveringObject: SpriteTile
  ctrlPressed: boolean
  shiftPressed: boolean
  altPressed: boolean
  mouseX: number
  mouseY: number
}

