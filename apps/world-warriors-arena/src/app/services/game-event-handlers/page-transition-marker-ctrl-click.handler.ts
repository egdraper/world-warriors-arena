import { GSM } from "../../app.service.manager"
import { MarkerIconType } from "../../models/cell.model"
import { PageTransitionMarker } from "../../models/marker-icon.model"
import { GameEventHandler } from "./base.handler"

export class PageTransitionMarkerCtrlClickHandler extends GameEventHandler {
  public id = "PageTransitionMarkerHandler"
  public markerIcon: PageTransitionMarker

  public ctrlPressed = true
  public hoveringMarkerIcon = true
  public markerIconType = MarkerIconType.mapTransition
  public mouseDown = true
 
  public startEventProcess(): void {
    this.markerIcon = this.mouseEventDetails.markerIcon as PageTransitionMarker
    
    if (!this.markerIcon.gridConnection) {
      GSM.Editor.generateRandomAttachmentMap(this.markerIcon)
    }

    GSM.Map.switchGrid(this.markerIcon.gridConnection.mapId)
  }

  public endEvent(): void {
    this.markerIcon = undefined
  }
}
