import { PlayerEventsService } from "../player-events.service"

export abstract class GameEventHandler {
  public eventService: PlayerEventsService

  // Getters Setters
  public _handlerActive = false
  public set handlerActive(isActive: boolean) {
    if(isActive === this._handlerActive) { return }
    this._handlerActive = isActive
    if(isActive) {
      this.startEventProcess()
    } else {
      this.endEvent()
    }
  }
  public get handlerActive() {
    return this._handlerActive
  }

  public id: string
  public criteriaMet(): boolean { return false }
  public startEventProcess(): void {}
  public endEvent(): void {}
}