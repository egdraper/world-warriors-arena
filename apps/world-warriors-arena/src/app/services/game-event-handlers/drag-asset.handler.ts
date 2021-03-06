import { GSM } from "../../app.service.manager"
import { MotionAsset } from "../../models/assets.model"
import { Cell } from "../../models/cell.model"
import { GameEventHandler } from "./base.handler"

export class DragAssetEventHandler extends GameEventHandler {
  public id = "DragAssetEventHandler"
  public draggingAsset = false
  public prevCell: Cell
  public assetImage: HTMLImageElement
  public asset: MotionAsset

  // Requirements
  public trackingLocked = true
  public mouseDown = true
  public ctrlPressed = true
  public hoveringPlayer = true
  public or() { 
    return this.draggingAsset && this.keyPressDetails.mouseDown
  }

  public startEventProcess(): void {
    this.draggingAsset = true
    this.cursor.style = "grabbing"
    this.prevCell = this.mouseEventDetails?.hoveringPlayer?.cell
    this.assetImage = this.mouseEventDetails?.hoveringPlayer.image
    this.asset = this.mouseEventDetails?.hoveringPlayer

    if(this.mouseEventDetails?.hoveringPlayer) {
      this.mouseEventDetails.hoveringPlayer.cell = undefined
    }
  }

  public endEvent(): void {
    this.cursor.style = "grab"
    this.draggingAsset = false
    this.asset.cell = GSM.Map.activeMap.getGridCellByCoordinate(this.mouseEventDetails.mouseX, this.mouseEventDetails.mouseY)
    this.asset.positionX = this.asset.cell.posX
    this.asset.positionY = this.asset.cell.posY
    this.asset = undefined
    this.assetImage = undefined
  }
}