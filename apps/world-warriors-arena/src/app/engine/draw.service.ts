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
    if(this.canvasService.foregroundCTX) {
    this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);
    this.gridService.gridDisplay.forEach(row => {
      row.forEach((cell: Cell) => {
        if(cell.occupiedBy) {
          const gameComponent = cell.occupiedBy
          this.canvasService.foregroundCTX.drawImage(
            gameComponent.image, 
            gameComponent.frameXPosition[gameComponent.frameCounter], 
            0, 
            26,
            36,
            gameComponent.cell.posX,
            gameComponent.cell.posY - 40, 
            26 * 2, 
            36 * 2)
        }
      })
    })
  }
  }
}