import { Subscription } from "rxjs"
import { GSM } from "../../app.service.manager"
import { GameSettings } from "../../models/game-settings"
import { Engine } from "../engine.service"
import { GameEventHandler } from "./base.handler"

export class ShiftScrollEventHandler extends GameEventHandler {
  public id = "ShiftScrollEventHandler"

  private subscriptions: Subscription[] = []
  private scrollSpeedX: number = 32
  private scrollSpeedY: number = 32

  private rightQuadrant = false
  private leftQuadrant = false
  private bottomQuadrant = false
  private topQuadrant = false

  // Requirements
  public shiftPressed = true
  public trackingLocked = true

  public startEventProcess(): void {
    this.cursor.style = "move"

    this.subscriptions.push(this.mouseEventDetails.mouseMove.subscribe(mouseMove => {
      this.rightQuadrant = mouseMove.mouseX > (-1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX) - GSM.Canvas.canvasSizeX / 3
      this.bottomQuadrant = mouseMove.mouseY > (-1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY) - GSM.Canvas.canvasSizeY / 3
      this.topQuadrant = mouseMove.mouseX < (-1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX / 3) && (GSM.Canvas.canvasViewPortOffsetX < 0)
      this.leftQuadrant = mouseMove.mouseY < (-1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY / 3) && (GSM.Canvas.canvasViewPortOffsetY < 0)   
    }))

    // TODO. Get Progressive scrolling to work (slow at first then speeds up)

    this.subscribeToEngine()
  }

  public endEvent(): void {
    this.scrollSpeedX = 32
    this.scrollSpeedY = 32
    this.rightQuadrant = false
    this.leftQuadrant = false
    this.bottomQuadrant = false
    this.topQuadrant = false
    this.subscriptions.forEach(sub => sub.unsubscribe())
    this.subscriptions = []
    this.cursor.style = "auto"
  }

  public subscribeToEngine(): void {
    this.subscriptions.push(Engine.onFire.subscribe((frame) => {
      if (this.rightQuadrant) {
        GSM.Canvas.scrollViewPort(1, 0, this.scrollSpeedX, this.scrollSpeedY)
      }

      if (this.leftQuadrant) {
        GSM.Canvas.scrollViewPort(0, -1,  this.scrollSpeedX, this.scrollSpeedY)
      }

      if (this.topQuadrant) {
        GSM.Canvas.scrollViewPort(-1, 0,  this.scrollSpeedX, this.scrollSpeedY)
      }

      if (this.bottomQuadrant) {
        GSM.Canvas.scrollViewPort(0, 1,  this.scrollSpeedX, this.scrollSpeedY)
      }
    }))
  }
}
