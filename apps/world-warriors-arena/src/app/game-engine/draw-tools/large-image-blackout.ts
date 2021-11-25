import { ElementRef } from "@angular/core"
import { Cell } from "../../models/cell.model"
import { GameSettings } from "../../models/game-settings"
import { GridService } from "../grid.service"

export class LargeBlackoutImage {
  public blackoutLargeImage: HTMLImageElement

  constructor(  
    public drawBlackoutCanvas: ElementRef<HTMLCanvasElement>,
    public drawBlackoutCTX: CanvasRenderingContext2D

  ){}

  public initialize(gridWidth: number, gridHeight: number): void {
    this.drawBlackoutCTX.canvas.height = gridWidth * 32
    this.drawBlackoutCTX.canvas.width = gridHeight * 32
  }

  public createLargeBlackoutImage() {
    console.log("start" + performance.now())
    const bimg = this.drawBlackoutCanvas.nativeElement.toDataURL("image/png")
    console.log(bimg)
    const bimage = new Image()
    bimage.src = bimg
    this.blackoutLargeImage = bimage
    console.log("end" + performance.now())
  }
}