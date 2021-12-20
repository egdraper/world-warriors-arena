import { GameMap } from "./game-map"
import { PageTransitionMarker } from "./marker-icon.model"

export class MiniMapDetails {
    map: GameMap
    posX: number
    posY: number
    leftOf?: MiniMapDetails
    rightOf?: MiniMapDetails
    above?: MiniMapDetails
    below?: MiniMapDetails
    connectionType?: "transition" | "phase" | "portal"
    width: number
    height: number
    image: HTMLImageElement
    gameMarkers?: PageTransitionMarker[]
  }