import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";

@Injectable()
export class DrawService {
  public drawForeground$ = new Subject()
  public drawBackground$ = new Subject()
  public foregroundImages: File[] = []

  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
  ) { }

  public drawShortLivedAnimation(animation: ShortLivedAnimation): void {
    if(!animation.cell) { return }
    
    this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.clearRect(animation.cell.posX, animation.cell.posY, 50, 50);

    this.canvasService.overlayCTX.drawImage(
      animation.image,
      animation.frameXPosition[animation.frameXCounter],
      animation.frameYPosition[animation.frameYCounter],
      25,
      25,
      animation.cell.posX,
      animation.cell.posY,
      25 * 2,
      25 * 2
    )
  }



  public drawAnimatedAssets(): void {
    if (this.canvasService.foregroundCTX) {
      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);

      this.gridService.gridDisplay.forEach(row => {
        row.forEach((cell: Cell) => {
          // OBSTACLES
          if (cell.obstacle) {
            this.canvasService.foregroundCTX.drawImage(
              cell.image,
              cell.imgIndexX,
              cell.imgIndexY,
              50,
              80,
              cell.posX,
              cell.posY - 30,
              25 * 2,
              40 * 2)
          }

          // GAME COMPONENTS
          if (cell.occupiedBy) {
            const gameComponent = cell.occupiedBy

            this.canvasService.foregroundCTX.drawImage(
              gameComponent.image,
              gameComponent.frameXPosition[gameComponent.frameCounter],
              gameComponent.frameYPosition,
              26,
              36,
              gameComponent.positionX,
              gameComponent.positionY - 40,
              26 * 2,
              36 * 2
            )

            if (gameComponent.selectionIndicator) {
              this.canvasService.overlayCTX.clearRect(gameComponent.positionX, gameComponent.positionY, 25 * 2, 25 * 2);
              this.canvasService.overlayCTX.drawImage(
                gameComponent.selectionIndicator.image,
                gameComponent.selectionIndicator.frameXPosition[gameComponent.selectionIndicator.frameXCounter],
                gameComponent.selectionIndicator.frameYPosition[gameComponent.selectionIndicator.frameYCounter],
                25,
                25,
                gameComponent.positionX,
                gameComponent.positionY,
                25 * 2,
                25 * 2
              )
            }
          }

        })
      })
    }
  }
}