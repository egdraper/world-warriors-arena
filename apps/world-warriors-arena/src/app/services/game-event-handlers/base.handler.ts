import { Subject } from "rxjs"
import { MarkerIconType, MousePosition } from "../../models/cell.model"
import { KeyPressEventDetails, MouseEventDetails } from "../../models/game-event-handler.model"
import { GameSettings } from "../../models/game-settings"

export abstract class GameEventHandler implements KeyPressEventDetails {
  public id: string
  public keyPressDetails: KeyPressEventDetails
  public mouseEventDetails: MouseEventDetails
  public cursor: {style: string}

  public ctrlPressed: boolean
  public altPressed: boolean
  public shiftPressed: boolean
  public arrowDownPressed: boolean
  public arrowLeftPressed: boolean
  public arrowRightPressed: boolean
  public arrowUpPressed: boolean
  public mouseDown: boolean  
  public trackingLocked: boolean
  public hoveringMarkerIcon: boolean
  public markerIconType: MarkerIconType
  public hoveringPlayer: boolean
  public hoveringTerrain: boolean
  public hoveringBackground: boolean
  public hoveringObject: boolean
  public keyPressed: string

  // Getters Setters
  public _handlerActive = false
  public set handlerActive(isActive: boolean) {
    if (isActive === this._handlerActive) { return }
    this._handlerActive = isActive
    if (isActive) {
      this.startEventProcess()
    } else {
      console.log(this.id, "ended")
      this.endEvent()
    }
  }
  public get handlerActive() {
    return this._handlerActive
  }

  public onMouseMove: Subject<MousePosition> = new Subject()

  public criteriaMet(): void {
    const baseKeyConditions = 
         (this.ctrlPressed !== undefined ? this.ctrlPressed === this.keyPressDetails.ctrlPressed : true)
      && (this.altPressed !== undefined ? this.altPressed === this.keyPressDetails.altPressed : true)
      && (this.shiftPressed !== undefined ? this.shiftPressed === this.keyPressDetails.shiftPressed : true)
      && (this.arrowDownPressed !== undefined ? this.arrowDownPressed === this.keyPressDetails.arrowDownPressed : true)
      && (this.arrowLeftPressed !== undefined ? this.arrowLeftPressed === this.keyPressDetails.arrowLeftPressed : true)
      && (this.arrowUpPressed !== undefined ? this.arrowUpPressed === this.keyPressDetails.arrowUpPressed : true)
      && (this.arrowRightPressed !== undefined ? this.arrowRightPressed === this.keyPressDetails.arrowRightPressed : true)
      && (this.trackingLocked !== undefined ? this.trackingLocked === GameSettings.gm : true)
      && (this.hoveringMarkerIcon !== undefined ? this.hoveringMarkerIcon === !!this.mouseEventDetails.markerIcon : true)
      && (this.hoveringPlayer !== undefined ? this.hoveringPlayer === !!this.mouseEventDetails.hoveringPlayer : true)
      && (this.hoveringTerrain !== undefined ? this.hoveringTerrain === !!this.mouseEventDetails.hoveringTerrain : true)
      && (this.markerIconType !== undefined ? this.markerIconType === this.mouseEventDetails.markerIcon.type : true)
      && (this.mouseDown !== undefined ? this.mouseDown === this.keyPressDetails.mouseDown : true)
      && (this.keyPressed !== undefined ? this.keyPressed === this.keyPressDetails.keyPressed : true)

    this.handlerActive = (baseKeyConditions && this.and()) || this.or()
  }

  protected and(): boolean { return true }
  protected or(): boolean { return false }
  public startEventProcess(): void { return }
  public endEvent(): void { return }
}