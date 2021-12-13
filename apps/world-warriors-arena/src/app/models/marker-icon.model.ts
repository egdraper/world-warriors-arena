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
  onClickWithCtrl(): any { return }
  onClickWithShift(): any { return }
}

export class PageTransitionMarker extends MarkerIcon {
  public gridConnection: PageTransitionMarker
}