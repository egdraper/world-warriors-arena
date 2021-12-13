import { GSM } from "../../app.service.manager"
import { GameSettings } from "../../models/game-settings"
import { GameEventHandler } from "./base.handler"

export class PlayerSwapAssetEventHandler extends GameEventHandler {
  public id = "PlayerSwapAssetEventHandler"

  public hoveringPlayer = true
  public mouseDown = true
  public and() {
    return !!GSM.Assets.selectedGameComponent
      && this.mouseEventDetails.hoveringPlayer.id !== GSM.Assets.selectedGameComponent.id
  }

  public startEventProcess(): void {
    GSM.Assets.deselectAsset()
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
