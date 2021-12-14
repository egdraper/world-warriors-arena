import { GameEventHandler } from "./base.handler"

export class GMHoverAssetEventHandler extends GameEventHandler {
  public id = "GMHoverAssetEventHandler"

  public hoveringPlayer = true
  public ctrlPressed = false
  public mouseDown = false

  public startEventProcess(): void {
    this.cursor.style = "pointer"
  }

  public endEvent(): void {
    this.cursor.style = "auto"
  }
}

export class GMHoverCtrlAssetEventHandler extends GameEventHandler {
  public id = "GMHoverCtrlAssetEventHandler"

  public hoveringPlayer = true
  public ctrlPressed = true
  public mouseDown = false

  public startEventProcess(): void {
    this.cursor.style = "grab"
  }

  public endEvent(): void {
    this.cursor.style = "auto"
  }
}
