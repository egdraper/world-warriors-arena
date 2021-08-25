import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";

@Injectable()
export class DrawService {
  public drawForeground$ = new Subject()
  public drawBackground$ = new Subject()
  public foregroundImages: File[] = []

  constructor(
    public canvasService: CanvasService,
    public gridService: GridService
  ) { }

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

            if (gameComponent.clickAnimation) {
              this.canvasService.overlayCTX.clearRect(0, 0, 1500, 1500);
              this.canvasService.overlayCTX.drawImage(
                gameComponent.clickAnimation.image,
                gameComponent.clickAnimation.frameXPosition[gameComponent.clickAnimation.frameXCounter],
                gameComponent.clickAnimation.frameYPosition[gameComponent.clickAnimation.frameYCounter],
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