import { Subscription } from "rxjs";
import { GSM } from "../app.service.manager";
import { Cell } from "../models/cell.model";
import { Engine } from "../services/engine.service";

export abstract class Painter {
  private engineSubscription: Subscription

  public abstract paint(frame?: number): void

  public start(): void {
    this.engineSubscription = Engine.onFire.subscribe(() => {
      this.paint()
    })
  }

  public stop(): void {
    this.engineSubscription.unsubscribe()
  }
}

export abstract class LayerPainter extends Painter {
  // draws the background item for each cell provided
  public drawOnBackgroundCell(cell: Cell): void {
    if (cell && cell.backgroundTile) {

      GSM.Canvas.backgroundCTX.imageSmoothingEnabled = false
      GSM.Canvas.backgroundCTX.drawImage(
        cell.backgroundTile.spriteSheet,
        cell.backgroundTile.spriteGridPosX[0] * 32,
        cell.backgroundTile.spriteGridPosY[0] * 32,
        32,
        32,
        cell.posX,
        cell.posY,
        32,
        32
      )

      if (cell.portalTo) {
        GSM.Canvas.backgroundCTX.globalAlpha = .5;
        GSM.Canvas.backgroundCTX.fillStyle = 'blue';
        GSM.Canvas.backgroundCTX.fillRect(
          cell.posX,
          cell.posY,
          32,
          32
        )
        GSM.Canvas.backgroundCTX.globalAlpha = 1;

      }
    }
  }
  
}


