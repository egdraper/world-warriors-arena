import { GSM } from "../../app.service.manager"
import { GameSettings } from "../../models/game-settings"
import { GameEventHandler } from "./base.handler"

export class PlayerSelectAssetEventHandler extends GameEventHandler {
  public id = "SelectAssetEventHandler"

  public hoveringPlayer = true
  public mouseDown = true
  public ctrlPressed = false
  public and() { return !GSM.Assets.selectedGameComponent }

  public startEventProcess(): void {
    // select Asset
      GSM.Assets.selectAsset(this.mouseEventDetails.hoveringPlayer)
      if (!GameSettings.gm) {
        GSM.Canvas.centerOverAsset(this.mouseEventDetails.hoveringPlayer)
      }
      return
    }
  

  public endEvent(): void {
    this.cursor.style = "pointer"
  }
}
