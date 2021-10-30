import { ElementRef, Injectable } from "@angular/core";
import { Asset } from "../models/assets.model";
import { GRID_CELL_MULTIPLIER } from "../models/cell.model";

@Injectable()
export class CanvasService {
  public canvasSize = 969
  public canvasViewPortOffsetX = 0
  public canvasViewPortOffsetY = 0
  public centerPointX = 0
  public centerPointY = 0
  
  public _scale = 1
  public get scale() {
    return this._scale
  }

  public set scale(value: number) {
    this._scale = value
  }

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

  public adustViewPort(xPos: number, yPos: number, saveLocation: boolean = false, asset?: Asset) {
    if(asset) {
      if(asset.positionX <= this.centerPointX + 32) { xPos = 0 }
      if(asset.positionY <= this.centerPointY + 32 ) { yPos = 0 }
      if(asset.positionX >= 4800 - this.centerPointX - 32 ) { xPos = 0 }
      if(asset.positionY >= 4800 - this.centerPointY - 32) { yPos = 0 }
    }
    this.canvasViewPortOffsetX += xPos
    this.canvasViewPortOffsetY += yPos

    this.fogCTX.translate(xPos, yPos)
    this.blackoutCTX.translate(xPos, yPos)
    this.backgroundCTX.translate(xPos, yPos)
    this.overlayCTX.translate(xPos, yPos)
    this.foregroundCTX.translate(xPos, yPos)
  }

  public resetViewport(): void {
    const xPos = -1 * this.canvasViewPortOffsetX
    const yPos = -1 * this.canvasViewPortOffsetY
    this.adustViewPort(xPos, yPos)
  }

  public setupCanvases(gridWidth: number, gridHeight: number): void {
    this.backgroundCTX.canvas.height = gridHeight * GRID_CELL_MULTIPLIER

    this.backgroundCTX.canvas.height = this.canvasSize
    this.backgroundCTX.canvas.width = this.canvasSize
    this.backgroundCTX.scale(this.scale, this.scale)

    this.foregroundCTX.canvas.height = this.canvasSize
    this.foregroundCTX.canvas.width = this.canvasSize
    this.foregroundCTX.scale(this.scale, this.scale)

    this.overlayCTX.canvas.height = this.canvasSize
    this.overlayCTX.canvas.width = this.canvasSize
    this.overlayCTX.scale(this.scale, this.scale)

    this.fogCTX.canvas.height = this.canvasSize
    this.fogCTX.canvas.width = this.canvasSize
    this.fogCTX.scale(this.scale, this.scale)

    this.blackoutCTX.canvas.height = this.canvasSize
    this.blackoutCTX.canvas.width = this.canvasSize
    this.blackoutCTX.scale(this.scale, this.scale)


  }

  public scrollCanvas(clickX: number, clickY: number, speed: number = 8, sensitivity: number = 96): void {
  
    
    if(clickX > (-1 * this.canvasViewPortOffsetX + this.canvasSize - sensitivity)) {
      this.adustViewPort(-1 * speed, 0)
    }

    if(clickY > (-1 * this.canvasViewPortOffsetY + this.canvasSize - sensitivity)) {
      this.adustViewPort(0, -1 * speed)
    }

    if(clickX < (-1 * this.canvasViewPortOffsetX + sensitivity) && (this.canvasViewPortOffsetX < 0)) {
      this.adustViewPort(speed, 0)
    }

    if(clickY < (-1 * this.canvasViewPortOffsetY + sensitivity) && (this.canvasViewPortOffsetY < 0)) {
      this.adustViewPort(0, speed)
    }
  }
}