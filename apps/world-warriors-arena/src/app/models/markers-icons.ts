import { GSM } from "../app.service.manager"
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

  public onClick(): void {
    if (!this.gridConnection) {
      GSM.Map.activeMap.changePageXOffset = GSM.Canvas.canvasViewPortOffsetX
      GSM.Map.activeMap.changePageYOffset = GSM.Canvas.canvasViewPortOffsetY
      GSM.Editor.generateRandomAttachmentMap(this)
      GSM.Canvas.hardAdjust(GSM.Map.activeMap.changePageXOffset, GSM.Map.activeMap.changePageYOffset)
    }

    if(GSM.Assets.selectedGameComponent) {
      const selectedCell = GSM.Map.activeMap.getGridCellByCoordinate(this.displayPosX, this.displayPosY)
      GSM.Assets.selectedGameComponent.startMovement(GSM.Assets.selectedGameComponent.cell, selectedCell, GSM.Assets.gameComponents, this.onMarkerReached.bind(this))
    }
  }

  public onClickWithCtrl(): void {
    if (!this.gridConnection) {
      GSM.Editor.generateRandomAttachmentMap(this)
    }

    GSM.Map.switchGrid(this.gridConnection.mapId)
  }

  public onMarkerReached(): void {
    GSM.Map.switchGrid(this.gridConnection.mapId)
    const newCell = GSM.Map.activeMap.getGridCellByCoordinate(this.gridConnection.displayPosX, this.gridConnection.displayPosY)
    GSM.Assets.selectedGameComponent.cell = newCell
    GSM.Assets.selectedGameComponent.positionX = newCell.posX
    GSM.Assets.selectedGameComponent.positionY = newCell.posY
    GSM.Assets.selectedGameComponent.gridId = this.gridConnection.mapId

    GSM.Canvas.centerOverAsset(GSM.Assets.selectedGameComponent, GSM.Map.activeMap)
    
  }

  tryItOut(): void {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../workers/map-generator.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
        debugger
      };
      worker.postMessage("HI");
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}