import { ElementRef, Injectable } from "@angular/core";
import { GRID_CELL_MULTIPLIER } from "../models/cell.model";

@Injectable()
export class CanvasService {
  public overlayCanvas: ElementRef<HTMLCanvasElement>;
  public overlayCTX: CanvasRenderingContext2D;
  
  public foregroundCanvas: ElementRef<HTMLCanvasElement>;
  public foregroundCTX: CanvasRenderingContext2D;
   
  public backgroundCanvas: ElementRef<HTMLCanvasElement>;
  public backgroundCTX: CanvasRenderingContext2D;
  
  public fogCanvas: ElementRef<HTMLCanvasElement>;
  public fogCTX: CanvasRenderingContext2D;

  public blackoutCanvas: ElementRef<HTMLCanvasElement>;
  public blackoutCTX: CanvasRenderingContext2D;


  public setupCanvases(gridWidth: number, gridHeight: number): void {
    this.backgroundCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER
    this.backgroundCTX.canvas.width = gridWidth * GRID_CELL_MULTIPLIER

    this.foregroundCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER
    this.foregroundCTX.canvas.width = gridWidth * GRID_CELL_MULTIPLIER

    this.overlayCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER
    this.overlayCTX.canvas.width = gridWidth * GRID_CELL_MULTIPLIER

    this.fogCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER
    this.fogCTX.canvas.width = gridWidth * GRID_CELL_MULTIPLIER

    this.blackoutCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER
    this.blackoutCTX.canvas.width = gridWidth * GRID_CELL_MULTIPLIER
  }
}