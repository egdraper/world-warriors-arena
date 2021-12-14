import { Subscription } from 'rxjs';
import { GSM } from '../../app.service.manager';
import { growableItems } from '../../game-assets/tile-assets.db';
import { MousePosition } from '../../models/cell.model';
import { Engine } from '../engine.service';
import { GameEventHandler } from './base.handler';

export class DrawTerrainEventHandler extends GameEventHandler {
  public id = 'DrawTerrainEventHandler';
  private drawing = false;
  private subscriptions: Subscription[] = [];

  private rightQuadrant = false;
  private leftQuadrant = false;
  private bottomQuadrant = false;
  private topQuadrant = false;

  // Requirements
  public ctrlPressed = true;
  public mouseDown = true;
  public and() {
    return (
      !!GSM.Editor.selectedGrowableAsset &&
      !GSM.Map.activeMap.defaultSettings.inverted
    );
  }
  public or() {
    return this.drawing && this.keyPressDetails.mouseDown;
  }

  public startEventProcess(): void {
    this.cursor.style = 'pointer';
    this.drawing = true;
    this.subscriptions.push(this.mouseEventDetails.mouseMove.subscribe(this.handleMouseMove.bind(this)));
    this.subscribeToEngine();
  }

  public handleMouseMove(event: MousePosition): void {
    const hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(event.mousePosX, event.mousePosY);

    this.rightQuadrant = event.mousePosX > -1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX - 96;
    this.bottomQuadrant = event.mousePosY > -1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY - 96;
    this.topQuadrant = event.mousePosX < -1 * GSM.Canvas.canvasViewPortOffsetX + 96 && GSM.Canvas.canvasViewPortOffsetX < 0;
    this.leftQuadrant = event.mousePosY < -1 * GSM.Canvas.canvasViewPortOffsetY + 96 && GSM.Canvas.canvasViewPortOffsetY < 0;

    const selectedAsset = GSM.Editor.selectedAsset;
    const drawableItem = growableItems.find(
      (item) => item.id === GSM.Editor.selectedGrowableAsset
    );
    GSM.Assets.addMapAsset(hoveringCell, selectedAsset, drawableItem);
  }

  public endEvent(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.drawing = false;
    this.cursor.style = 'auto';
  }

  public subscribeToEngine(): void {
    this.subscriptions.push(
      Engine.onFire.subscribe((frame) => {
        if (frame % 3 === 0) {
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
