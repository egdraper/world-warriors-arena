import { ElementRef } from "@angular/core"
import { Cell } from "../models/cell.model"
import { GameSettings } from "../models/game-settings"
import { MapService } from "../services/map.service"


export class LargeCanvasImage {
  public background: HTMLImageElement
  // public foreground: HTMLImageElement

  constructor(  
    public drawingCanvas: ElementRef<HTMLCanvasElement>,
    public drawingCTX: CanvasRenderingContext2D
  ){}

  public createLargeImage(gridWidth: number, gridHeight: number, mapService: MapService) {
    this.drawingCTX.canvas.height = gridWidth
    this.drawingCTX.canvas.width = gridHeight

    this.drawLargeImageObstacles(this.drawingCTX, mapService)

    const bimg = this.drawingCanvas.nativeElement.toDataURL("image/png")
    const bimage = new Image()
    bimage.src = bimg
    this.background = bimage
  }


  public drawLargeImageObstacles(ctx: CanvasRenderingContext2D, mapService: MapService): void {
    mapService.activeMap.gridDisplay.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        this.drawLargeImageBackgroundCell(cell, ctx)
      })
    })
    this.drawGridLines(mapService, ctx)
    mapService.activeMap.gridDisplay.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        this.drawLargeImageCells(cell, ctx)
      })
    })
  }

  // Draws Grid Lines  
  public drawGridLines(mapService: MapService, ctx: CanvasRenderingContext2D): void {
    for (let h = 0; h <= mapService.activeMap.height; h++) {
      for (let w = 0; w <= mapService.activeMap.width; w++) {
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