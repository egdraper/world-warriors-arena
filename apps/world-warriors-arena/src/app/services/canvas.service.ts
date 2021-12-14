import { ElementRef, Injectable } from "@angular/core";
import { MapService } from "./map.service";
import { Asset } from "../models/assets.model";
import { Cell } from "../models/cell.model";
import { GameSettings } from "../models/game-settings";
import { GameMap } from "../models/game-map";
import { GSM } from "../app.service.manager";

@Injectable()
export class CanvasService {
  public canvasSizeX = 969
  public canvasSizeY = 969
  public canvasViewPortOffsetX = 0
  public canvasViewPortOffsetY = 0
  public centerPointX = 0
  public centerPointY = 0
  public topLeftVisibleCell: Cell
  public topRightVisibleCell: Cell
  public bottomLeftVisibleCell: Cell
  public maxCellCountX = 0
  public maxCellCountY = 0
  public cellOffsetX = 0
  public cellOffsetY = 0
  public portalEntry: Cell[] = []
  public editMode = true

  public largeImageBackground: HTMLImageElement
  public largeImageForeground: HTMLImageElement

  public overlayCanvas: ElementRef<HTMLCanvasElement>;
  public overlayCTX: CanvasRenderingContext2D;

  public foregroundCanvas: ElementRef<HTMLCanvasElement>;
  public foregroundCTX: CanvasRenderingContext2D;

  public backgroundCanvas: ElementRef<HTMLCanvasElement>;
  public backgroundCTX: CanvasRenderingContext2D;
 
  public drawBlackoutCanvas: ElementRef<HTMLCanvasElement>;
  public drawBlackoutCTX: CanvasRenderingContext2D;

  public fogCanvas: ElementRef<HTMLCanvasElement>;
  public fogCTX: CanvasRenderingContext2D;

  public blackoutCanvas: ElementRef<HTMLCanvasElement>;
  public blackoutCTX: CanvasRenderingContext2D;

  public drawingCanvas: ElementRef<HTMLCanvasElement>;
  public drawingCTX: CanvasRenderingContext2D;

  public setupCanvases(): void {
    this.setCanvasSpecs()

    this.backgroundCTX.canvas.height = this.canvasSizeY
    this.backgroundCTX.canvas.width = this.canvasSizeX
    this.backgroundCTX.scale(GameSettings.scale, GameSettings.scale)

    this.foregroundCTX.canvas.height = this.canvasSizeY
    this.foregroundCTX.canvas.width = this.canvasSizeX
    this.foregroundCTX.scale(GameSettings.scale, GameSettings.scale)

    this.overlayCTX.canvas.height = this.canvasSizeY
    this.overlayCTX.canvas.width = this.canvasSizeX
    this.overlayCTX.scale(GameSettings.scale, GameSettings.scale)

    this.fogCTX.canvas.height = this.canvasSizeY
    this.fogCTX.canvas.width = this.canvasSizeX
    this.fogCTX.scale(GameSettings.scale, GameSettings.scale)

    this.blackoutCTX.canvas.height = this.canvasSizeY
    this.blackoutCTX.canvas.width = this.canvasSizeX
    this.blackoutCTX.scale(GameSettings.scale, GameSettings.scale)
    this.saveState()
  }

  public scrollViewPort(x: number, y: number, speedX: number = 32, speedY: number = 32): void {
    let adjustX = 0
    let adjustY = 0

    if (x > 0 && this.cellOffsetX + this.maxCellCountX < GSM.Map.activeMap.width) {
      this.cellOffsetX += (1 / GameSettings.scale)
      adjustX = -1 * speedX
      adjustY = 0
    }

    if (x < 0 && this.cellOffsetX > 0) {
      this.cellOffsetX -= (1 / GameSettings.scale)
      adjustX = speedX
      adjustY = 0
    }

    if (y > 0 && this.cellOffsetY + this.maxCellCountY < GSM.Map.activeMap.height) {
      this.cellOffsetY += (1 / GameSettings.scale)
      adjustX = 0
      adjustY = -1 * speedY
    }

    if (y < 0 && this.cellOffsetY > 0) {
      this.cellOffsetY -= (1 / GameSettings.scale)
      adjustX = 0
      adjustY = speedY
    }
   
    this.adustViewPort(adjustX, adjustY)

  }
  
  public trackAsset(xPos: number, yPos: number, asset: Asset, adjustCanvasOffsetOnly: boolean = false): void {
    if (asset && GSM.Map.activeMap.width && GSM.Map.activeMap.height) {
      if (!GSM.Map.activeMap.height || !GSM.Map.activeMap.height) {
        throw new Error("Passing in asset requires gridWidth and grid height")
      }

      if (asset.positionX <= this.centerPointX + 32) { xPos = 0 }
      if (asset.positionY <= this.centerPointY + 32) { yPos = 0 }
      if (asset.positionX >= (GSM.Map.activeMap.width * 32) - this.centerPointX) { xPos = 0 }
      if (asset.positionY >= (GSM.Map.activeMap.height * 32) - this.centerPointY) { yPos = 0 }
    }

    if(adjustCanvasOffsetOnly) {
      this.cellOffsetX += xPos
      this.cellOffsetY += yPos
    } else {
      this.adustViewPort(xPos, yPos, GSM.Map.activeMap.width, GSM.Map.activeMap.height)
    }
  }
  
  public centerOverAsset(asset: Asset): void {
    if(!asset || !asset.cell) {return}

    // select Asset
    this.resetViewport()

    let assetXPos = asset.cell.posX <= this.centerPointX ? 0 : -1 * asset.cell.posX + this.centerPointX
    let assetYPos = asset.cell.posY <= this.centerPointY ? 0 : -1 * asset.cell.posY + this.centerPointY

    assetXPos = asset.cell.posX >= (GSM.Map.activeMap.width * 32) - this.centerPointX ? -1 * ((GSM.Map.activeMap.width * 32) - this.canvasSizeX - 32) : assetXPos
    assetYPos = asset.cell.posY >= (GSM.Map.activeMap.width * 32) - this.centerPointY ? -1 * ((GSM.Map.activeMap.height * 32) - this.canvasSizeY - 32) : assetYPos

    const topCorner = GSM.Map.activeMap.getGridCellByCoordinate((-1 * assetXPos), (-1 * assetYPos))
    this.cellOffsetX = topCorner.x
    this.cellOffsetY = topCorner.y

    this.adustViewPort((-1 * this.cellOffsetX * 32), (-1 * this.cellOffsetY * 32))
  }

  public adustViewPort(xPos: number, yPos: number, gridWidth?: number, gridHeight?: number) {
    // console.log(xPos, yPos, this.canvasViewPortOffsetX, this.canvasViewPortOffsetY)
    if (yPos > 0 && this.canvasViewPortOffsetY >= 0) {
      yPos = 0
    } if (xPos > 0 && this.canvasViewPortOffsetX >= 0) {
      xPos = 0
    }
    if (xPos < 0 && this.canvasViewPortOffsetX - this.canvasSizeX <= (-1 * gridWidth * GameSettings.cellDimension)) {
      xPos = 0
    }
    if (yPos < 0 && this.canvasViewPortOffsetY - this.canvasSizeY <= (-1 * gridHeight * GameSettings.cellDimension)) {
      yPos = 0
    }

    let xPosAdjust = 0
    let yPosAdjust = 0

    xPosAdjust = xPos * (1 / GameSettings.scale)
    yPosAdjust = yPos * (1 / GameSettings.scale)

    this.canvasViewPortOffsetX += xPos
    this.canvasViewPortOffsetY += yPos

    this.fogCTX.translate(xPosAdjust, yPosAdjust)
    this.blackoutCTX.translate(xPosAdjust, yPosAdjust)
    this.backgroundCTX.translate(xPosAdjust, yPosAdjust)
    this.overlayCTX.translate(xPosAdjust, yPosAdjust)
    this.foregroundCTX.translate(xPosAdjust, yPosAdjust)
  }

  public pageChangeAdjust(map: GameMap): void {
    this.resetViewport()
    this.canvasViewPortOffsetX += map.changePageXOffset
    this.canvasViewPortOffsetY += map.changePageYOffset

    this.fogCTX.translate(map.changePageXOffset, map.changePageYOffset)
    this.blackoutCTX.translate(map.changePageXOffset, map.changePageYOffset)
    this.backgroundCTX.translate(map.changePageXOffset, map.changePageYOffset)
    this.overlayCTX.translate(map.changePageXOffset, map.changePageYOffset)
    this.foregroundCTX.translate(map.changePageXOffset, map.changePageYOffset)
  }

    
  public resetViewport(): void {
    const xPos = -1 * this.canvasViewPortOffsetX
    const yPos = -1 * this.canvasViewPortOffsetY
    this.cellOffsetX = 0
    this.cellOffsetY = 0
    this.adustViewPort(xPos, yPos)
  }

  public hardAdjust(xPosAdjust: number, yPosAdjust: number) {
    this.fogCTX.translate(xPosAdjust, yPosAdjust)
    this.blackoutCTX.translate(xPosAdjust, yPosAdjust)
    this.backgroundCTX.translate(xPosAdjust, yPosAdjust)
    this.overlayCTX.translate(xPosAdjust, yPosAdjust)
    this.foregroundCTX.translate(xPosAdjust, yPosAdjust)
  }

  public saveState(): void {
    this.fogCTX.save()
    this.blackoutCTX.save()
    this.backgroundCTX.save()
    this.overlayCTX.save()
    this.foregroundCTX.save()
  }

  public restoreState(): void {
    this.fogCTX.restore()
    this.blackoutCTX.restore()
    this.backgroundCTX.restore()
    this.overlayCTX.restore()
    this.foregroundCTX.restore()
  }

  public setCanvasSpecs(): void {
    let perfectHeight = document.getElementsByClassName("game-view")[0].clientHeight
    let perfectWidth = document.getElementsByClassName("game-view")[0].clientWidth

    while (perfectHeight % (GameSettings.scale * 32) !== 0) {
      perfectHeight--
    }
    while (perfectWidth % (GameSettings.scale * 32) !== 0) {
      perfectWidth--
    }

    this.maxCellCountX = perfectWidth / (32 * GameSettings.scale)
    this.maxCellCountY = perfectHeight / (32 * GameSettings.scale)
    this.canvasSizeX = perfectWidth
    this.canvasSizeY = perfectHeight
  }
}