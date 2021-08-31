import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";

@Injectable() 
export class FogOfWarService {
  constructor(private canvasService: CanvasService) {

  }

  public getVisibility(grid: GridService, cell: Cell) {
    cell.neighbors.forEach((cell) => {
    
    })
  }

  private traceCell(cell: Cell, obstacle: Cell): void {
    const ctx = this.canvasService.overlayCTX
    ctx.beginPath();
    ctx.moveTo(cell.posX, cell.posY);
    ctx.lineTo(cell.posX + 50, cell.posY + 50);
    ctx.lineTo(obstacle.posX + 50, cell.posY + 50);
    ctx.lineTo(obstacle.posX, cell.posY);
    ctx.lineTo(cell.posX, cell.posY);
    ctx.closePath();
    ctx.strokeStyle ="red";
    ctx.stroke();
    ctx.fillStyle="black";
    ctx.fill();
  }
}