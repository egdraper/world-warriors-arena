import { Subscription } from "rxjs"
import { GSM } from "../../app.service.manager"
import { GameSettings } from "../../models/game-settings"
import { Engine } from "../engine.service"
import { GameEventHandler } from "./base.handler"

export class ArrowKeysPressedEventHandler extends GameEventHandler {
  public id = "ArrowKeysPressedEventHandler"
  public subscription: Subscription

  // Requirements
  public and() { 
    return GameSettings.gm 
      && (this.keyPressDetails.arrowRightPressed
      || this.keyPressDetails.arrowUpPressed
      || this.keyPressDetails.arrowLeftPressed
      || this.keyPressDetails.arrowDownPressed)
  }  

  public startEventProcess(): void {
    this.cursor.style = "move"  
    this.subscribeToEngine()
  }

  public endEvent(): void {
    this.subscription.unsubscribe()
    this.cursor.style = "auto"
  }

  public subscribeToEngine(): void {
   this.subscription = Engine.onFire.subscribe(() => {
      if (this.keyPressDetails.arrowRightPressed) {
        GSM.Canvas.scrollViewPort(1, 0)
      }
      if (this.keyPressDetails.arrowLeftPressed) {
        GSM.Canvas.scrollViewPort(-1, 0)
      }
      if (this.keyPressDetails.arrowUpPressed) {
        GSM.Canvas.scrollViewPort(0, -1)
      }
      if (this.keyPressDetails.arrowDownPressed) {
        GSM.Canvas.scrollViewPort(0, 1)
      }   
    })
  }
}
