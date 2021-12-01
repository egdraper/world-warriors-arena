import { Subscription } from "rxjs";
import { CanvasService } from "../../../canvas/canvas.service";
import { Cell } from "../../../models/cell.model";
import { Engine } from "../../engine";

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

  constructor(
    public canvasService: CanvasService
  ) {
    super()
  }

  // draws the background item for each cell provided
  public drawOnBackgroundCell(cell: Cell): void {
    if (cell && cell.backgroundTile) {

      this.canvasService.backgroundCTX.imageSmoothingEnabled = false
      this.canvasService.backgroundCTX.drawImage(
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
        this.canvasService.backgroundCTX.globalAlpha = .5;
        this.canvasService.backgroundCTX.fillStyle = 'blue';
        this.canvasService.backgroundCTX.fillRect(
          cell.posX,
          cell.posY,
          32,
          32
        )
        this.canvasService.backgroundCTX.globalAlpha = 1;

      }
    }
  }
  
}


