import { GSM } from "../../app.service.manager"
import { MotionAsset } from "../../models/assets.model"
import { Cell } from "../../models/cell.model"
import { GameSettings } from "../../models/game-settings"
import { GameEventHandler } from "./base.handler"

export class DragAssetEventHandler extends GameEventHandler {
  public id = "DragAssetEventHandler"
  public draggingAsset = false
  public prevCell: Cell
  public asset: MotionAsset

  public criteriaMet(): boolean {
    this.handlerActive = 
         GameSettings.gm
      && this.eventService.mouseDown 
      && this.eventService.ctrlDown 
      && (!!this.eventService.hoverDetails.hoveringPlayer || this.draggingAsset)
   
    return this.handlerActive
  }

  public startEventProcess(): void {
    console.log("I got Started")
    this.draggingAsset = true
    this.eventService.cursor = "grabbing"
    this.prevCell = this.eventService.hoverDetails.hoveringPlayer.cell
    this.asset = this.eventService.hoverDetails.hoveringPlayer
    this.eventService.hoverDetails.hoveringPlayer.cell = undefined
    
  }

  public endEvent(): void {
    this.eventService.cursor = "grab"
    this.draggingAsset = false
    this.asset.cell = GSM.Map.activeMap.getGridCellByCoordinate(this.eventService.hoverDetails.mouseX, this.eventService.hoverDetails.mouseY)
    this.asset.positionX = this.asset.cell.posX
    this.asset.positionY = this.asset.cell.posY
    this.asset = undefined
  }
}