import { GSM } from "../../app.service.manager"
import { MarkerIconType } from "../../models/cell.model"
import { PageTransitionMarker } from "../../models/marker-icon.model"
import { GameEventHandler } from "./base.handler"

export class PageTransitionMarkerHandler extends GameEventHandler {
  public id = "PageTransitionMarkerHandler"
  public markerIcon: PageTransitionMarker
  public motionInProgress = false

  // Requirements
  public mouseDown = true
  public hoveringMarkerIcon = true
  public markerIconType = MarkerIconType.mapTransition
  public or(): boolean { return this.motionInProgress }
  
  public startEventProcess(): void {
    this.markerIcon = this.mouseEventDetails.markerIcon as PageTransitionMarker

    if (!this.markerIcon.gridConnection) {
      GSM.Map.activeMap.changePageXOffset = GSM.Canvas.canvasViewPortOffsetX
      GSM.Map.activeMap.changePageYOffset = GSM.Canvas.canvasViewPortOffsetY
      GSM.Editor.generateRandomAttachmentMap(this.markerIcon)
      GSM.Canvas.hardAdjust(GSM.Map.activeMap.changePageXOffset, GSM.Map.activeMap.changePageYOffset)
    }

    if(GSM.Assets.selectedGameComponent) {
      this.motionInProgress = true
      const selectedCell = GSM.Map.activeMap.getGridCellByCoordinate(this.markerIcon.displayPosX, this.markerIcon.displayPosY)
      GSM.Assets.selectedGameComponent.startMovement(GSM.Assets.selectedGameComponent.cell, selectedCell, GSM.Assets.gameComponents, this.onMarkerReached.bind(this))
    }
  }

  public endEvent(): void {
    this.markerIcon = undefined
  }

  // helper

  private onMarkerReached(): void {
    GSM.Map.switchGrid(this.markerIcon.gridConnection.mapId)
    const newCell = GSM.Map.activeMap.getGridCellByCoordinate(this.markerIcon.gridConnection.displayPosX, this.markerIcon.gridConnection.displayPosY)
    GSM.Assets.selectedGameComponent.cell = newCell
    GSM.Assets.selectedGameComponent.positionX = newCell.posX
    GSM.Assets.selectedGameComponent.positionY = newCell.posY
    GSM.Assets.selectedGameComponent.gridId = this.markerIcon.gridConnection.mapId
    GSM.Canvas.centerOverAsset(GSM.Assets.selectedGameComponent)
    this.motionInProgress = false
  }
}
