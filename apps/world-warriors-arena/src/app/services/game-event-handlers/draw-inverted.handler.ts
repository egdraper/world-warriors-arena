import { Subscription } from "rxjs"
import { GSM } from "../../app.service.manager"
import { MousePosition } from "../../models/cell.model"
import { Engine } from "../engine.service"
import { GameEventHandler } from "./base.handler"

export class DrawInvertedEventHandler extends GameEventHandler {
  public id = "DrawInvertedEventHandler"
  private erasing = false
  private subscriptions: Subscription[] = [];

  private rightQuadrant = false;
  private leftQuadrant = false;
  private bottomQuadrant = false;
  private topQuadrant = false;

  // Requirements
  public ctrlPressed = true
  public mouseDown = true
  public and() { return GSM.Map.activeMap.defaultSettings.inverted }
  public or() { return this.erasing && this.keyPressDetails.mouseDown}

  public startEventProcess(): void {
    this.cursor.style = "move"
    this.erasing = true
    this.subscriptions.push(this.mouseEventDetails.mouseMove.subscribe(this.handleMouseMove.bind(this)));
    this.subscribeToEngine()
  }

  public handleMouseMove(event: MousePosition): void {
    const hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(event.mousePosX, event.mousePosY)

    this.rightQuadrant = event.mousePosX > -1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX - 144;
    this.bottomQuadrant = event.mousePosY > -1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY - 144;
    this.topQuadrant = event.mousePosX < -1 * GSM.Canvas.canvasViewPortOffsetX + 144 && GSM.Canvas.canvasViewPortOffsetX < 0;
    this.leftQuadrant = event.mousePosY < -1 * GSM.Canvas.canvasViewPortOffsetY + 144 && GSM.Canvas.canvasViewPortOffsetY < 0;

    GSM.Assets.addInvertedMapAsset(hoveringCell)
  }

  public endEvent(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.erasing = false
    this.cursor.style = "auto"
  }

  public subscribeToEngine(): void {
    this.subscriptions.push(
      Engine.onFire.subscribe((frame) => {
        if (frame % 2 === 0) {
          if (this.rightQuadrant) {
            GSM.Canvas.scrollViewPort(1, 0);
          }

          if (this.leftQuadrant) {
            GSM.Canvas.scrollViewPort(0, -1);
          }

          if (this.topQuadrant) {
            GSM.Canvas.scrollViewPort(-1, 0);
          }

          if (this.bottomQuadrant) {
            GSM.Canvas.scrollViewPort(0, 1);
          }
        }
      })
    );
  }
}


