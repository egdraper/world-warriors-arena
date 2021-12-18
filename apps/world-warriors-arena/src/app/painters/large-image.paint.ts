import { ElementRef } from "@angular/core"
import { GSM } from "../app.service.manager"
import { growableItems } from "../game-assets/tile-assets.db"
import { MotionAsset } from "../models/assets.model"
import { Cell, SpriteTile } from "../models/cell.model"
import { GameMap } from "../models/game-map"
import { GameSettings } from "../models/game-settings"
import { MapService } from "../services/map.service"


export class LargeCanvasImage {
  public background: HTMLImageElement
  // public foreground: HTMLImageElement

  constructor(  
    public drawingCanvas: ElementRef<HTMLCanvasElement>,
    public drawingCTX: CanvasRenderingContext2D
  ){}

  public createLargeImage(gridWidth: number, gridHeight: number, map: GameMap): HTMLImageElement {
    this.drawingCTX.canvas.height = gridWidth
    this.drawingCTX.canvas.width = gridHeight

    this.drawLargeImageObstacles(this.drawingCTX, map)

    const bimg = this.drawingCanvas.nativeElement.toDataURL("image/png")
    const bimage = new Image()
    bimage.src = bimg
    this.background = bimage

    return bimage
  }


  private drawLargeImageObstacles(ctx: CanvasRenderingContext2D, map: GameMap): void {
    map.gridDisplay.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        this.drawLargeImageBackgroundCell(cell, ctx)
      })
    })
    this.drawGridLines(map, ctx)
    map.gridDisplay.forEach((row: Cell[]) => {
      row.forEach((cell: Cell) => {
        if (cell.growableTileId && !cell.growableTileOverride) {
          this.calculateGrowableTerrain(cell)
        }
        this.drawLargeImageCells(cell, ctx)
      })
    })
  }

  // Draws Grid Lines  
  private drawGridLines(map: GameMap, ctx: CanvasRenderingContext2D): void {
    for (let h = 0; h <= map.height; h++) {
      for (let w = 0; w <= map.width; w++) {
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
      console.log(cell?.x, cell.y)
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

  // This is used for drawable terrain, it determines which tile goes where when drawing terrain.
  private calculateGrowableTerrain(selectedCell: Cell): void {
    const drawableItem = growableItems.find(item => {
      return selectedCell.growableTileId?.includes(item.id)
    })

    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor?.growableTileId === selectedCell.growableTileId,
      topCenterMatch: topNeighbor?.growableTileId === selectedCell.growableTileId,
      topRightMatch: topRightNeighbor?.growableTileId === selectedCell.growableTileId,
      centerLeftMatch: leftNeighbor?.growableTileId === selectedCell.growableTileId,
      centerRightMatch: rightNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomLeftMatch: bottomLeftNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomCenterMatch: bottomNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomRightMatch: bottomRightNeighbor?.growableTileId === selectedCell.growableTileId
    }

    let tile = drawableItem.spritesTiles.find((spriteTile: SpriteTile) => {
      const topMatch = neighbors.topCenterMatch === spriteTile.drawWhen.topNeighbor || spriteTile.drawWhen.topNeighbor === null
      const topRightMatch = neighbors.topRightMatch === spriteTile.drawWhen.topRightNeighbor || spriteTile.drawWhen.topRightNeighbor === null
      const rightMatch = neighbors.centerRightMatch === spriteTile.drawWhen.rightNeighbor || spriteTile.drawWhen.rightNeighbor === null
      const bottomRightMatch = neighbors.bottomRightMatch === spriteTile.drawWhen.bottomRightNeighbor || spriteTile.drawWhen.bottomRightNeighbor === null
      const bottomMatch = neighbors.bottomCenterMatch === spriteTile.drawWhen.bottomNeighbor || spriteTile.drawWhen.bottomNeighbor === null
      const bottomLeftNeighborMatch = neighbors.bottomLeftMatch === spriteTile.drawWhen.bottomLeftNeighbor || spriteTile.drawWhen.bottomLeftNeighbor === null
      const leftNeighborMatch = neighbors.centerLeftMatch === spriteTile.drawWhen.leftNeighbor || spriteTile.drawWhen.leftNeighbor === null
      const topLeftNeighborMatch = neighbors.topLeftMatch === spriteTile.drawWhen.topLeftNeighbor || spriteTile.drawWhen.topLeftNeighbor === null

      return topMatch &&
        topRightMatch &&
        rightMatch &&
        bottomRightMatch &&
        bottomMatch &&
        bottomLeftNeighborMatch &&
        leftNeighborMatch &&
        topLeftNeighbor &&
        topLeftNeighborMatch
    })

    if (!tile) {
      tile = drawableItem.spritesTiles.find((cliff: SpriteTile) => cliff.default)
    }

    selectedCell.imageTile = tile
  }

  // draws asset
  public drawAsset(gameComponent: MotionAsset): void {
    GSM.Canvas.foregroundCTX.imageSmoothingEnabled = false
    if (gameComponent) {
      GSM.Canvas.foregroundCTX.drawImage(
        gameComponent.image,
        gameComponent.frameXPosition[gameComponent.frameCounter],
        gameComponent.frameYPosition,
        25,
        36,
        gameComponent.positionX - 8,
        gameComponent.positionY - 58,
        50,
        80
      )
      if (gameComponent.selectionIndicator) {
        GSM.Canvas.overlayCTX.clearRect(gameComponent.positionX, gameComponent.positionY, 32, 32);
        GSM.Canvas.overlayCTX.drawImage(
          gameComponent.selectionIndicator.image,
          gameComponent.selectionIndicator.frameXPosition[gameComponent.selectionIndicator.frameXCounter],
          gameComponent.selectionIndicator.frameYPosition[gameComponent.selectionIndicator.frameYCounter],
          25,
          25,
          gameComponent.positionX,
          gameComponent.positionY,
          32,
          32
        )
      }
    }
  }
}