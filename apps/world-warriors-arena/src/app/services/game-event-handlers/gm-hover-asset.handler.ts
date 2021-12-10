import { GameEventHandler } from "./base.handler"

export class GMHoverAssetEventHandler extends GameEventHandler {
  public id = "GMHoverAssetEventHandler"

  public criteriaMet(): boolean {
    this.handlerActive = !!this.eventService.hoverDetails.hoveringPlayer && this.eventService.ctrlDown
    return this.handlerActive
  }

  public startEventProcess(): void {
    this.eventService.cursor = "grab"
  }

  public endEvent(): void {
    this.eventService.cursor = "pointer"
  }
}
