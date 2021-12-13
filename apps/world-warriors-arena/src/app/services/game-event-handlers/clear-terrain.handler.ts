import { GameEventHandler } from "./base.handler"

export class GMHoverAssetEventHandler extends GameEventHandler {
  public id = "GMHoverAssetEventHandler"

  public hoveringPlayer = true

  public startEventProcess(): void {
    this.cursor.style = "pointer"
  }

  public endEvent(): void {
    this.cursor.style = "auto"
  }
}
