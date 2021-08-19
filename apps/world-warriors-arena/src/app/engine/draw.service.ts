import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";

@Injectable()
export class DrawService {
  public drawForeground$ = new Subject()
  public drawBackground$ = new Subject()

  constructor(
    public canvasService: CanvasService,
    public gridService: GridService
  ) { }

  public drawAnimatedAssets(): void {
    if (this.canvasService.foregroundCTX) {
      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);
     
      // it goes through the grid service and gets each character from the grid. 
      this.gridService.gridDisplay.forEach(row => {
        row.forEach((cell: Cell) => {
          if (cell.occupiedBy) { // <<-- cell.occupiedBy is where we are storing the GameComponent/MotionAsset (see cell.model)
            const gameComponent = cell.occupiedBy
            this.canvasService.foregroundCTX.drawImage(
              gameComponent.image,
              gameComponent.frameXPosition[gameComponent.frameCounter],
              0,
              26,
              36,
              gameComponent.positionX,
              gameComponent.positionY - 40,
              26 * 2,
              36 * 2)
          }
        })
      })
    }
  }
}