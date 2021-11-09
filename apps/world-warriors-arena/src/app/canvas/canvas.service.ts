import { ElementRef, Injectable } from "@angular/core";
import { GridService } from "../game-engine/grid.service";
import { Asset } from "../models/assets.model";
import { Cell } from "../models/cell.model";
import { GameSettings } from "../models/game-settings";

@Injectable()
export class CanvasService {
  public canvasSize = 969
  public canvasViewPortOffsetX = 0
  public canvasViewPortOffsetY = 0
  public centerPointX = 0
  public centerPointY = 0
  public topLeftVisibleCell: Cell
  public topRightVisibleCell: Cell
  public bottomLeftVisibleCell: Cell
  public maxCellCountX = 0
  public cellOffsetX = 0
  public cellOffsetY = 0

  public largeImageBackground: HTMLImageElement
  public largeImageForeground: HTMLImageElement
  public scale = 1

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

  public scrollViewPort(x: number, y: number, grid: GridService): void {
    if (x > 0 && this.cellOffsetX + this.maxCellCountX < grid.width - 1) {
      this.cellOffsetX += (1 / this.scale)
      this.adustViewPort(-32, 0)
    }
    if (x < 0 && this.cellOffsetX > 0) {
      this.cellOffsetX -= (1 / this.scale)
      this.adustViewPort(32, 0)
    }
    if (y > 0 && this.cellOffsetY + this.maxCellCountX < grid.height - 1) {
      this.cellOffsetY += (1 / this.scale)
      this.adustViewPort(0, -32)
    }
    if (y < 0 && this.cellOffsetY > 0) {
      this.cellOffsetY -= (1 / this.scale)
      this.adustViewPort(0, 32)
    }
  }

  public adustViewPort(xPos: number, yPos: number, asset?: Asset, gridWidth?: number, gridHeight?: number) {
    if (yPos > 0 && this.canvasViewPortOffsetY >= 0) {
      yPos = 0
    } if (xPos > 0 && this.canvasViewPortOffsetX >= 0) {
      xPos = 0
    }
    if (xPos < 0 && this.canvasViewPortOffsetX - this.canvasSize <= (-1 * gridWidth * GameSettings.cellDimension) + 64) {
      xPos = 0
    }
    if (yPos < 0 && this.canvasViewPortOffsetY - this.canvasSize <= (-1 * gridHeight * GameSettings.cellDimension) + 64) {
      yPos = 0
    }

    let xPosAdjust = 0
    let yPosAdjust = 0

    xPosAdjust = xPos * (1 / this.scale)
    yPosAdjust = yPos * (1 / this.scale)

    this.canvasViewPortOffsetX += xPos
    this.canvasViewPortOffsetY += yPos

    this.fogCTX.translate(xPosAdjust, yPosAdjust)
    this.blackoutCTX.translate(xPosAdjust, yPosAdjust)
    this.backgroundCTX.translate(xPosAdjust, yPosAdjust)
    this.overlayCTX.translate(xPosAdjust, yPosAdjust)
    this.foregroundCTX.translate(xPosAdjust, yPosAdjust)
  }

  public resetViewport(): void {
    const xPos = -1 * this.canvasViewPortOffsetX
    const yPos = -1 * this.canvasViewPortOffsetY
    this.adustViewPort(xPos, yPos)
  }

  public setupCanvases(gridWidth: number, gridHeight: number): void {
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

    if (!asset || GameSettings.gm || !GameSettings.trackMovement) { return }

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


  public mouseScrollCanvas(clickX: number, clickY: number, grid: GridService, sensitivity: number = 96): void {

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