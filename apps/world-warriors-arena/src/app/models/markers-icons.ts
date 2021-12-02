import { GridService } from "../game-engine/grid.service"
import { MapPosition, MarkerIconType } from "./cell.model"

export abstract class MarkerIcon {
  id: string
  position?: MapPosition
  type: MarkerIconType
  mapId: string
  image: HTMLImageElement
  spritePosX: number
  spritePosY: number
  displayPosX: number
  displayPosY: number
  width: number
  height: number
  hoverImage?: HTMLImageElement
  hoverSpritePosX?: number
  hoverSpritePosY?: number
  hovering?: boolean

  onClick(): any { return }
}

export class PageTransitionMarker extends MarkerIcon {
  public gridConnection: PageTransitionMarker

  constructor(
    public gridService: GridService) {
    super()
  }

  public onClick(): void {
    if(this.gridConnection) {
      this.gridService.activeGrid = this.gridService.maps[this.mapId]
    }

  }
}