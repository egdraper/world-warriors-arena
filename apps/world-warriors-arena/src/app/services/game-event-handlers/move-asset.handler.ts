import { GSM } from "../../app.service.manager"
import { GameEventHandler } from "./base.handler"

export class MoveAssetEventHandler extends GameEventHandler {
  public id = "MoveAssetEventHandler"

  public mouseDown = true
  public hoveringPlayer = false
  public and() { return !!GSM.Assets.selectedGameComponent }

  public startEventProcess(): void {
    const selectedCell = GSM.Map.activeMap.getGridCellByCoordinate(this.mouseEventDetails.mouseX, this.mouseEventDetails.mouseY)
    GSM.Assets.selectedGameComponent.startMovement(GSM.Assets.selectedGameComponent.cell, selectedCell, GSM.Assets.gameComponents)
  }

  public endEvent(): void {
    this.cursor.style = "auto"
  }
}
