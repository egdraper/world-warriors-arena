import { ElementRef, Injectable } from "@angular/core";
import { GridService } from "../game-engine/grid.service";
import { Asset } from "../models/assets.model";
import { Cell, GRID_CELL_MULTIPLIER } from "../models/cell.model";
import { GameSettings, MapSettings } from "../models/game-settings";

@Injectable()
export class CanvasService {
  public canvasSize = 969
  public canvasViewPortOffsetX = 0
  public canvasViewPortOffsetY = 0
  public centerPointX = 0
  public centerPointY = 0

  public largeImageBackground: HTMLImageElement
  public largeImageForeground: HTMLImageElement
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

  public drawingCanvas: ElementRef<HTMLCanvasElement>;
  public drawingCTX: CanvasRenderingContext2D;

  public adustViewPort(xPos: number, yPos: number, asset?: Asset, gridWidth?: number, gridHeight?: number) {
    if (asset && gridWidth && gridHeight) {
      if (!gridHeight || !gridHeight) {
        throw new Error("Passing in asset requires gridWidth and grid height")
      }
      
      if (asset.positionX <= this.centerPointX + 32) { xPos = 0 }
      if (asset.positionY <= this.centerPointY + 32) { yPos = 0 }
      if (asset.positionX >= (gridWidth * 32) - this.centerPointX - 32) { xPos = 0 }
      if (asset.positionY >= (gridHeight * 32) - this.centerPointY - 32) { yPos = 0 }
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

  public createLargeImage(gridWidth: number, gridHeight: number, gridService: GridService) {
    this.drawingCTX.canvas.height = gridWidth
    this.drawingCTX.canvas.width = gridHeight
    this.drawingCTX.scale(this.scale, this.scale)

    this.drawLargeImageObstacles(this.drawingCTX, gridService)

    const bimg = this.drawingCanvas.nativeElement.toDataURL("image/png")
    const fimg = this.drawingCanvas.nativeElement.toDataURL("image/png")
    const bimage = new Image()
    const fimage = new Image()
    bimage.src = bimg
    fimage.src = fimg
    this.largeImageBackground = bimage
    this.largeImageForeground = fimage
  }

  public centerOverAsset(asset: Asset, gridWidth: number, gridHeight: number): void {

    if (!asset) { return }

    // select Asset
    this.resetViewport()

    let assetXPos = asset.cell.posX <= this.centerPointX ? 0 : -1 * asset.cell.posX + this.centerPointX
    let assetYPos = asset.cell.posY <= this.centerPointY ? 0 : -1 * asset.cell.posY + this.centerPointY

    assetXPos = asset.cell.posX >= (gridWidth * 32) - this.centerPointX ? -1 * ((gridWidth * 32) - this.canvasSize - 64) : assetXPos
    assetYPos = asset.cell.posY >= (gridWidth * 32) - this.centerPointY ? -1 * ((gridHeight * 32) - this.canvasSize - 64) : assetYPos

    // if(assetXPos <= this.centerPointX + 32) { assetXPos = 0 }
    // if(asset.positionY <= this.centerPointY + 32 ) { yPos = 0 }
    // if(asset.positionX >= 4800 - this.centerPointX - 32 ) { xPos = 0 }
    // if(asset.positionY >= 4800 - this.centerPointY - 32) { yPos = 0 }

    this.adustViewPort(assetXPos, assetYPos)
  }


  public scrollCanvas(clickX: number, clickY: number, speed: number = 8, sensitivity: number = 96): void {

    if (clickX > (-1 * this.canvasViewPortOffsetX + this.canvasSize - sensitivity)) {
      this.adustViewPort(-1 * speed, 0)
    }

    if (clickY > (-1 * this.canvasViewPortOffsetY + this.canvasSize - sensitivity)) {
      this.adustViewPort(0, -1 * speed)
    }

    if (clickX < (-1 * this.canvasViewPortOffsetX + sensitivity) && (this.canvasViewPortOffsetX < 0)) {
      this.adustViewPort(speed, 0)
    }

    if (clickY < (-1 * this.canvasViewPortOffsetY + sensitivity) && (this.canvasViewPortOffsetY < 0)) {
      this.adustViewPort(0, speed)
    }
  }

  public drawLargeImageObstacles(ctx: CanvasRenderingContext2D, gridService: GridService): void {
    gridService.gridDisplay.forEach(row => {
      row.forEach((cell: Cell) => {
        this.drawLargeImageBackgroundCell(cell, ctx)
      })
    })
    this.drawGridLines(gridService, ctx)
    gridService.gridDisplay.forEach(row => {
      row.forEach((cell: Cell) => {
        this.drawLargeImageCells(cell, ctx)
      })
    })

  }

  // Draws Grid Lines  
  public drawGridLines(gridService: GridService, ctx: CanvasRenderingContext2D): void {
    for (let h = 0; h <= gridService.height; h++) {
      for (let w = 0; w <= gridService.width; w++) {
        // Horizontal lines
        const dim = GameSettings.cellDimension

        ctx.beginPath()
        ctx.moveTo(w * dim, h * dim)
        ctx.lineTo(w * dim, (h * dim) + dim)
        ctx.lineWidth = GameSettings.gridLineThickness;
        ctx.strokeStyle = GameSettings.gridLineStyle
        ctx.stroke()

        // Vertical Lines
        ctx.beginPath()
        ctx.moveTo(w * GameSettings.cellDimension, h * dim)
        ctx.lineTo((w * dim) + dim, h * dim)
        ctx.strokeStyle = GameSettings.gridLineStyle
        ctx.lineWidth = GameSettings.gridLineThickness
        ctx.stroke()
      }
    }
  }



  private drawLargeImageCells(cell: Cell, ctx: CanvasRenderingContext2D): void {
    if (cell.imageTile) {

      ctx.drawImage(
        cell.imageTile.spriteSheet,
        cell.imageTile.spriteGridPosX * cell.imageTile.multiplier,
        cell.imageTile.spriteGridPosY * cell.imageTile.multiplier,
        cell.imageTile.tileWidth * cell.imageTile.multiplier,
        cell.imageTile.tileHeight * cell.imageTile.multiplier,
        cell.posX + cell.imageTile.tileOffsetX,
        cell.posY + cell.imageTile.tileOffsetY,
        cell.imageTile.tileWidth * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier),
        cell.imageTile.tileHeight * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier)
      )
    }
  }

  public drawLargeImageBackgroundCell(cell: Cell, ctx: CanvasRenderingContext2D): void {
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      cell.backgroundTile.spriteSheet,
      cell.backgroundTile.spriteGridPosX[0] * GameSettings.cellDimension,
      cell.backgroundTile.spriteGridPosY[0] * GameSettings.cellDimension,
      GameSettings.cellDimension,
      GameSettings.cellDimension,
      cell.posX,
      cell.posY,
      GameSettings.cellDimension,
      GameSettings.cellDimension
    )
  }
}